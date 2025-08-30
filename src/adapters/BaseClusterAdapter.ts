/**
 * BaseClusterAdapter - Core cluster functionality and connection management
 * ioredis-compatible cluster client built on valkey-glide
 */

import { GlideClusterClient, GlideClusterClientConfiguration } from '@valkey/valkey-glide';
import { EventEmitter } from 'events';
import {
  RedisOptions,
} from '../types';
import { ParameterTranslator } from '../utils/ParameterTranslator';

export interface ClusterOptions extends RedisOptions {
  enableReadFromReplicas?: boolean;
  scaleReads?: 'master' | 'slave' | 'all';
  maxRedirections?: number;
  retryDelayOnFailover?: number;
  enableOfflineQueue?: boolean;
  readOnly?: boolean;
  nodes?: Array<{ host: string; port: number }>;
}

export abstract class BaseClusterAdapter extends EventEmitter {
  protected glideClusterClient: GlideClusterClient | null = null;
  protected subscriberClient: GlideClusterClient | null = null;
  protected connectionStatus: string = 'disconnected';
  protected options: ClusterOptions;
  protected watchedKeys: Set<string> = new Set();
  protected clientType?: 'client' | 'subscriber' | 'bclient';
  protected enableBlockingOps?: boolean;
  protected suppressBackgroundErrors?: boolean;

  constructor(options: ClusterOptions = {}) {
    super();
    this.options = {
      host: 'localhost',
      port: 6379,
      enableReadFromReplicas: false,
      scaleReads: 'master',
      maxRedirections: 16,
      retryDelayOnFailover: 100,
      enableOfflineQueue: true,
      readOnly: false,
      ...options,
    };

    // Set initial status based on lazyConnect option
    if (this.options.lazyConnect) {
      this.connectionStatus = 'disconnected'; // Start as disconnected with lazy connect
    } else {
      // Auto-connect like ioredis default behavior
      setImmediate(() => {
        this.connect().catch(err => {
          this.emit('error', err);
        });
      });
    }
  }

  // Connection management
  async connect(): Promise<void> {
    if (this.connectionStatus === 'connected') {
      return;
    }

    this.connectionStatus = 'connecting';
    this.emit('connecting');

    try {
      const addresses = this.options.nodes || [{ host: this.options.host!, port: this.options.port! }];
      
      const config: GlideClusterClientConfiguration = {
        addresses,
        readFrom: this.options.enableReadFromReplicas ? 'preferReplica' : 'primary',
      };

      if (this.options.username || this.options.password) {
        config.credentials = {
          username: this.options.username || 'default',
          password: this.options.password!,
        };
      }

      this.glideClusterClient = await GlideClusterClient.createClient(config);
      this.connectionStatus = 'connected';
      this.emit('connect');
      this.emit('ready');
    } catch (error) {
      this.connectionStatus = 'disconnected';
      // Avoid crashing process on background connections without listeners
      const hasErrorListeners = this.listenerCount('error') > 0;
      if (hasErrorListeners) {
        // If there are error listeners, emit the error and don't throw
        this.emit('error', error);
      } else if (!this.suppressBackgroundErrors) {
        // If no listeners and not suppressing errors, throw it
        throw error;
      }
      // If suppressBackgroundErrors is true and no listeners, do nothing
    }
  }

  async disconnect(): Promise<void> {
    if (this.glideClusterClient) {
      await this.glideClusterClient.close();
      this.glideClusterClient = null;
    }
    if (this.subscriberClient) {
      await this.subscriberClient.close();
      this.subscriberClient = null;
    }
    this.connectionStatus = 'disconnected';
    this.emit('end');
  }

  // Bull v3 compatibility - alias for disconnect()
  async quit(): Promise<void> {
    await this.disconnect();
  }

  async ping(message?: string): Promise<string> {
    const client = await this.ensureConnected();
    const options = message ? { message } : undefined;
    const result = await client.ping(options);
    return ParameterTranslator.convertGlideString(result) || 'PONG';
  }

  async info(section?: string): Promise<string> {
    const client = await this.ensureConnected();
    const options = section ? { sections: [section as any] } : undefined;
    const result = await client.info(options);
    
    // Handle cluster response - it returns a Record<string, string> for cluster
    if (typeof result === 'object' && result !== null) {
      // Combine all node info into a single string
      return Object.values(result).join('\n');
    }
    
    return result as string;
  }

  // Generic command execution
  async sendCommand(command: any): Promise<any> {
    const client = await this.ensureConnected();
    
    if (Array.isArray(command)) {
      // Handle array-style commands
      const [cmd, ...args] = command;
      const stringArgs = args.map(arg => {
        if (typeof arg === 'string' || typeof arg === 'number') {
          return arg.toString();
        }
        // Ensure all arguments are strings for Valkey GLIDE compatibility
        return String(arg);
      });
      
      return await client.customCommand([cmd.toString(), ...stringArgs]);
    } else if (typeof command === 'object' && command.name && command.args) {
      // Handle object-style commands
      const stringArgs = command.args.map((arg: any) => {
        if (Array.isArray(arg)) {
          // Ensure array commands are also properly serialized
          return arg.map(item => String(item));
        }
        return String(arg);
      });
      
      return await client.customCommand([command.name, ...stringArgs.flat()]);
    }
    
    throw new Error('Invalid command format');
  }

  async client(subcommand: string, ...args: any[]): Promise<any> {
    const client = await this.ensureConnected();
    return await client.customCommand(['CLIENT', subcommand, ...args.map(String)]);
  }

  // Status property for compatibility
  get status(): string {
    return this.connectionStatus;
  }

  // Core utility methods
  protected async ensureConnected(): Promise<GlideClusterClient> {
    // If already connected, return immediately
    if (this.glideClusterClient && this.connectionStatus === 'connected') {
      return this.glideClusterClient;
    }
    
    // If in lazy connect mode and disconnected, start connection now
    if (this.options.lazyConnect && this.connectionStatus === 'disconnected') {
      await this.connect();
      if (!this.glideClusterClient) {
        throw new Error('Failed to establish cluster connection after lazy connect');
      }
      return this.glideClusterClient;
    }
    
    // If not connected or connecting, connect now
    if (!this.glideClusterClient || this.connectionStatus !== 'connected') {
      await this.connect();
    }
    return this.glideClusterClient!;
  }

  protected async createSubscriberConnection(): Promise<GlideClusterClient> {
    if (this.subscriberClient) {
      return this.subscriberClient;
    }

    const addresses = this.options.nodes || [{ host: this.options.host!, port: this.options.port! }];
    
    const config: GlideClusterClientConfiguration = {
      addresses,
      readFrom: this.options.enableReadFromReplicas ? 'preferReplica' : 'primary',
    };

    if (this.options.username || this.options.password) {
      config.credentials = {
        username: this.options.username || 'default',
        password: this.options.password!,
      };
    }

    this.subscriberClient = await GlideClusterClient.createClient(config);
    return this.subscriberClient;
  }

  // Abstract methods that must be implemented by concrete classes
  abstract duplicate(override?: Partial<ClusterOptions>): Promise<any>;
  abstract pipeline(): any;
  abstract multi(): any;
  abstract defineCommand(name: string, options: { lua: string; numberOfKeys?: number }): void;
}
