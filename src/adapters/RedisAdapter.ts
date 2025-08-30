/**
 * RedisAdapter Implementation
 * ioredis-compatible client built on valkey-glide
 */

import { Batch, GlideClient, Script, TimeUnit, RangeByScore, Boundary } from '@valkey/valkey-glide';
import { EventEmitter } from 'events';
import { pack as msgpack } from 'msgpackr';
import {
  ConnectionStatus,
  IRedisAdapter,
  Multi,
  Pipeline,
  RedisKey,
  RedisOptions,
  RedisValue,
} from '../types';
import { ParameterTranslator } from '../utils/ParameterTranslator';
import { ResultTranslator } from '../utils/ResultTranslator';
import { PubSubMessageHandler } from './PubSubMessageHandler';
import { JsonCommands } from './commands/JsonCommands';
import { SearchCommands, SearchIndex, SearchQuery, SearchResult } from './commands/SearchCommands';

export class RedisAdapter extends EventEmitter implements IRedisAdapter {
  private _status: ConnectionStatus = 'disconnected';
  private redisClient: GlideClient | null = null;
  private subscriberClient: GlideClient | null = null;
  private _options: RedisOptions;
  private watchedKeys: Set<string> = new Set();
  private subscribedChannels: Set<string> = new Set();
  private subscribedPatterns: Set<string> = new Set();

  private messageHandler: PubSubMessageHandler | null = null;
  private _libIntegration: any | null = null;
  private _pubsubEmitter: EventEmitter;
  
  // Bull compatibility: initialization promise tracking
  private _initializing: Promise<void> | null = null;
  
  // Bull compatibility: blocking operation tracking
  public blocked: boolean = false;
  

  constructor();
  constructor(port: number, host?: string);
  constructor(options: RedisOptions);
  constructor(url: string);
  constructor(portOrOptions?: number | RedisOptions | string, host?: string) {
    super();
    
    // Parse constructor arguments (ioredis style)
    if (typeof portOrOptions === 'number') {
      this._options = { port: portOrOptions, host: host || 'localhost' };
    } else if (typeof portOrOptions === 'string') {
      this._options = this.parseRedisUrl(portOrOptions);
    } else if (typeof portOrOptions === 'object') {
      this._options = portOrOptions;
    } else {
      this._options = { port: 6379, host: 'localhost' };
    }


    this._pubsubEmitter = new EventEmitter();

    // Bull compatibility: Initialize the initialization promise
    this._initializing = Promise.resolve();

    // Set initial status based on lazyConnect option
    if (this._options.lazyConnect) {
      this._status = 'wait' as ConnectionStatus;
    } else {
      // Auto-connect like ioredis default behavior
      setImmediate(() => {
        this._initializing = this.connect().catch(err => {
          this.emit('error', err);
          throw err;
        });
      });
    }
  }

  get status(): ConnectionStatus {
    return this._status;
  }

  get options(): RedisOptions {
    // Bull compatibility: expose options in expected format
    return {
      ...this._options,
      redisOptions: this._options // Bull checks client.options.redisOptions
    } as any;
  }

  // Bull compatibility: isReady method
  async isReady(): Promise<this> {
    
    if (this._initializing) {
      await this._initializing;
    }
    
    if (this._status === 'wait') {
      await this.connect();
    }
    
    // Wait until we're actually ready
    let loopCount = 0;
    while (this._status !== 'ready' && this._status !== 'end' && this._status !== 'error') {
      if (loopCount % 100 === 0) { // Log every second (100 * 10ms)
      }
      await new Promise(resolve => setTimeout(resolve, 10));
      loopCount++;
    }
    
    
    if (this._status === 'error' || this._status === 'end') {
      throw new Error('Redis client not ready');
    }
    
    return this;
  }

  private parseRedisUrl(url: string): RedisOptions {
    // Simple URL parsing for redis:// URLs
    const match = url.match(/redis:\/\/(.*?):(\d+)/);
    if (match && match[1] && match[2]) {
      return { host: match[1], port: parseInt(match[2], 10) };
    }
    return { host: 'localhost', port: 6379 };
  }

  // Connection management
  async connect(): Promise<void> {
    
    if (this._status === 'ready' || this._status === 'connecting') {
      return;
    }

    try {
      this._status = 'connecting';
      this.emit('connecting');
      this.emit('connect');
      
      const config = {
        addresses: [{ host: this._options.host || 'localhost', port: this._options.port || 6379 }],
        ...(this._options.password && { 
          credentials: { password: this._options.password }
        })
      };
      
      
      // Create GlideClient
      this.redisClient = await GlideClient.createClient(config);
      
      
      this._status = 'ready';
      this.emit('ready');
      
      
      // Update initialization promise to be resolved
      this._initializing = Promise.resolve();
    } catch (error) {
      this._status = 'error';
      this.emit('error', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this._status === 'disconnected' || this._status === 'disconnecting') {
      return;
    }

    try {
      this._status = 'disconnecting';
      
      // Clean up message handler first
      if (this.messageHandler) {
        try {
          await this.messageHandler.cleanup();
        } catch (error) {
          console.warn('Warning: Error cleaning up message handler:', error);
        }
        this.messageHandler = null;
      }
      
      // Clean up subscriber client
      if (this.subscriberClient) {
        try {
          await this.subscriberClient.close();
        } catch (error) {
          console.warn('Warning: Error closing subscriber client:', error);
        }
        this.subscriberClient = null;
      }
      
      // Disconnect from Redis
      if (this.redisClient) {
        await this.redisClient.close();
        this.redisClient = null;
      }
      
      // Reset state
      this.watchedKeys.clear();
      this.subscribedChannels.clear();
      this.subscribedPatterns.clear();

      
      this._status = 'end';
      this.emit('end');
    } catch (error) {
      this._status = 'error';
      this.emit('error', error);
      throw error;
    }
  }

  // Bull v3 compatibility - alias for disconnect() with ioredis-compatible behavior
  async quit(): Promise<void> {
    if (this._status === 'end' || this._status === 'disconnected') {
      return;
    }
    
    try {
      await this.disconnect();
    } catch (error) {
      // Bull expects quit to not throw on "Connection is closed" errors
      if (error && (error as Error).message !== 'Connection is closed.') {
        throw error;
      }
    }
  }

  async ping(message?: string): Promise<string> {
    const client = await this.ensureConnected();
    const result = await client.ping(message ? { message } : undefined);
    return (result?.toString() || 'PONG');
  }

  async info(section?: string): Promise<string> {
    const client = await this.ensureConnected();
    if (section) {
      try {
        // Map common ioredis sections to GLIDE InfoOptions; fallback to raw section
        const { InfoOptions } = await import('@valkey/valkey-glide/build-ts/Commands');
        const map: Record<string, string> = {
          server: InfoOptions.Server,
          clients: InfoOptions.Clients,
          memory: InfoOptions.Memory,
          persistence: InfoOptions.Persistence,
          stats: InfoOptions.Stats,
          replication: InfoOptions.Replication,
          cpu: InfoOptions.Cpu,
          commandstats: InfoOptions.Commandstats,
          latencystats: InfoOptions.Latencystats,
          sentinel: InfoOptions.Sentinel,
          cluster: InfoOptions.Cluster,
          modules: InfoOptions.Modules,
          keyspace: InfoOptions.Keyspace,
          all: InfoOptions.All,
          default: InfoOptions.Default,
          everything: InfoOptions.Everything,
        };
        const normalized = section.toLowerCase();
        const option = map[normalized] as any;
        if (option) {
          return await client.info([option]);
        }
      } catch {
        // Fallback if dynamic import path changes; continue to customCommand fallback below
      }
    }
    // Fallback to GLIDE native without section (default)
    return await client.info();
  }

  async config(subcommand: string, ...args: any[]): Promise<any> {
    const client = await this.ensureConnected();
    const stringArgs = args.map(arg => String(arg));
    const result = await client.customCommand(['CONFIG', subcommand, ...stringArgs]);
    
    if (Array.isArray(result)) {
      return result.map(item => ParameterTranslator.convertGlideString(item) || '');
    }
    
    return ParameterTranslator.convertGlideString(result) || '';
  }

  async dbsize(): Promise<number> {
    const client = await this.ensureConnected();
    const result = await client.customCommand(['DBSIZE']);
    return typeof result === 'number' ? result : parseInt(String(result)) || 0;
  }

  async memory(subcommand: string, ...args: any[]): Promise<any> {
    const client = await this.ensureConnected();
    const stringArgs = args.map(arg => String(arg));
    const result = await client.customCommand(['MEMORY', subcommand, ...stringArgs]);
    
    if (subcommand.toUpperCase() === 'USAGE') {
      return typeof result === 'number' ? result : parseInt(String(result)) || 0;
    }
    
    return result;
  }

  async echo(message: string): Promise<string> {
    const client = await this.ensureConnected();
    const result = await client.customCommand(['ECHO', message]);
    return ParameterTranslator.convertGlideString(result) || '';
  }

  async time(): Promise<[string, string]> {
    const client = await this.ensureConnected();
    const result = await client.customCommand(['TIME']);
    
    if (Array.isArray(result) && result.length >= 2) {
      return [
        ParameterTranslator.convertGlideString(result[0]) || '0',
        ParameterTranslator.convertGlideString(result[1]) || '0'
      ];
    }
    
    return ['0', '0'];
  }

  async debug(subcommand: string, ...args: any[]): Promise<any> {
    const client = await this.ensureConnected();
    const stringArgs = args.map(arg => String(arg));
    const result = await client.customCommand(['DEBUG', subcommand, ...stringArgs]);
    return ParameterTranslator.convertGlideString(result) || '';
  }

  async slowlog(subcommand: string, ...args: any[]): Promise<any[]> {
    const client = await this.ensureConnected();
    const stringArgs = args.map(arg => String(arg));
    const result = await client.customCommand(['SLOWLOG', subcommand, ...stringArgs]);
    
    if (Array.isArray(result)) {
      return result.map(entry => {
        if (Array.isArray(entry)) {
          return entry.map(item => {
            if (typeof item === 'string' || typeof item === 'number') {
              return item;
            }
            return ParameterTranslator.convertGlideString(item) || '';
          });
        }
        return entry;
      });
    }
    
    return [];
  }

  // ioredis compatibility: sendCommand method for arbitrary Redis commands
  async sendCommand(command: any): Promise<any> {
    const client = await this.ensureConnected();
    
    // Handle both Command objects and string arrays
    if (command && command.name && command.args) {
      // Ensure all arguments are strings for Valkey GLIDE compatibility
      const serializedArgs = command.args.map((arg: any) => {
        if (typeof arg === 'string' || typeof arg === 'number') {
          return String(arg);
        }
        if (arg === null || arg === undefined) {
          return '';
        }
        if (typeof arg === 'object') {
          return JSON.stringify(arg);
        }
        return String(arg);
      });
      return client.customCommand([command.name, ...serializedArgs]);
    } else if (Array.isArray(command)) {
      // Ensure array commands are also properly serialized
      const serializedCommand = command.map(arg => String(arg));
      return client.customCommand(serializedCommand);
    } else {
      throw new Error('Invalid command format');
    }
  }

  // Direct method implementations for common Bull requirements
  async client(subcommand: string, ...args: any[]): Promise<any> {
    return this.call('CLIENT', subcommand, ...args);
  }
  
  // Bull compatibility: stream operations that Bull may use
  async xadd(key: RedisKey, id: string, ...fieldsAndValues: any[]): Promise<string> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    // Convert ioredis format (field1, value1, field2, value2, ...) to GLIDE format [[field1, value1], [field2, value2]]
    const values: [string, string][] = [];
    for (let i = 0; i < fieldsAndValues.length; i += 2) {
      if (i + 1 < fieldsAndValues.length) {
        values.push([String(fieldsAndValues[i]), String(fieldsAndValues[i + 1])]);
      }
    }
    
    // Use native GLIDE method instead of customCommand
    const options = id !== '*' ? { id } : undefined;
    const result = await client.xadd(normalizedKey, values, options);
    
    return ParameterTranslator.convertGlideString(result) || '';
  }
  
  async xread(...args: any[]): Promise<any> {
    const client = await this.ensureConnected();
    
    // Parse ioredis XREAD arguments: [COUNT, count, BLOCK, timeout, STREAMS, key1, key2, ..., id1, id2, ...]
    // Convert to GLIDE format: keys_and_ids: Record<string, string>, options?: StreamReadOptions
    
    let countValue: number | undefined;
    let blockValue: number | undefined;
    let streamsIndex = -1;
    
    // Find STREAMS keyword and parse options
    for (let i = 0; i < args.length; i++) {
      const arg = String(args[i]).toUpperCase();
      if (arg === 'COUNT' && i + 1 < args.length) {
        countValue = parseInt(String(args[i + 1]));
        i++; // Skip the count value
      } else if (arg === 'BLOCK' && i + 1 < args.length) {
        blockValue = parseInt(String(args[i + 1]));
        i++; // Skip the block value
      } else if (arg === 'STREAMS') {
        streamsIndex = i + 1;
        break;
      }
    }
    
    if (streamsIndex === -1) {
      throw new Error('XREAD requires STREAMS keyword');
    }
    
    // Split streams arguments into keys and IDs
    const streamArgs = args.slice(streamsIndex);
    const numStreams = Math.floor(streamArgs.length / 2);
    const keys = streamArgs.slice(0, numStreams);
    const ids = streamArgs.slice(numStreams);
    
    // Build GLIDE keys_and_ids object
    const keys_and_ids: Record<string, string> = {};
    for (let i = 0; i < numStreams; i++) {
      const normalizedKey = ParameterTranslator.normalizeKey(keys[i]);
      keys_and_ids[normalizedKey] = String(ids[i]);
    }
    
    // Build GLIDE options
    const options: any = {};
    if (countValue !== undefined) options.count = countValue;
    if (blockValue !== undefined) options.block = blockValue;
    
    // Use native GLIDE method instead of customCommand
    const result = await client.xread(keys_and_ids, options);
    
    // Convert GLIDE result format to ioredis format
    return ResultTranslator.translateStreamReadResponse(result);
  }

  async xlen(key: RedisKey): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.xlen(normalizedKey);
    return result || 0;
  }

  async xrange(key: RedisKey, start: string, end: string, count?: number): Promise<any[]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    const options = count !== undefined ? { count } : undefined;
    const result = await client.xrange(normalizedKey, 
      { value: start, isInclusive: true }, 
      { value: end, isInclusive: true }, 
      options);
    
    // Convert GLIDE result format to ioredis format
    return ResultTranslator.translateStreamRangeResponse(result);
  }

  async xtrim(key: RedisKey, strategy: string, strategyModifier: string, threshold: string | number): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    // Convert ioredis XTRIM format to GLIDE format
    let options: any = {};
    
    if (strategy.toUpperCase() === 'MAXLEN') {
      if (strategyModifier === '~') {
        options = { method: 'maxlen', exact: false, threshold: Number(threshold) };
      } else {
        options = { method: 'maxlen', exact: true, threshold: Number(threshold) };
      }
    } else if (strategy.toUpperCase() === 'MINID') {
      if (strategyModifier === '~') {
        options = { method: 'minid', exact: false, threshold: String(threshold) };
      } else {
        options = { method: 'minid', exact: true, threshold: String(threshold) };
      }
    }
    
    const result = await client.xtrim(normalizedKey, options);
    return typeof result === 'number' ? result : 0;
  }

  async xreadgroup(group: string, consumer: string, ...args: any[]): Promise<any> {
    const client = await this.ensureConnected();
    
    // Parse ioredis XREADGROUP arguments: [COUNT, count, BLOCK, timeout, NOACK, STREAMS, key1, key2, ..., id1, id2, ...]
    // Convert to GLIDE format: group, consumer, keys_and_ids: Record<string, string>, options?: StreamReadGroupOptions
    
    let countValue: number | undefined;
    let blockValue: number | undefined;
    let noAck = false;
    let streamsIndex = -1;
    
    // Find STREAMS keyword and parse options
    for (let i = 0; i < args.length; i++) {
      const arg = String(args[i]).toUpperCase();
      if (arg === 'COUNT' && i + 1 < args.length) {
        countValue = parseInt(String(args[i + 1]));
        i++; // Skip the count value
      } else if (arg === 'BLOCK' && i + 1 < args.length) {
        blockValue = parseInt(String(args[i + 1]));
        i++; // Skip the block value
      } else if (arg === 'NOACK') {
        noAck = true;
      } else if (arg === 'STREAMS') {
        streamsIndex = i + 1;
        break;
      }
    }
    
    if (streamsIndex === -1) {
      throw new Error('XREADGROUP requires STREAMS keyword');
    }
    
    // Split streams arguments into keys and IDs
    const streamArgs = args.slice(streamsIndex);
    const numStreams = Math.floor(streamArgs.length / 2);
    const keys = streamArgs.slice(0, numStreams);
    const ids = streamArgs.slice(numStreams);
    
    // Build GLIDE keys_and_ids object
    const keys_and_ids: Record<string, string> = {};
    for (let i = 0; i < numStreams; i++) {
      const normalizedKey = ParameterTranslator.normalizeKey(keys[i]);
      keys_and_ids[normalizedKey] = String(ids[i]);
    }
    
    // Build GLIDE options
    const options: any = {};
    if (countValue !== undefined) options.count = countValue;
    if (blockValue !== undefined) options.block = blockValue;
    if (noAck) options.noAck = true;
    
    // Use native GLIDE method instead of customCommand
    const result = await client.xreadgroup(group, consumer, keys_and_ids, options);
    
    // TODO: Convert GLIDE result format to ioredis format
    // For now, return as-is (will be improved in Phase 1.3 with ResultTranslator)
    return result;
  }
  
  // Database management
  async flushdb(): Promise<string> {
    const client = await this.ensureConnected();
    return await client.flushdb();
  }

  async flushall(): Promise<string> {
    const client = await this.ensureConnected();
    return await client.flushall();
  }

  // Bull compatibility: additional Lua script support
  async script(subcommand: string, ...args: any[]): Promise<any> {
    const client = await this.ensureConnected();
    const serializedArgs = args.map(arg => String(arg));
    return client.customCommand(['SCRIPT', subcommand, ...serializedArgs]);
  }

  // BullMQ-critical commands
  async bzpopmin(...args: any[]): Promise<[string, string, string] | null> {
    const client = await this.ensureConnected();
    
    let keys: RedisKey[];
    let timeout: number;
    
    // Handle parameter order: keys first, timeout last
    if (typeof args[args.length - 1] === 'number') {
      timeout = args[args.length - 1];
      keys = args.slice(0, -1);
    } else {
      throw new Error('Invalid bzpopmin arguments: timeout must be provided');
    }
    
    const normalizedKeys = keys.map(ParameterTranslator.normalizeKey);
    
    // Use native GLIDE method instead of customCommand
    const result = await client.bzpopmin(normalizedKeys, timeout);
    
    if (Array.isArray(result) && result.length === 3) {
      return [
        ParameterTranslator.convertGlideString(result[0]) || '',
        ParameterTranslator.convertGlideString(result[1]) || '',
        result[2].toString() // Convert score number to string for ioredis compatibility
      ];
    }
    
    return null;
  }

  async bzpopmax(...args: any[]): Promise<[string, string, string] | null> {
    const client = await this.ensureConnected();
    
    let keys: RedisKey[];
    let timeout: number;
    
    // Handle parameter order: keys first, timeout last
    if (typeof args[args.length - 1] === 'number') {
      timeout = args[args.length - 1];
      keys = args.slice(0, -1);
    } else {
      throw new Error('Invalid bzpopmax arguments: timeout must be provided');
    }
    
    const normalizedKeys = keys.map(ParameterTranslator.normalizeKey);
    
    // Use native GLIDE method instead of customCommand
    const result = await client.bzpopmax(normalizedKeys, timeout);
    
    if (Array.isArray(result) && result.length === 3) {
      return [
        ParameterTranslator.convertGlideString(result[0]) || '',
        ParameterTranslator.convertGlideString(result[1]) || '',
        result[2].toString() // Convert score number to string for ioredis compatibility
      ];
    }
    
    return null;
  }

  async xack(key: RedisKey, group: string, ...ids: string[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    // Use native GLIDE method instead of customCommand
    return await client.xack(normalizedKey, group, ids);
  }

  async xgroup(subcommand: string, ...args: any[]): Promise<any> {
    const client = await this.ensureConnected();
    const sub = subcommand.toUpperCase();
    switch (sub) {
      case 'CREATE': {
        const key = String(args[0]);
        const groupName = String(args[1]);
        const id = String(args[2]);
        const rest = args.slice(3).map(String);
        const normalizedKey = ParameterTranslator.normalizeKey(key);
        const options: any = {};
        if (rest.includes('MKSTREAM')) options.mkstream = true;
        const entriesReadIndex = rest.findIndex(v => v.toUpperCase() === 'ENTRIESREAD');
        if (entriesReadIndex >= 0 && rest[entriesReadIndex + 1]) {
          options.entriesRead = Number(rest[entriesReadIndex + 1]);
        }
        return await (client as any).xgroupCreate(normalizedKey, groupName, id, options);
      }
      case 'DESTROY': {
        const key = String(args[0]);
        const groupName = String(args[1]);
        const normalizedKey = ParameterTranslator.normalizeKey(key);
        return await (client as any).xgroupDestroy(normalizedKey, groupName);
      }
      case 'CREATECONSUMER': {
        const key = String(args[0]);
        const groupName = String(args[1]);
        const consumerName = String(args[2]);
        const normalizedKey = ParameterTranslator.normalizeKey(key);
        return await (client as any).xgroupCreateConsumer(normalizedKey, groupName, consumerName);
      }
      case 'DELCONSUMER': {
        const key = String(args[0]);
        const groupName = String(args[1]);
        const consumerName = String(args[2]);
        const normalizedKey = ParameterTranslator.normalizeKey(key);
        return await (client as any).xgroupDelConsumer(normalizedKey, groupName, consumerName);
      }
      case 'SETID': {
        const key = String(args[0]);
        const groupName = String(args[1]);
        const id = String(args[2]);
        const rest = args.slice(3).map(String);
        const normalizedKey = ParameterTranslator.normalizeKey(key);
        const options: any = {};
        const entriesReadIndex = rest.findIndex(v => v.toUpperCase() === 'ENTRIESREAD');
        if (entriesReadIndex >= 0 && rest[entriesReadIndex + 1]) {
          options.entriesRead = Number(rest[entriesReadIndex + 1]);
        }
        return await (client as any).xgroupSetId(normalizedKey, groupName, id, options);
      }
      default:
        // Fallback for other subcommands not mapped
        return await (client as any).customCommand(['XGROUP', subcommand, ...args.map(String)]);
    }
  }

  async xpending(key: RedisKey, group: string, ...args: any[]): Promise<any> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    if (args.length === 0) {
      return await (client as any).xpending(normalizedKey, group);
    }
    // Extended form: start end count [consumer]
    const [start, end, count, consumer] = args.map(String);
    const options: any = {};
    if (start) options.start = { value: start, isInclusive: true };
    if (end) options.end = { value: end, isInclusive: true };
    if (count) options.count = Number(count);
    if (consumer) options.consumer = consumer;
    return await (client as any).xpending(normalizedKey, group, options);
  }

  async xclaim(key: RedisKey, group: string, consumer: string, minIdleTime: number, ...ids: string[]): Promise<any> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    // Map common options if passed via ids tail (JUSTID, IDLE, RETRYCOUNT, FORCE, LASTID)
    const parsedIds: string[] = [];
    const options: any = {};
    for (let i = 0; i < ids.length; i++) {
      const token = String(ids[i]).toUpperCase();
      if (token === 'JUSTID') { options.justId = true; continue; }
      if (token === 'IDLE' && ids[i+1]) { options.idle = Number(ids[++i]); continue; }
      if (token === 'RETRYCOUNT' && ids[i+1]) { options.retryCount = Number(ids[++i]); continue; }
      if (token === 'FORCE') { options.isForce = true; continue; }
      if (token === 'LASTID' && ids[i+1]) { options.lastId = String(ids[++i]); continue; }
      parsedIds.push(String(ids[i]));
    }
    return await (client as any).xclaim(normalizedKey, group, consumer, Number(minIdleTime), parsedIds, options);
  }

  // Additional ioredis compatibility methods
  async duplicate(override?: Partial<RedisOptions>): Promise<RedisAdapter> {
    const options = override ? { ...this._options, ...override } : this._options;
    const newAdapter = new RedisAdapter(options);
    
    // Copy client type if set
    if ((this as any).clientType) {
      (newAdapter as any).clientType = (this as any).clientType;
    }
    
    // For Bull compatibility: return immediately, connect in background
    // Bull expects synchronous client return from createClient
    setImmediate(() => {
    newAdapter.connect().catch(err => {
      console.error('Background connection failed for duplicated client:', err);
      newAdapter.emit('error', err);
      });
    });
    
    return newAdapter;
  }
  
  // Bull-specific compatibility: createClient factory method
  static createClient(type: 'client' | 'subscriber' | 'bclient', options?: RedisOptions): RedisAdapter {
    console.log(`🔧 Creating ${type} Redis client for Bull integration`);
    
    const adapter = new RedisAdapter(options || {});
    
    // Set client type for specialized behavior
    (adapter as any).clientType = type;
    
    if (type === 'bclient') {
      // Enable blocking operations
      (adapter as any).enableBlockingOps = true;
    }
    
    // Bull expects immediate return - connect asynchronously
    setImmediate(() => {
    adapter.connect().catch(err => {
      console.error(`Failed to connect ${type} client for Bull:`, err);
      adapter.emit('error', err);
      });
    });
    
    return adapter;
  }

  /**
   * Ensure client is connected before executing commands
   * Enhanced for Bull compatibility with improved timing and connection state management
   */
  private async ensureConnected(): Promise<GlideClient> {
    // If already connected, return immediately
    if (this.redisClient && this._status === 'ready') {
      return this.redisClient;
    }
    
    // If in wait status (lazyConnect), start connection now
    if (this._status === ('wait' as ConnectionStatus)) {
      await this.connect();
      if (!this.redisClient) {
        throw new Error('Failed to establish connection after lazy connect');
      }
      return this.redisClient;
    }
    
    // If connection is in progress, wait for it with extended timeout for Bull
    if (this._status === 'connecting') {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout waiting for existing connection'));
        }, 10000); // Extended timeout for Bull integration
        
        const onReady = () => {
          clearTimeout(timeout);
          this.removeListener('error', onError);
          if (this.redisClient) {
            resolve(this.redisClient);
          } else {
            reject(new Error('Connection established but client is null'));
          }
        };
        
        const onError = (err: Error) => {
          clearTimeout(timeout);
          this.removeListener('ready', onReady);
          reject(err);
        };
        
        this.once('ready', onReady);
        this.once('error', onError);
      });
    }
    
    // Start new connection with enhanced error handling
    if (!this.redisClient) {
      try {
        await this.connect();
      } catch (connectError) {
        // Enhanced error context for Bull debugging
        const errorMessage = connectError instanceof Error ? connectError.message : String(connectError);
        const enhancedError = new Error(`Failed to establish Redis connection for Bull: ${errorMessage}`);
        if (connectError instanceof Error && connectError.stack) {
          enhancedError.stack = connectError.stack;
        }
        throw enhancedError;
      }
    }
    
    if (!this.redisClient) {
      throw new Error('Failed to establish connection - client is null after connect()');
    }
    
    return this.redisClient;
  }







  // String commands
  async set(key: RedisKey, value: RedisValue, ...args: any[]): Promise<string | null> {
    const client = await this.ensureConnected();
    const translated = ParameterTranslator.translateSetArgs([key, value, ...args]);
    
    const result = await client.set(translated.key, translated.value, translated.options);
    
    // If result is null, it means conditional set failed (NX/XX condition not met)
    if (result === null) {
      return null;
    }
    
    return ParameterTranslator.convertGlideString(result) || 'OK';
  }

  async get(key: RedisKey): Promise<string | null> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    const result = await client.get(normalizedKey);
    const converted = ParameterTranslator.convertGlideString(result);
    return converted;
  }

  async mget(...keysOrArray: any[]): Promise<(string | null)[]> {
    const client = await this.ensureConnected();
    const keyStrings = ParameterTranslator.translateMGetArgs(keysOrArray);
    const result = await client.mget(keyStrings);
    return ParameterTranslator.convertGlideStringArray(result);
  }

  async mset(...argsOrHash: any[]): Promise<string> {
    const client = await this.ensureConnected();
    const keyValueMap = ParameterTranslator.translateMSetArgs(argsOrHash);
    await client.mset(keyValueMap);
    return 'OK';
  }

  async incr(key: RedisKey): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.incr(normalizedKey);
  }

  async decr(key: RedisKey): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.decr(normalizedKey);
  }

  async incrby(key: RedisKey, increment: number): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.incrBy(normalizedKey, increment);
  }

  async decrby(key: RedisKey, decrement: number): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.decrBy(normalizedKey, decrement);
  }

  async incrbyfloat(key: RedisKey, increment: number): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.incrByFloat(normalizedKey, increment);
  }

  async append(key: RedisKey, value: RedisValue): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedValue = ParameterTranslator.normalizeValue(value);
    return await client.append(normalizedKey, normalizedValue);
  }

  async strlen(key: RedisKey): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.strlen(normalizedKey);
  }

  async getrange(key: RedisKey, start: number, end: number): Promise<string> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.getrange(normalizedKey, start, end);
    return ParameterTranslator.convertGlideString(result) || '';
  }

  async setrange(key: RedisKey, offset: number, value: RedisValue): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedValue = ParameterTranslator.normalizeValue(value);
    return await client.setrange(normalizedKey, offset, normalizedValue);
  }

  async setex(key: RedisKey, seconds: number, value: RedisValue): Promise<string> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedValue = ParameterTranslator.normalizeValue(value);
    await client.set(normalizedKey, normalizedValue, { expiry: { type: TimeUnit.Seconds, count: seconds } });
    return 'OK';
  }

  async setnx(key: RedisKey, value: RedisValue): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedValue = ParameterTranslator.normalizeValue(value);
    const result = await client.set(normalizedKey, normalizedValue, { conditionalSet: 'onlyIfDoesNotExist' });
    return result === 'OK' ? 1 : 0;
  }

  async psetex(key: RedisKey, milliseconds: number, value: RedisValue): Promise<string> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedValue = ParameterTranslator.normalizeValue(value);
    await client.set(normalizedKey, normalizedValue, { expiry: { type: TimeUnit.Milliseconds, count: milliseconds } });
    return 'OK';
  }

  // Hash commands
  async hset(key: RedisKey, ...args: any[]): Promise<number> {
    const client = await this.ensureConnected();
    const translated = ParameterTranslator.translateHSetArgs([key, ...args]);
    const hashDataType = Object.entries(translated.fieldValues).map(([field, value]) => ({
      field,
      value
    }));
    return await client.hset(translated.key, hashDataType);
  }

  async hget(key: RedisKey, field: string): Promise<string | null> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.hget(normalizedKey, field);
    return ParameterTranslator.convertGlideString(result);
  }

  async hmset(key: RedisKey, ...args: any[]): Promise<string> {
    const client = await this.ensureConnected();
    const translated = ParameterTranslator.translateHSetArgs([key, ...args]);
    const hashDataType = Object.entries(translated.fieldValues).map(([field, value]) => ({
      field,
      value
    }));
    await client.hset(translated.key, hashDataType);
    return 'OK';
  }

  async hmget(key: RedisKey, ...fieldsOrArray: any[]): Promise<(string | null)[]> {
    const client = await this.ensureConnected();
    const fields = Array.isArray(fieldsOrArray[0]) ? fieldsOrArray[0] : fieldsOrArray;
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.hmget(normalizedKey, fields);
    return ParameterTranslator.convertGlideStringArray(result);
  }

  async hgetall(key: RedisKey): Promise<Record<string, string>> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    const result = await client.hgetall(normalizedKey);
    const converted: Record<string, string> = {};
    
    if (result) {
      // Valkey GLIDE returns an array of {field, value} objects
      if (Array.isArray(result)) {
        for (const item of result) {
          if (item && typeof item === 'object' && 'field' in item && 'value' in item) {
            const field = ParameterTranslator.convertGlideString(item.field) || '';
            const value = ParameterTranslator.convertGlideString(item.value) || '';
            converted[field] = value;
          }
        }
      } else {
        // Fallback for other possible formats
        for (const [field, value] of Object.entries(result)) {
          converted[ParameterTranslator.convertGlideString(field) || ''] = 
            ParameterTranslator.convertGlideString(value) || '';
        }
      }
    }
    
    if (normalizedKey.includes(':') && Object.keys(converted).length > 0) {
    }
    
    return converted;
  }

  async hdel(key: RedisKey, ...fields: string[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.hdel(normalizedKey, fields);
  }

  async hexists(key: RedisKey, field: string): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.hexists(normalizedKey, field);
    return result ? 1 : 0;
  }

  async hkeys(key: RedisKey): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.hkeys(normalizedKey);
    const converted = ParameterTranslator.convertGlideStringArray(result);
    return converted ? converted.filter((val): val is string => val !== null) : [];
  }

  async hvals(key: RedisKey): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.hvals(normalizedKey);
    const converted = ParameterTranslator.convertGlideStringArray(result);
    return converted ? converted.filter((val): val is string => val !== null) : [];
  }

  async hlen(key: RedisKey): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.hlen(normalizedKey);
  }

  async hincrby(key: RedisKey, field: string, increment: number): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.hincrBy(normalizedKey, field, increment);
  }

  async hincrbyfloat(key: RedisKey, field: string, increment: number): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);

    // Get current value to perform precision-safe arithmetic
    const currentValue = await client.hget(normalizedKey, field);
    const currentNum = currentValue
      ? parseFloat(ParameterTranslator.convertGlideString(currentValue) || '0')
      : 0;

    // Calculate new value with proper precision
    const newValue = currentNum + increment;
    const { ResultTranslator } = await import('../utils/ResultTranslator');
    const formattedValue = ResultTranslator.formatFloatResult(newValue);

    // Store the properly formatted value and return the result
    await client.hset(normalizedKey, [{ field, value: formattedValue }]);
    return parseFloat(formattedValue);
  }

  async hsetnx(key: RedisKey, field: string, value: RedisValue): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedValue = ParameterTranslator.normalizeValue(value);
    const result = await client.hsetnx(normalizedKey, field, normalizedValue);
    return result ? 1 : 0;
  }

  // List commands
  async lpush(key: RedisKey, ...elementsOrArray: any[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const elements = Array.isArray(elementsOrArray[0]) ? elementsOrArray[0] : elementsOrArray;
    const normalizedElements = elements.map(el => ParameterTranslator.normalizeValue(el));
    return await client.lpush(normalizedKey, normalizedElements);
  }

  async rpush(key: RedisKey, ...elementsOrArray: any[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const elements = Array.isArray(elementsOrArray[0]) ? elementsOrArray[0] : elementsOrArray;
    const normalizedElements = elements.map(el => ParameterTranslator.normalizeValue(el));
    return await client.rpush(normalizedKey, normalizedElements);
  }

  async lpop(key: RedisKey, count?: number): Promise<string | string[] | null> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    if (count !== undefined) {
      const result = await client.lpopCount(normalizedKey, count);
      if (result === null) return null;
      const converted = ParameterTranslator.convertGlideStringArray(result);
      return converted ? converted.filter((val): val is string => val !== null) : [];
    } else {
      const result = await client.lpop(normalizedKey);
      return ParameterTranslator.convertGlideString(result);
    }
  }

  async rpop(key: RedisKey, count?: number): Promise<string | string[] | null> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    if (count !== undefined) {
      const result = await client.rpopCount(normalizedKey, count);
      if (result === null) return null;
      const converted = ParameterTranslator.convertGlideStringArray(result);
      return converted ? converted.filter((val): val is string => val !== null) : [];
    } else {
      const result = await client.rpop(normalizedKey);
      return ParameterTranslator.convertGlideString(result);
    }
  }

  async lrange(key: RedisKey, start: number, stop: number): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.lrange(normalizedKey, start, stop);
    const converted = ParameterTranslator.convertGlideStringArray(result);
    return converted ? converted.filter((val): val is string => val !== null) : [];
  }

  async llen(key: RedisKey): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    const result = await client.llen(normalizedKey);
    return result;
  }

  async lindex(key: RedisKey, index: number): Promise<string | null> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.lindex(normalizedKey, index);
    return ParameterTranslator.convertGlideString(result);
  }

  async lset(key: RedisKey, index: number, element: RedisValue): Promise<string> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedElement = ParameterTranslator.normalizeValue(element);
    await client.lset(normalizedKey, index, normalizedElement);
    return 'OK';
  }

  async ltrim(key: RedisKey, start: number, stop: number): Promise<string> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    await client.ltrim(normalizedKey, start, stop);
    return 'OK';
  }

  async lrem(key: RedisKey, count: number, element: RedisValue): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedElement = ParameterTranslator.normalizeValue(element);
    return await client.lrem(normalizedKey, count, normalizedElement);
  }

  async lpushx(key: RedisKey, ...elements: RedisValue[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedElements = elements.map(el => ParameterTranslator.normalizeValue(el));
    return await client.lpushx(normalizedKey, normalizedElements);
  }

  async rpushx(key: RedisKey, ...elements: RedisValue[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedElements = elements.map(el => ParameterTranslator.normalizeValue(el));
    return await client.rpushx(normalizedKey, normalizedElements);
  }

  // Blocking list operations - critical for queue systems
  // BullMQ-compatible blpop: supports both parameter orders
  async blpop(...args: any[]): Promise<[string, string] | null> {
    const client = await this.ensureConnected();
    
    let keys: RedisKey[];
    let timeout: number;
    
    // Handle both ioredis styles:
    // 1. blpop(timeout, ...keys) - original ioredis style
    // 2. blpop(...keys, timeout) - BullMQ style
    if (typeof args[args.length - 1] === 'number') {
      // BullMQ style: keys first, timeout last
      timeout = args[args.length - 1];
      keys = args.slice(0, -1);
    } else if (typeof args[0] === 'number') {
      // Original ioredis style: timeout first, keys after
      timeout = args[0];
      keys = args.slice(1);
    } else {
      throw new Error('Invalid blpop arguments: timeout must be provided');
    }
    
    const normalizedKeys = keys.map(ParameterTranslator.normalizeKey);
    
    const result = await client.blpop(normalizedKeys, timeout);
    
    if (Array.isArray(result) && result.length === 2) {
      return [
        ParameterTranslator.convertGlideString(result[0]) || '',
        ParameterTranslator.convertGlideString(result[1]) || ''
      ];
    }
    
    return null;
  }

  // BullMQ-compatible brpop: supports both parameter orders
  async brpop(...args: any[]): Promise<[string, string] | null> {
    const client = await this.ensureConnected();
    
    let keys: RedisKey[];
    let timeout: number;
    
    // Handle both ioredis styles:
    // 1. brpop(timeout, ...keys) - original ioredis style
    // 2. brpop(...keys, timeout) - BullMQ style
    if (typeof args[args.length - 1] === 'number') {
      // BullMQ style: keys first, timeout last
      timeout = args[args.length - 1];
      keys = args.slice(0, -1);
    } else if (typeof args[0] === 'number') {
      // Original ioredis style: timeout first, keys after
      timeout = args[0];
      keys = args.slice(1);
    } else {
      throw new Error('Invalid brpop arguments: timeout must be provided');
    }
    
    const normalizedKeys = keys.map(ParameterTranslator.normalizeKey);
    
    const result = await client.brpop(normalizedKeys, timeout);
    
    if (Array.isArray(result) && result.length === 2) {
      return [
        ParameterTranslator.convertGlideString(result[0]) || '',
        ParameterTranslator.convertGlideString(result[1]) || ''
      ];
    }
    
    return null;
  }



  // Set commands
  async sadd(key: RedisKey, ...members: RedisValue[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedMembers = members.map(member => ParameterTranslator.normalizeValue(member));
    return await client.sadd(normalizedKey, normalizedMembers);
  }

  async srem(key: RedisKey, ...members: RedisValue[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedMembers = members.map(member => ParameterTranslator.normalizeValue(member));
    return await client.srem(normalizedKey, normalizedMembers);
  }

  async smembers(key: RedisKey): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.smembers(normalizedKey);
    if (result instanceof Set) {
      return Array.from(result).map(item => ParameterTranslator.convertGlideString(item) || '');
    }
    const converted = ParameterTranslator.convertGlideStringArray(result);
    return converted ? converted.filter((val): val is string => val !== null) : [];
  }

  async scard(key: RedisKey): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.scard(normalizedKey);
  }

  async sismember(key: RedisKey, member: RedisValue): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedMember = ParameterTranslator.normalizeValue(member);
    const result = await client.sismember(normalizedKey, normalizedMember);
    return result ? 1 : 0;
  }

  async spop(key: RedisKey, count?: number): Promise<string | string[] | null> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    if (count !== undefined) {
      const result = await client.spopCount(normalizedKey, count);
      if (result === null) return null;
      if (result instanceof Set) {
        return Array.from(result).map(item => ParameterTranslator.convertGlideString(item) || '');
      }
      const converted = ParameterTranslator.convertGlideStringArray(result);
      return converted ? converted.filter((val): val is string => val !== null) : [];
    } else {
      const result = await client.spop(normalizedKey);
      return ParameterTranslator.convertGlideString(result);
    }
  }

  async srandmember(key: RedisKey, count?: number): Promise<string | string[] | null> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    if (count !== undefined) {
      const result = await client.srandmemberCount(normalizedKey, count);
      if (result === null) return null;
      const converted = ParameterTranslator.convertGlideStringArray(result);
      return converted ? converted.filter((val): val is string => val !== null) : [];
    } else {
      const result = await client.srandmember(normalizedKey);
      return ParameterTranslator.convertGlideString(result);
    }
  }

  async sunion(...keys: RedisKey[]): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKeys = keys.map(key => ParameterTranslator.normalizeKey(key));
    const result = await client.sunion(normalizedKeys);
    if (result instanceof Set) {
      return Array.from(result).map(item => ParameterTranslator.convertGlideString(item) || '');
    }
    const converted = ParameterTranslator.convertGlideStringArray(result);
    return converted ? converted.filter((val): val is string => val !== null) : [];
  }

  async sinter(...keys: RedisKey[]): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKeys = keys.map(key => ParameterTranslator.normalizeKey(key));
    const result = await client.sinter(normalizedKeys);
    if (result instanceof Set) {
      return Array.from(result).map(item => ParameterTranslator.convertGlideString(item) || '');
    }
    const converted = ParameterTranslator.convertGlideStringArray(result);
    return converted ? converted.filter((val): val is string => val !== null) : [];
  }

  async sdiff(...keys: RedisKey[]): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKeys = keys.map(key => ParameterTranslator.normalizeKey(key));
    const result = await client.sdiff(normalizedKeys);
    if (result instanceof Set) {
      return Array.from(result).map(item => ParameterTranslator.convertGlideString(item) || '');
    }
    const converted = ParameterTranslator.convertGlideStringArray(result);
    return converted ? converted.filter((val): val is string => val !== null) : [];
  }

  async sunionstore(destination: RedisKey, ...keys: RedisKey[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedDestination = ParameterTranslator.normalizeKey(destination);
    const normalizedKeys = keys.map(key => ParameterTranslator.normalizeKey(key));
    return await client.sunionstore(normalizedDestination, normalizedKeys);
  }

  async sinterstore(destination: RedisKey, ...keys: RedisKey[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedDestination = ParameterTranslator.normalizeKey(destination);
    const normalizedKeys = keys.map(key => ParameterTranslator.normalizeKey(key));
    return await client.sinterstore(normalizedDestination, normalizedKeys);
  }

  async sdiffstore(destination: RedisKey, ...keys: RedisKey[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedDestination = ParameterTranslator.normalizeKey(destination);
    const normalizedKeys = keys.map(key => ParameterTranslator.normalizeKey(key));
    return await client.sdiffstore(normalizedDestination, normalizedKeys);
  }

  // Sorted Set commands
  async zadd(key: RedisKey, ...scoreMembers: (number | string)[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    // Parse score-member pairs: [score, member, score, member, ...]
    const members = [];
    for (let i = 0; i < scoreMembers.length; i += 2) {
      if (i + 1 < scoreMembers.length && scoreMembers[i + 1] !== undefined) {
        const member = scoreMembers[i + 1];
        members.push({
          element: ParameterTranslator.normalizeValue(member!),
          score: Number(scoreMembers[i])
        });
      }
    }
    
    return await client.zadd(normalizedKey, members);
  }

  async zrem(key: RedisKey, ...members: RedisValue[]): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedMembers = members.map(member => ParameterTranslator.normalizeValue(member));
    return await client.zrem(normalizedKey, normalizedMembers);
  }

  async zrange(key: RedisKey, start: number, stop: number, ...args: (string | any)[]): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    // Check if WITHSCORES is requested (ioredis style)
    const withScores = args.includes('WITHSCORES') || (args.length > 0 && args[0]?.withScores === true);
    
    if (withScores) {
      const result = await client.zrangeWithScores(normalizedKey, { start, end: stop });
      if (!Array.isArray(result)) return [];
      
      // GLIDE returns SortedSetDataType: {element: string, score: number}[]
      // ioredis WITHSCORES format: ['element1', 'score1', 'element2', 'score2', ...]
      const converted: string[] = [];
      result.forEach((item: any) => {
        const element = ParameterTranslator.convertGlideString(item.element || item.member) || '';
        const score = (item.score || 0).toString();
        converted.push(element, score);
      });
      return converted;
    } else {
      const result = await client.zrange(normalizedKey, { start, end: stop });
      const converted = ParameterTranslator.convertGlideStringArray(result);
      return converted ? converted.filter((val): val is string => val !== null) : [];
    }
  }

  async zrevrange(key: RedisKey, start: number, stop: number, _options?: any): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    // Use zrange with reverse option since zrevrange doesn't exist in Valkey GLIDE
    const result = await client.zrange(normalizedKey, { start, end: stop }, { reverse: true });
    const converted = ParameterTranslator.convertGlideStringArray(result);
    return converted ? converted.filter((val): val is string => val !== null) : [];
  }

  async zscore(key: RedisKey, member: RedisValue): Promise<string | null> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedMember = ParameterTranslator.normalizeValue(member);
    const result = await client.zscore(normalizedKey, normalizedMember);
    if (result === null) return null;
    
    const scoreStr = result.toString();
    // Normalize infinity values to match ioredis format
    if (scoreStr === '-Infinity') return '-inf';
    if (scoreStr === 'Infinity') return 'inf';
    return scoreStr;
  }

  async zcard(key: RedisKey): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.zcard(normalizedKey);
  }

  async zrank(key: RedisKey, member: RedisValue): Promise<number | null> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedMember = ParameterTranslator.normalizeValue(member);
    const result = await client.zrank(normalizedKey, normalizedMember);
    return result !== null ? result : null;
  }

  async zrevrank(key: RedisKey, member: RedisValue): Promise<number | null> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedMember = ParameterTranslator.normalizeValue(member);
    const result = await client.zrevrank(normalizedKey, normalizedMember);
    return result !== null ? result : null;
  }

  async zincrby(key: RedisKey, increment: number, member: RedisValue): Promise<string> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedMember = ParameterTranslator.normalizeValue(member);
    const result = await client.zincrby(normalizedKey, increment, normalizedMember);
    return result.toString();
  }

  async zcount(_key: RedisKey, _min: number | string, _max: number | string): Promise<number> {
    // TODO: Fix boundary type compatibility with Valkey GLIDE
    // const client = await this.ensureConnected();
    // const normalizedKey = ParameterTranslator.normalizeKey(key);
    // return await client.zcount(normalizedKey, minBound, maxBound);
    throw new Error('zcount temporarily unavailable - boundary type compatibility issue');
  }

  async zremrangebyrank(key: RedisKey, start: number, stop: number): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.zremRangeByRank(normalizedKey, start, stop);
  }

  async zremrangebyscore(key: RedisKey, min: number | string, max: number | string): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    try {
      // Use customCommand for full Redis compatibility
      const result = await client.customCommand(['ZREMRANGEBYSCORE', normalizedKey, min.toString(), max.toString()]);
      return Number(result) || 0;
    } catch (error) {
      console.warn('zremrangebyscore error:', error);
      return 0;
    }
  }

  // Enhanced ZSET operations for Bull/Bee-Queue compatibility
  async zrangebyscore(
    key: RedisKey,
    min: string | number,
    max: string | number,
    ...args: string[]
  ): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    try {
      // Build command arguments for full Redis compatibility
      const commandArgs = [normalizedKey, min.toString(), max.toString()];
      
      // Handle additional arguments (WITHSCORES, LIMIT, etc.)
      for (let i = 0; i < args.length; i++) {
        const currentArg = args[i];
        if (!currentArg) continue;
        const arg = currentArg.toString().toUpperCase();
        
        if (arg === 'WITHSCORES') {
          commandArgs.push(arg);
        } else if (arg === 'LIMIT' && i + 2 < args.length) {
          const nextArg = args[i + 1];
          const thirdArg = args[i + 2];
          if (nextArg !== undefined && thirdArg !== undefined) {
            // LIMIT offset count
            commandArgs.push(arg, nextArg.toString(), thirdArg.toString());
            i += 2; // Skip the next two arguments
          }
        } else {
          commandArgs.push(currentArg.toString());
        }
      }
      
      // Parse min/max boundaries for native GLIDE zrange
      const parseScoreValue = (score: string | number): number => {
        if (typeof score === 'number') return score;
        const scoreStr = score.toString();
        if (scoreStr === '+inf') return Infinity;
        if (scoreStr === '-inf') return -Infinity;
        if (scoreStr.startsWith('(+inf')) return Infinity;
        if (scoreStr.startsWith('(-inf')) return -Infinity;
        if (scoreStr.startsWith('(')) return parseFloat(scoreStr.slice(1));
        return parseFloat(scoreStr);
      };
      
      const minBoundary: Boundary<number> = typeof min === 'string' && min.startsWith('(') 
        ? { value: parseScoreValue(min.slice(1)), isInclusive: false }
        : { value: parseScoreValue(min), isInclusive: true };
      
      const maxBoundary: Boundary<number> = typeof max === 'string' && max.startsWith('(')
        ? { value: parseScoreValue(max.slice(1)), isInclusive: false }
        : { value: parseScoreValue(max), isInclusive: true };
      
      const rangeQuery: RangeByScore = {
        type: "byScore",
        start: minBoundary,
        end: maxBoundary
      };
      
      // Handle LIMIT arguments
      for (let i = 0; i < args.length; i++) {
        const currentArg = args[i];
        if (currentArg && currentArg.toString().toUpperCase() === 'LIMIT' && i + 2 < args.length) {
          const offsetArg = args[i + 1];
          const countArg = args[i + 2];
          if (offsetArg !== undefined && countArg !== undefined) {
            rangeQuery.limit = {
              offset: parseInt(offsetArg.toString()),
              count: parseInt(countArg.toString())
            };
            break;
          }
        }
      }
      
      // Check if WITHSCORES is requested
      const withScores = args.some(arg => arg.toUpperCase() === 'WITHSCORES');
      
      // Use native GLIDE zrange method
      if (withScores) {
        const result = await client.zrangeWithScores(normalizedKey, rangeQuery);
        if (!Array.isArray(result)) {
          return [];
        }
        
        // GLIDE returns SortedSetDataType: {element: string, score: number}[]
        // ioredis expects flat array: [member1, score1, member2, score2]
        const flatArray: string[] = [];
        for (const item of result) {
          flatArray.push(
            ParameterTranslator.convertGlideString(item.element) || '',
            item.score.toString()
          );
        }
        return flatArray;
      } else {
        const result = await client.zrange(normalizedKey, rangeQuery);
        if (!Array.isArray(result)) {
          return [];
        }
        
        // Convert all results to strings for ioredis compatibility
        return result.map(item => ParameterTranslator.convertGlideString(item) || '');
      }
    } catch (error) {
      console.warn('zrangebyscore error:', error);
      return [];
    }
  }

  async zrevrangebyscore(
    key: RedisKey,
    max: string | number,
    min: string | number,
    ...args: string[]
  ): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    try {
      // Parse max/min boundaries for native GLIDE zrange
      // For zrevrangebyscore: parameters are (key, max, min) but range query needs (start=min, end=max)
      const minBoundary: Boundary<number> = typeof min === 'string' && min.startsWith('(') 
        ? { value: parseFloat(min.slice(1)), isInclusive: false }
        : { value: typeof min === 'number' ? min : parseFloat(min.toString()), isInclusive: true };
      
      const maxBoundary: Boundary<number> = typeof max === 'string' && max.startsWith('(')
        ? { value: parseFloat(max.slice(1)), isInclusive: false }
        : { value: typeof max === 'number' ? max : parseFloat(max.toString()), isInclusive: true };
      
      // For zrevrangebyscore with GLIDE's reverse flag, we need to swap start/end
      const rangeQuery: RangeByScore = {
        type: "byScore",
        start: maxBoundary,  // For reverse: start should be the higher bound (max)
        end: minBoundary     // For reverse: end should be the lower bound (min)
      };
      
      // Handle LIMIT arguments
      for (let i = 0; i < args.length; i++) {
        const currentArg = args[i];
        if (currentArg && currentArg.toString().toUpperCase() === 'LIMIT' && i + 2 < args.length) {
          const offsetArg = args[i + 1];
          const countArg = args[i + 2];
          if (offsetArg !== undefined && countArg !== undefined) {
            rangeQuery.limit = {
              offset: parseInt(offsetArg.toString()),
              count: parseInt(countArg.toString())
            };
            break;
          }
        }
      }
      
      // Check if WITHSCORES is requested
      const withScores = args.some(arg => arg.toUpperCase() === 'WITHSCORES');
      
      // Use native GLIDE zrange method with reverse option
      if (withScores) {
        const result = await client.zrangeWithScores(normalizedKey, rangeQuery, { reverse: true });
        if (!Array.isArray(result)) {
          return [];
        }
        
        // GLIDE returns SortedSetDataType: {element: string, score: number}[]
        // ioredis expects flat array: [member1, score1, member2, score2]
        const flatArray: string[] = [];
        for (const item of result) {
          flatArray.push(
            ParameterTranslator.convertGlideString(item.element) || '',
            item.score.toString()
          );
        }
        return flatArray;
      } else {
        const result = await client.zrange(normalizedKey, rangeQuery, { reverse: true });
        if (!Array.isArray(result)) {
          return [];
        }
        
        return result.map(item => ParameterTranslator.convertGlideString(item) || '');
      }
    } catch (error) {
      console.warn('zrevrangebyscore error:', error);
      return [];
    }
  }

  // Add missing zpopmin/zpopmax for Bull compatibility
  async zpopmin(key: RedisKey, count?: number): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    const options = count !== undefined ? { count } : undefined;
    const result = await client.zpopmin(normalizedKey, options);
    
    if (!Array.isArray(result)) {
      return [];
    }
    
    // GLIDE returns SortedSetDataType: {element: string, score: number}[]
    // ioredis expects flat array: [member1, score1, member2, score2]
    const flatArray: string[] = [];
    for (const item of result) {
      flatArray.push(
        ParameterTranslator.convertGlideString(item.element) || '',
        item.score.toString()
      );
    }
    
    return flatArray;
  }

  async zpopmax(key: RedisKey, count?: number): Promise<string[]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    const options = count !== undefined ? { count } : undefined;
    const result = await client.zpopmax(normalizedKey, options);
    
    if (!Array.isArray(result)) {
      return [];
    }
    
    // GLIDE returns SortedSetDataType: {element: string, score: number}[]
    // ioredis expects flat array: [member1, score1, member2, score2]
    const flatArray: string[] = [];
    for (const item of result) {
      flatArray.push(
        ParameterTranslator.convertGlideString(item.element) || '',
        item.score.toString()
      );
    }
    
    return flatArray;
  }

  // Key commands
  async del(...keys: RedisKey[]): Promise<number> {
    const client = await this.ensureConnected();
    const keyStrings = ParameterTranslator.translateDelArgs(keys);
    return await client.del(keyStrings);
  }

  async exists(...keys: RedisKey[]): Promise<number> {
    const client = await this.ensureConnected();
    const keyStrings = ParameterTranslator.translateExistsArgs(keys);
    return await client.exists(keyStrings);
  }

  async expire(key: RedisKey, seconds: number): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.expire(normalizedKey, seconds);
    return result ? 1 : 0;
  }

  async ttl(key: RedisKey): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.ttl(normalizedKey);
    // Handle special cases: -1 (no expire), -2 (key doesn't exist)
    if (result === -1 || result === -2) {
      return result;
    }
    return result;
  }

  async persist(key: RedisKey): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.persist(normalizedKey);
    return result ? 1 : 0;
  }

  async type(key: RedisKey): Promise<string> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.type(normalizedKey);
    return ParameterTranslator.convertGlideString(result) || 'none';
  }

  async keys(pattern: string = '*'): Promise<string[]> {
    const client = await this.ensureConnected();
    const result = await client.customCommand(['KEYS', pattern]);
    if (Array.isArray(result)) {
      return result.map(item => ParameterTranslator.convertGlideString(item) || '');
    }
    return [];
  }

  // Scan operations for safe iteration
  async scan(cursor: string, ...args: string[]): Promise<[string, string[]]> {
    const client = await this.ensureConnected();
    const scanArgs = [cursor, ...args];
    const result = await client.customCommand(['SCAN', ...scanArgs]);
    
    if (Array.isArray(result) && result.length === 2) {
      const [nextCursor, keys] = result;
      const cursorStr = ParameterTranslator.convertGlideString(nextCursor) || '0';
      const keyArray = Array.isArray(keys) ? 
        keys.map(k => ParameterTranslator.convertGlideString(k) || '') : [];
      return [cursorStr, keyArray];
    }
    
    return ['0', []];
  }

  async hscan(key: RedisKey, cursor: string, ...args: string[]): Promise<[string, string[]]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const scanArgs = [normalizedKey, cursor, ...args];
    const result = await client.customCommand(['HSCAN', ...scanArgs]);
    
    if (Array.isArray(result) && result.length === 2) {
      const [nextCursor, fields] = result;
      const cursorStr = ParameterTranslator.convertGlideString(nextCursor) || '0';
      const fieldArray = Array.isArray(fields) ? 
        fields.map(f => ParameterTranslator.convertGlideString(f) || '') : [];
      return [cursorStr, fieldArray];
    }
    
    return ['0', []];
  }

  async sscan(key: RedisKey, cursor: string, ...args: string[]): Promise<[string, string[]]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const scanArgs = [normalizedKey, cursor, ...args];
    const result = await client.customCommand(['SSCAN', ...scanArgs]);
    
    if (Array.isArray(result) && result.length === 2) {
      const [nextCursor, members] = result;
      const cursorStr = ParameterTranslator.convertGlideString(nextCursor) || '0';
      const memberArray = Array.isArray(members) ? 
        members.map(m => ParameterTranslator.convertGlideString(m) || '') : [];
      return [cursorStr, memberArray];
    }
    
    return ['0', []];
  }

  async zscan(key: RedisKey, cursor: string, ...args: string[]): Promise<[string, string[]]> {
    const client = await this.ensureConnected();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const scanArgs = [normalizedKey, cursor, ...args];
    const result = await client.customCommand(['ZSCAN', ...scanArgs]);
    
    if (Array.isArray(result) && result.length === 2) {
      const [nextCursor, membersAndScores] = result;
      const cursorStr = ParameterTranslator.convertGlideString(nextCursor) || '0';
      const dataArray = Array.isArray(membersAndScores) ? 
        membersAndScores.map(item => ParameterTranslator.convertGlideString(item) || '') : [];
      return [cursorStr, dataArray];
    }
    
    return ['0', []];
  }

  // Blocking operations for Bull compatibility
  async brpoplpush(source: RedisKey, destination: RedisKey, timeout: number): Promise<string | null> {
    const client = await this.ensureConnected();
    const normalizedSource = ParameterTranslator.normalizeKey(source);
    const normalizedDest = ParameterTranslator.normalizeKey(destination);
    
    try {
      this.blocked = true; // Set blocked flag like ioredis
      
      const result = await client.customCommand([
        'BRPOPLPUSH',
        normalizedSource,
        normalizedDest,
        timeout.toString()
      ]);
      
      this.blocked = false; // Clear blocked flag
      return result ? ParameterTranslator.convertGlideString(result) : null;
    } catch (error: any) {
      // Handle timeout as expected behavior
      if (timeout > 0 && (error?.message?.includes('timeout') || error?.message?.includes('TIMEOUT'))) {
        return null;
      }
      throw error;
    }
  }



  // Generic command execution
  async call(command: string, ...args: (string | number | Buffer)[]): Promise<any> {
    const client = await this.ensureConnected();
    const stringArgs = args.map(arg => arg.toString());
    return await client.customCommand([command, ...stringArgs]);
  }

  // Pipeline and transactions
  pipeline(): Pipeline {
    return new PipelineAdapter(this);
  }

  multi(): Multi {
    return new MultiAdapter(this, new Set(this.watchedKeys));
  }

  private async ensureLibIntegration(): Promise<void> {
    if (this._libIntegration) return;
    const { LibraryGlideIntegration } = await import('../pubsub/DirectGlidePubSub');
    this._libIntegration = new LibraryGlideIntegration((msg: any) => {
      if (msg.pattern) {
        this.emit('pmessage', msg.pattern, msg.channel, msg.message);
        this._pubsubEmitter.emit('pmessage', msg.pattern, msg.channel, msg.message);
      } else {
        this.emit('message', msg.channel, msg.message);
        this._pubsubEmitter.emit('message', msg.channel, msg.message);
      }
    });
    await this._libIntegration.initialize(this._options, { channels: Array.from(this.subscribedChannels), patterns: Array.from(this.subscribedPatterns) });
  }

  // Pub/Sub
  async publish(channel: string, message: RedisValue): Promise<number> {
    const client = await this.ensureConnected();
    const normalizedChannel = ParameterTranslator.normalizeKey(channel);
    const normalizedMessage = ParameterTranslator.normalizeValue(message);
    return await client.publish(normalizedChannel, normalizedMessage);
  }

  async subscribe(...channels: string[]): Promise<number> {
    await this.ensureLibIntegration();
    channels.forEach(c => this.subscribedChannels.add(String(c)));
    await this._libIntegration!.updateSubscriptions(this._options, { addChannels: channels });
    channels.forEach((c, i) => this.emit('subscribe', c, this.subscribedChannels.size - i));
    return this.subscribedChannels.size;
  }

  async unsubscribe(...channels: string[]): Promise<number> {
    if (!this._libIntegration) return this.subscribedChannels.size;
    const toRemove = channels.length ? channels : Array.from(this.subscribedChannels);
    toRemove.forEach(c => this.subscribedChannels.delete(String(c)));
    await this._libIntegration.updateSubscriptions(this._options, { removeChannels: toRemove });
    toRemove.forEach((c, i) => this.emit('unsubscribe', c, this.subscribedChannels.size - i));
    return this.subscribedChannels.size;
  }

  async psubscribe(...patterns: string[]): Promise<number> {
    await this.ensureLibIntegration();
    patterns.forEach(p => this.subscribedPatterns.add(String(p)));
    await this._libIntegration!.updateSubscriptions(this._options, { addPatterns: patterns });
    patterns.forEach((p, i) => this.emit('psubscribe', p, this.subscribedPatterns.size - i));
    return this.subscribedPatterns.size;
  }

  async punsubscribe(...patterns: string[]): Promise<number> {
    if (!this._libIntegration) return this.subscribedPatterns.size;
    const toRemove = patterns.length ? patterns : Array.from(this.subscribedPatterns);
    toRemove.forEach(p => this.subscribedPatterns.delete(String(p)));
    await this._libIntegration.updateSubscriptions(this._options, { removePatterns: toRemove });
    toRemove.forEach((p, i) => this.emit('punsubscribe', p, this.subscribedPatterns.size - i));
    return this.subscribedPatterns.size;
  }

  async watch(...keys: RedisKey[]): Promise<string> {
    // Track keys locally for transaction context
    keys.forEach(key => this.watchedKeys.add(ParameterTranslator.normalizeKey(key)));
    
    // Execute WATCH command through valkey-glide
    const client = await this.ensureConnected();
    const normalizedKeys = keys.map(key => ParameterTranslator.normalizeKey(key));
    await client.customCommand(['WATCH', ...normalizedKeys]);
    
    return 'OK';
  }
  
  async unwatch(): Promise<string> {
    // Clear local tracking
    this.watchedKeys.clear();
    
    // Execute UNWATCH command through valkey-glide
    const client = await this.ensureConnected();
    await client.customCommand(['UNWATCH']);
    
    return 'OK';
  }

  // Script methods implementation using Valkey Glide's Script object
  async scriptLoad(script: string): Promise<string> {
    const client = await this.ensureConnected();
    
    try {
      // Load script in Redis cache and get the actual hash from Redis
      const hash = await client.customCommand(['SCRIPT', 'LOAD', script]);
      
      // Return the hash as returned by Redis
      return hash as string;
    } catch (error) {
      // If SCRIPT LOAD fails, create a Script object for fallback hash
      const scriptObj = new Script(script);
      console.warn('Script load failed, but hash is still available:', error);
      return scriptObj.getHash();
    }
  }

  async scriptExists(...scripts: string[]): Promise<boolean[]> {
    const client = await this.ensureConnected();
    const result = await client.customCommand(['SCRIPT', 'EXISTS', ...scripts]);
    // The result should be an array of 0s/1s or false/true values
    if (Array.isArray(result)) {
      return result.map((val: any) => {
        // Handle both boolean and numeric return values
        if (typeof val === 'boolean') {
          return val;
        }
        return val === 1;
      });
    }
    // Fallback in case of unexpected result format
    return scripts.map(() => false);
  }

  async scriptFlush(): Promise<string> {
    const client = await this.ensureConnected();
    await client.customCommand(['SCRIPT', 'FLUSH']);
    return 'OK';
  }

  async eval(script: string, numkeys: number, ...keysAndArgs: any[]): Promise<any> {
    const client = await this.ensureConnected();
    
    // Convert keys and arguments to appropriate format
    const keys = keysAndArgs.slice(0, numkeys).map(String);
    const rawArgs = keysAndArgs.slice(numkeys);
    
    // Enhanced argument processing for BullMQ compatibility
    const args = rawArgs.map(arg => {
      if (Buffer.isBuffer(arg)) {
        return arg; // Keep Buffer objects as-is
      }
      if (arg === null || arg === undefined) {
        return '';
      }
      if (typeof arg === 'object') {
        try {
          // BullMQ often passes serialized objects
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    });
    
    try {
      // Try using Valkey Glide's Script object first (preferred method)
      const scriptObj = new Script(script);
      return await client.invokeScript(scriptObj, { keys, args });
    } catch (error) {
      // Fallback to direct EVAL command for BullMQ compatibility
      console.warn('Script object failed, falling back to direct EVAL:', error);
      const commandArgs = [script, numkeys.toString(), ...keys, ...args.map(String)];
      return await client.customCommand(['EVAL', ...commandArgs]);
    }
  }

  async evalsha(sha1: string, numkeys: number, ...keysAndArgs: any[]): Promise<any> {
    const client = await this.ensureConnected();
    
    const keys = keysAndArgs.slice(0, numkeys).map(String);
    const rawArgs = keysAndArgs.slice(numkeys);
    
    // Process arguments similar to eval for consistency
    const args = rawArgs.map(arg => {
      if (Buffer.isBuffer(arg)) {
        return arg;
      }
      if (arg === null || arg === undefined) {
        return '';
      }
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    });
    
    try {
      // Try direct EVALSHA first
      const commandArgs = [sha1, numkeys.toString(), ...keys, ...args.map(String)];
      return await client.customCommand(['EVALSHA', ...commandArgs]);
    } catch (error) {
      // If NOSCRIPT error, we can't auto-retry without the original script
      // This is expected ioredis behavior - the caller should handle NOSCRIPT
      if (error && error.toString().includes('NOSCRIPT')) {
        // Re-throw NOSCRIPT errors for the caller to handle
        throw error;
      }
      // For other errors, also re-throw
      throw error;
    }
  }

  // Define custom commands using Lua scripts (ioredis compatibility)
  defineCommand(name: string, options: { lua: string; numberOfKeys?: number }): void {
    const { lua, numberOfKeys = 0 } = options;
    
    // Define the method on this instance
    (this as any)[name] = async (...args: any[]): Promise<any> => {
      const client = await this.ensureConnected();
      
      const numkeys = Number(numberOfKeys) || 0;
      
      // Handle both argument patterns for maximum compatibility
      let keys: any[];
      let argv: any[];
      
      if (args.length === 1 && Array.isArray(args[0])) {
        // BullMQ/array style: single array argument
        const allArgs = args[0];
        keys = allArgs.slice(0, numkeys);
        argv = allArgs.slice(numkeys);
      } else {
        // ioredis/variadic style: separate arguments
        keys = args.slice(0, numkeys);
        argv = args.slice(numkeys);
      }

      // Normalize arguments for Valkey GLIDE
      const normalizedKeys = keys.map(k => ParameterTranslator.normalizeKey(k));
      const normalizedArgs = argv.map(arg => {
        if (Buffer.isBuffer(arg)) return arg;
        if (arg === null || arg === undefined) return '';
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
            } catch {
            return String(arg);
          }
        }
        return String(arg);
      });

      try {
        // Try using Valkey GLIDE's Script object first (preferred method)
        const scriptObj = new Script(lua);
        const result = await client.invokeScript(scriptObj, {
          keys: normalizedKeys,
          args: normalizedArgs
        });
        
        // Ensure arrays are returned instead of null for empty results
        if (result === null && (lua.includes('return {}') || lua.includes('return nil'))) {
          return [];
        }
        
        return result;
      } catch (error) {
        // Fallback to direct EVAL if Script fails
        const commandArgs = [lua, numkeys.toString(), ...normalizedKeys, ...normalizedArgs];
        const fallbackResult = await client.customCommand(['EVAL', ...commandArgs]);
        
        // Apply same null-to-array conversion
        if (fallbackResult === null && (lua.includes('return {}') || lua.includes('return nil'))) {
          return [];
        }
        
        return fallbackResult;
      }
    };
  }

  // ============================================
  // JSON Commands (ValkeyJSON / RedisJSON v2 Compatible)
  // ============================================

  /**
   * Set a JSON document
   * JSON.SET key path value [NX|XX]
   */
  async jsonSet(key: RedisKey, path: string, value: any, options?: 'NX' | 'XX'): Promise<string | null> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonSet(client, key, path, value, options);
  }

  /**
   * Get a JSON document or path
   * JSON.GET key [path ...] [INDENT indent] [NEWLINE newline] [SPACE space]
   */
  async jsonGet(
    key: RedisKey, 
    path?: string | string[], 
    options?: { indent?: string; newline?: string; space?: string; }
  ): Promise<string | null> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonGet(client, key, path, options);
  }

  /**
   * Delete a JSON path
   * JSON.DEL key [path]
   */
  async jsonDel(key: RedisKey, path?: string): Promise<number> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonDel(client, key, path);
  }

  /**
   * Clear a JSON path (set to null/empty)
   * JSON.CLEAR key [path]
   */
  async jsonClear(key: RedisKey, path?: string): Promise<number> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonClear(client, key, path);
  }

  /**
   * Get the type of a JSON path
   * JSON.TYPE key [path]
   */
  async jsonType(key: RedisKey, path?: string): Promise<string | null> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonType(client, key, path);
  }

  /**
   * Increment a numeric JSON value
   * JSON.NUMINCRBY key path value
   */
  async jsonNumIncrBy(key: RedisKey, path: string, value: number): Promise<string | null> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonNumIncrBy(client, key, path, value);
  }

  /**
   * Multiply a numeric JSON value
   * JSON.NUMMULTBY key path value
   */
  async jsonNumMultBy(key: RedisKey, path: string, value: number): Promise<string | null> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonNumMultBy(client, key, path, value);
  }

  /**
   * Append to a JSON string
   * JSON.STRAPPEND key path value
   */
  async jsonStrAppend(key: RedisKey, path: string, value: string): Promise<number> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonStrAppend(client, key, path, value);
  }

  /**
   * Get the length of a JSON string
   * JSON.STRLEN key [path]
   */
  async jsonStrLen(key: RedisKey, path?: string): Promise<number | null> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonStrLen(client, key, path);
  }

  /**
   * Append values to a JSON array
   * JSON.ARRAPPEND key path value [value ...]
   */
  async jsonArrAppend(key: RedisKey, path: string, ...values: any[]): Promise<number> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonArrAppend(client, key, path, ...values);
  }

  /**
   * Insert values into a JSON array
   * JSON.ARRINSERT key path index value [value ...]
   */
  async jsonArrInsert(key: RedisKey, path: string, index: number, ...values: any[]): Promise<number> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonArrInsert(client, key, path, index, ...values);
  }

  /**
   * Get the length of a JSON array
   * JSON.ARRLEN key [path]
   */
  async jsonArrLen(key: RedisKey, path?: string): Promise<number | null> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonArrLen(client, key, path);
  }

  /**
   * Remove and return element from JSON array
   * JSON.ARRPOP key [path [index]]
   */
  async jsonArrPop(key: RedisKey, path?: string, index?: number): Promise<string | null> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonArrPop(client, key, path, index);
  }

  /**
   * Trim a JSON array
   * JSON.ARRTRIM key path start stop
   */
  async jsonArrTrim(key: RedisKey, path: string, start: number, stop: number): Promise<number> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonArrTrim(client, key, path, start, stop);
  }

  /**
   * Get keys of a JSON object
   * JSON.OBJKEYS key [path]
   */
  async jsonObjKeys(key: RedisKey, path?: string): Promise<string[] | null> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonObjKeys(client, key, path);
  }

  /**
   * Get the number of keys in a JSON object
   * JSON.OBJLEN key [path]
   */
  async jsonObjLen(key: RedisKey, path?: string): Promise<number | null> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonObjLen(client, key, path);
  }

  /**
   * Toggle a boolean JSON value
   * JSON.TOGGLE key path
   */
  async jsonToggle(key: RedisKey, path: string): Promise<number> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonToggle(client, key, path);
  }

  /**
   * Get debug information about a JSON document
   * JSON.DEBUG subcommand key [path]
   */
  async jsonDebug(subcommand: 'MEMORY' | 'DEPTH' | 'FIELDS', key: RedisKey, path?: string): Promise<any> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonDebug(client, subcommand, key, path);
  }

  /**
   * Alias for JSON.DEL (RedisJSON v1 compatibility)
   * JSON.FORGET key [path]
   */
  async jsonForget(key: RedisKey, path?: string): Promise<number> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonForget(client, key, path);
  }

  /**
   * Convert JSON to RESP format
   * JSON.RESP key [path]
   */
  async jsonResp(key: RedisKey, path?: string): Promise<any> {
    const client = await this.ensureConnected();
    return JsonCommands.jsonResp(client, key, path);
  }

  // ============================================
  // Search Commands (Valkey Search / RediSearch Compatible)
  // ============================================

  /**
   * Create a search index
   * FT.CREATE index [options] SCHEMA field_name field_type [options] ...
   */
  async ftCreate(index: SearchIndex): Promise<string> {
    const client = await this.ensureConnected();
    return SearchCommands.ftCreate(client, index);
  }

  /**
   * Search the index
   * FT.SEARCH index query [options]
   */
  async ftSearch(indexName: string, searchQuery: SearchQuery): Promise<SearchResult> {
    const client = await this.ensureConnected();
    return SearchCommands.ftSearch(client, indexName, searchQuery);
  }

  /**
   * Get information about an index
   * FT.INFO index
   */
  async ftInfo(indexName: string): Promise<Record<string, any>> {
    const client = await this.ensureConnected();
    return SearchCommands.ftInfo(client, indexName);
  }

  /**
   * Drop an index
   * FT.DROP index [DD]
   */
  async ftDrop(indexName: string, deleteDocuments: boolean = false): Promise<string> {
    const client = await this.ensureConnected();
    return SearchCommands.ftDrop(client, indexName, deleteDocuments);
  }

  /**
   * Add a document to the index
   * FT.ADD index docId score [options] FIELDS field content [field content ...]
   */
  async ftAdd(
    indexName: string,
    docId: string,
    score: number,
    fields: Record<string, any>,
    options?: {
      NOSAVE?: boolean;
      REPLACE?: boolean;
      PARTIAL?: boolean;
      LANGUAGE?: string;
      PAYLOAD?: string;
    }
  ): Promise<string> {
    const client = await this.ensureConnected();
    return SearchCommands.ftAdd(client, indexName, docId, score, fields, options);
  }

  /**
   * Delete a document from the index
   * FT.DEL index docId [DD]
   */
  async ftDel(indexName: string, docId: string, deleteDocument: boolean = false): Promise<number> {
    const client = await this.ensureConnected();
    return SearchCommands.ftDel(client, indexName, docId, deleteDocument);
  }

  /**
   * Get a document from the index
   * FT.GET index docId
   */
  async ftGet(indexName: string, docId: string): Promise<Record<string, any> | null> {
    const client = await this.ensureConnected();
    return SearchCommands.ftGet(client, indexName, docId);
  }

  /**
   * Get multiple documents from the index
   * FT.MGET index docId [docId ...]
   */
  async ftMGet(indexName: string, ...docIds: string[]): Promise<Array<Record<string, any> | null>> {
    const client = await this.ensureConnected();
    return SearchCommands.ftMGet(client, indexName, ...docIds);
  }

  /**
   * Perform aggregation query
   * FT.AGGREGATE index query [options]
   */
  async ftAggregate(
    indexName: string,
    query: string,
    options?: {
      VERBATIM?: boolean;
      LOAD?: string[];
      GROUPBY?: {
        fields: string[];
        REDUCE?: Array<{
          function: string;
          args: string[];
          AS?: string;
        }>;
      };
      SORTBY?: Array<{
        property: string;
        direction?: 'ASC' | 'DESC';
      }>;
      APPLY?: Array<{
        expression: string;
        AS: string;
      }>;
      LIMIT?: {
        offset: number;
        num: number;
      };
      FILTER?: string;
    }
  ): Promise<any[]> {
    const client = await this.ensureConnected();
    return SearchCommands.ftAggregate(client, indexName, query, options);
  }

  /**
   * Explain a query execution plan
   * FT.EXPLAIN index query [DIALECT dialect]
   */
  async ftExplain(indexName: string, query: string, dialect?: number): Promise<string> {
    const client = await this.ensureConnected();
    return SearchCommands.ftExplain(client, indexName, query, dialect);
  }

  /**
   * Get list of all indexes
   * FT._LIST
   */
  async ftList(): Promise<string[]> {
    const client = await this.ensureConnected();
    return SearchCommands.ftList(client);
  }

  /**
   * Vector similarity search
   * Performs KNN search on vector fields
   */
  async ftVectorSearch(
    indexName: string,
    vectorField: string,
    queryVector: number[] | Buffer,
    options?: {
      KNN?: number;
      EF_RUNTIME?: number;
      HYBRID_POLICY?: 'ADHOC_BF' | 'BATCHES';
      LIMIT?: { offset: number; count: number };
      FILTER?: string;
    }
  ): Promise<SearchResult> {
    const client = await this.ensureConnected();
    return SearchCommands.ftVectorSearch(client, indexName, vectorField, queryVector, options);
  }
      
  // Bull serialization helper methods  
  private bullSerializationHelpers = {
        /**
         * Check if object is Bull job data
         */
        isBullJobData: (obj: any): boolean => {
          if (!obj || typeof obj !== 'object') return false;
          // Bull job data typically has specific properties
          return obj.hasOwnProperty('data') || obj.hasOwnProperty('opts') || 
                 (typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length > 0);
        },
        
        /**
         * Serialize Bull job data
         */
        serializeBullJobData: (data: any): string => {
          try {
            // For BullMQ compatibility, use MessagePack for complex data
            if (data && typeof data === 'object') {
              const packed = msgpack(data);
              return Buffer.from(packed).toString('base64');
            }
            const result = JSON.stringify(data);
            return result && result !== 'null' && result !== 'undefined' ? result : '{}';
          } catch {
            const fallback = String(data);
            return fallback && fallback !== 'null' && fallback !== 'undefined' ? fallback : '{}';
          }
        },
        
        /**
         * Check if object is Bull job options
         */
        isBullJobOptions: (obj: any): boolean => {
          if (!obj || typeof obj !== 'object') return false;
          const optionKeys = ['delay', 'priority', 'attempts', 'backoff', 'lifo', 'timeout', 'removeOnComplete', 'removeOnFail'];
          return optionKeys.some(key => obj.hasOwnProperty(key));
        },
        
        /**
         * Serialize Bull job options
         */
        serializeBullJobOptions: (opts: any): string => {
          try {
            // For BullMQ compatibility, use MessagePack for complex data
            if (opts && typeof opts === 'object') {
              const packed = msgpack(opts);
              return Buffer.from(packed).toString('base64');
            }
            const result = JSON.stringify(opts);
            return result && result !== 'null' && result !== 'undefined' ? result : '{}';
          } catch {
            const fallback = String(opts);
            return fallback && fallback !== 'null' && fallback !== 'undefined' ? fallback : '{}';
          }
        },
        
        /**
         * Check if object is Bull queue settings
         */
        isBullQueueSettings: (obj: any): boolean => {
          if (!obj || typeof obj !== 'object') return false;
          const settingKeys = ['stalledInterval', 'maxStalledCount', 'retryProcessDelay'];
          return settingKeys.some(key => obj.hasOwnProperty(key));
        },
        
        /**
         * Serialize Bull queue settings
         */
        serializeBullQueueSettings: (settings: any): string => {
          try {
            const result = JSON.stringify(settings);
            return result && result !== 'null' && result !== 'undefined' ? result : '{}';
          } catch {
            const fallback = String(settings);
            return fallback && fallback !== 'null' && fallback !== 'undefined' ? fallback : '{}';
          }
        },
        
        /**
         * Check if object has nested structure
         */
        isNestedObject: (obj: any): boolean => {
          if (!obj || typeof obj !== 'object') return false;
          return Object.values(obj).some(value => 
            typeof value === 'object' && value !== null && !Array.isArray(value)
          );
        },
        
        /**
         * Flatten nested objects for Lua script compatibility
         */
        flattenObject: (obj: any, prefix: string = ''): string => {
          const flattened: string[] = [];
          
          for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              // Recursively flatten nested objects
              const nestedResult = this.bullSerializationHelpers.flattenObject(value, fullKey);
              if (nestedResult && nestedResult.trim() !== '') {
                flattened.push(nestedResult);
              }
            } else {
              // Convert value to string representation
              const valueStr = Array.isArray(value) 
                ? value.map(String).join(';')
                : String(value);
              flattened.push(`${fullKey}=${valueStr}`);
            }
          }
          
          const result = flattened.join('|');
          return result || '{}';
        },
        
        /**
         * Serialize generic object
         */
        serializeGenericObject: (obj: any): string => {
          try {
            const result = JSON.stringify(obj);
            if (!result || result === 'null' || result === 'undefined' || result.trim() === '') {
              return '{}';
            }
            return result;
          } catch {
            const result = String(obj);
            if (!result || result === 'null' || result === 'undefined' || result.trim() === '') {
              return '{}';
            }
            return result;
          }
        }
      };
}

// Pipeline mock implementation
class PipelineAdapter implements Pipeline {
  protected commands: Array<{ method: string; args: any[] }> = [];
  protected redis: RedisAdapter;

  constructor(redis: RedisAdapter) {
    this.redis = redis;
  }

  // String commands
  set(key: RedisKey, value: RedisValue, ...args: any[]): Pipeline {
    this.commands.push({ method: 'set', args: [key, value, ...args] });
    return this;
  }

  get(key: RedisKey): Pipeline {
    this.commands.push({ method: 'get', args: [key] });
    return this;
  }

  mget(...keys: any[]): Pipeline {
    this.commands.push({ method: 'mget', args: keys });
    return this;
  }

  mset(...args: any[]): Pipeline {
    this.commands.push({ method: 'mset', args });
    return this;
  }

  incr(key: RedisKey): Pipeline {
    this.commands.push({ method: 'incr', args: [key] });
    return this;
  }

  decr(key: RedisKey): Pipeline {
    this.commands.push({ method: 'decr', args: [key] });
    return this;
  }

  incrby(key: RedisKey, increment: number): Pipeline {
    this.commands.push({ method: 'incrby', args: [key, increment] });
    return this;
  }

  decrby(key: RedisKey, decrement: number): Pipeline {
    this.commands.push({ method: 'decrby', args: [key, decrement] });
    return this;
  }

  incrbyfloat(key: RedisKey, increment: number): Pipeline {
    this.commands.push({ method: 'incrbyfloat', args: [key, increment] });
    return this;
  }

  append(key: RedisKey, value: RedisValue): Pipeline {
    this.commands.push({ method: 'append', args: [key, value] });
    return this;
  }

  strlen(key: RedisKey): Pipeline {
    this.commands.push({ method: 'strlen', args: [key] });
    return this;
  }

  getrange(key: RedisKey, start: number, end: number): Pipeline {
    this.commands.push({ method: 'getrange', args: [key, start, end] });
    return this;
  }

  setrange(key: RedisKey, offset: number, value: RedisValue): Pipeline {
    this.commands.push({ method: 'setrange', args: [key, offset, value] });
    return this;
  }

  setex(key: RedisKey, seconds: number, value: RedisValue): Pipeline {
    this.commands.push({ method: 'setex', args: [key, seconds, value] });
    return this;
  }

  setnx(key: RedisKey, value: RedisValue): Pipeline {
    this.commands.push({ method: 'setnx', args: [key, value] });
    return this;
  }

  psetex(key: RedisKey, milliseconds: number, value: RedisValue): Pipeline {
    this.commands.push({ method: 'psetex', args: [key, milliseconds, value] });
    return this;
  }

  // Hash commands
  hset(key: RedisKey, ...args: any[]): Pipeline {
    this.commands.push({ method: 'hset', args: [key, ...args] });
    return this;
  }

  hget(key: RedisKey, field: string): Pipeline {
    this.commands.push({ method: 'hget', args: [key, field] });
    return this;
  }

  hmset(key: RedisKey, ...args: any[]): Pipeline {
    this.commands.push({ method: 'hmset', args: [key, ...args] });
    return this;
  }

  hmget(key: RedisKey, ...fields: any[]): Pipeline {
    this.commands.push({ method: 'hmget', args: [key, ...fields] });
    return this;
  }

  hgetall(key: RedisKey): Pipeline {
    this.commands.push({ method: 'hgetall', args: [key] });
    return this;
  }

  hdel(key: RedisKey, ...fields: string[]): Pipeline {
    this.commands.push({ method: 'hdel', args: [key, ...fields] });
    return this;
  }

  hexists(key: RedisKey, field: string): Pipeline {
    this.commands.push({ method: 'hexists', args: [key, field] });
    return this;
  }

  hkeys(key: RedisKey): Pipeline {
    this.commands.push({ method: 'hkeys', args: [key] });
    return this;
  }

  hvals(key: RedisKey): Pipeline {
    this.commands.push({ method: 'hvals', args: [key] });
    return this;
  }

  hlen(key: RedisKey): Pipeline {
    this.commands.push({ method: 'hlen', args: [key] });
    return this;
  }

  hincrby(key: RedisKey, field: string, increment: number): Pipeline {
    this.commands.push({ method: 'hincrby', args: [key, field, increment] });
    return this;
  }

  hincrbyfloat(key: RedisKey, field: string, increment: number): Pipeline {
    this.commands.push({ method: 'hincrbyfloat', args: [key, field, increment] });
    return this;
  }

  hsetnx(key: RedisKey, field: string, value: RedisValue): Pipeline {
    this.commands.push({ method: 'hsetnx', args: [key, field, value] });
    return this;
  }

  // List commands
  lpush(key: RedisKey, ...elements: any[]): Pipeline {
    this.commands.push({ method: 'lpush', args: [key, ...elements] });
    return this;
  }

  rpush(key: RedisKey, ...elements: any[]): Pipeline {
    this.commands.push({ method: 'rpush', args: [key, ...elements] });
    return this;
  }

  lpop(key: RedisKey, count?: number): Pipeline {
    this.commands.push({ method: 'lpop', args: count !== undefined ? [key, count] : [key] });
    return this;
  }

  rpop(key: RedisKey, count?: number): Pipeline {
    this.commands.push({ method: 'rpop', args: count !== undefined ? [key, count] : [key] });
    return this;
  }

  lrange(key: RedisKey, start: number, stop: number): Pipeline {
    this.commands.push({ method: 'lrange', args: [key, start, stop] });
    return this;
  }

  llen(key: RedisKey): Pipeline {
    this.commands.push({ method: 'llen', args: [key] });
    return this;
  }

  lindex(key: RedisKey, index: number): Pipeline {
    this.commands.push({ method: 'lindex', args: [key, index] });
    return this;
  }

  lset(key: RedisKey, index: number, element: RedisValue): Pipeline {
    this.commands.push({ method: 'lset', args: [key, index, element] });
    return this;
  }

  ltrim(key: RedisKey, start: number, stop: number): Pipeline {
    this.commands.push({ method: 'ltrim', args: [key, start, stop] });
    return this;
  }

  lrem(key: RedisKey, count: number, element: RedisValue): Pipeline {
    this.commands.push({ method: 'lrem', args: [key, count, element] });
    return this;
  }

  lpushx(key: RedisKey, ...elements: RedisValue[]): Pipeline {
    this.commands.push({ method: 'lpushx', args: [key, ...elements] });
    return this;
  }

  rpushx(key: RedisKey, ...elements: RedisValue[]): Pipeline {
    this.commands.push({ method: 'rpushx', args: [key, ...elements] });
    return this;
  }

  // Set commands
  sadd(key: RedisKey, ...members: RedisValue[]): Pipeline {
    this.commands.push({ method: 'sadd', args: [key, ...members] });
    return this;
  }

  srem(key: RedisKey, ...members: RedisValue[]): Pipeline {
    this.commands.push({ method: 'srem', args: [key, ...members] });
    return this;
  }

  smembers(key: RedisKey): Pipeline {
    this.commands.push({ method: 'smembers', args: [key] });
    return this;
  }

  scard(key: RedisKey): Pipeline {
    this.commands.push({ method: 'scard', args: [key] });
    return this;
  }

  sismember(key: RedisKey, member: RedisValue): Pipeline {
    this.commands.push({ method: 'sismember', args: [key, member] });
    return this;
  }

  spop(key: RedisKey, count?: number): Pipeline {
    this.commands.push({ method: 'spop', args: count !== undefined ? [key, count] : [key] });
    return this;
  }

  srandmember(key: RedisKey, count?: number): Pipeline {
    this.commands.push({ method: 'srandmember', args: count !== undefined ? [key, count] : [key] });
    return this;
  }

  sunion(...keys: RedisKey[]): Pipeline {
    this.commands.push({ method: 'sunion', args: keys });
    return this;
  }

  sinter(...keys: RedisKey[]): Pipeline {
    this.commands.push({ method: 'sinter', args: keys });
    return this;
  }

  sdiff(...keys: RedisKey[]): Pipeline {
    this.commands.push({ method: 'sdiff', args: keys });
    return this;
  }

  sunionstore(destination: RedisKey, ...keys: RedisKey[]): Pipeline {
    this.commands.push({ method: 'sunionstore', args: [destination, ...keys] });
    return this;
  }

  sinterstore(destination: RedisKey, ...keys: RedisKey[]): Pipeline {
    this.commands.push({ method: 'sinterstore', args: [destination, ...keys] });
    return this;
  }

  sdiffstore(destination: RedisKey, ...keys: RedisKey[]): Pipeline {
    this.commands.push({ method: 'sdiffstore', args: [destination, ...keys] });
    return this;
  }

  // Sorted Set commands
  zadd(key: RedisKey, ...scoreMembers: (number | string)[]): Pipeline {
    this.commands.push({ method: 'zadd', args: [key, ...scoreMembers] });
    return this;
  }

  zrem(key: RedisKey, ...members: RedisValue[]): Pipeline {
    this.commands.push({ method: 'zrem', args: [key, ...members] });
    return this;
  }

  zrange(key: RedisKey, start: number, stop: number, options?: any): Pipeline {
    this.commands.push({ method: 'zrange', args: [key, start, stop, options] });
    return this;
  }

  zrevrange(key: RedisKey, start: number, stop: number, options?: any): Pipeline {
    this.commands.push({ method: 'zrevrange', args: [key, start, stop, options] });
    return this;
  }

  zscore(key: RedisKey, member: RedisValue): Pipeline {
    this.commands.push({ method: 'zscore', args: [key, member] });
    return this;
  }

  zcard(key: RedisKey): Pipeline {
    this.commands.push({ method: 'zcard', args: [key] });
    return this;
  }

  zrank(key: RedisKey, member: RedisValue): Pipeline {
    this.commands.push({ method: 'zrank', args: [key, member] });
    return this;
  }

  zrevrank(key: RedisKey, member: RedisValue): Pipeline {
    this.commands.push({ method: 'zrevrank', args: [key, member] });
    return this;
  }

  zincrby(key: RedisKey, increment: number, member: RedisValue): Pipeline {
    this.commands.push({ method: 'zincrby', args: [key, increment, member] });
    return this;
  }

  zcount(key: RedisKey, min: number | string, max: number | string): Pipeline {
    this.commands.push({ method: 'zcount', args: [key, min, max] });
    return this;
  }

  zremrangebyrank(key: RedisKey, start: number, stop: number): Pipeline {
    this.commands.push({ method: 'zremrangebyrank', args: [key, start, stop] });
    return this;
  }

  zremrangebyscore(key: RedisKey, min: number | string, max: number | string): Pipeline {
    this.commands.push({ method: 'zremrangebyscore', args: [key, min, max] });
    return this;
  }

  // Key commands
  del(...keys: RedisKey[]): Pipeline {
    this.commands.push({ method: 'del', args: keys });
    return this;
  }

  exists(...keys: RedisKey[]): Pipeline {
    this.commands.push({ method: 'exists', args: keys });
    return this;
  }

  expire(key: RedisKey, seconds: number): Pipeline {
    this.commands.push({ method: 'expire', args: [key, seconds] });
    return this;
  }

  ttl(key: RedisKey): Pipeline {
    this.commands.push({ method: 'ttl', args: [key] });
    return this;
  }

  type(key: RedisKey): Pipeline {
    this.commands.push({ method: 'type', args: [key] });
    return this;
  }

  // Pub/Sub commands
  publish(channel: string, message: RedisValue): Pipeline {
    this.commands.push({ method: 'publish', args: [channel, message] });
    return this;
  }

  async exec(): Promise<Array<[Error | null, any]>> {
    if (this.commands.length === 0) {
      return [];
    }

    const client = await (this.redis as any).ensureConnected();
    const batch = new Batch(false); // Non-atomic pipeline

    // Add all commands to the batch
    for (const cmd of this.commands) {
      try {
        this.addCommandToBatch(batch, cmd.method, cmd.args);
      } catch (error) {
        // If there's an error adding a command, return it in the results
        continue;
      }
    }

    try {
      // Execute the batch
      const results = await client.exec(batch, false); // raiseOnError = false
      
      // Convert results to ioredis format: [Error | null, result]
      const formattedResults: Array<[Error | null, any]> = [];
      
      if (results) {
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          
          // When raiseOnError = false, errors are returned in the response array
          // Check for various error types that might be returned
          if (result instanceof Error || 
              (result && typeof result === 'object' && 'message' in result && result.name && result.name.includes('Error'))) {
            formattedResults.push([result as Error, null]);
          } else {
            formattedResults.push([null, result]);
          }
        }
      }
      
      return formattedResults;
    } catch (error) {
      // If the entire batch fails, return error for all commands
      return this.commands.map(() => [error as Error, null]);
    } finally {
      // Clear commands after execution
      this.commands = [];
    }
  }

  protected addCommandToBatch(batch: Batch, method: string, args: any[]): void {
    // Map pipeline commands to batch methods
    switch (method) {
      case 'set':
        if (args.length >= 2) {
          const translated = ParameterTranslator.translateSetArgs(args);
          batch.set(translated.key, translated.value, translated.options);
        }
        break;
      case 'get':
        if (args.length >= 1) {
          batch.get(ParameterTranslator.normalizeKey(args[0]));
        }
        break;
      case 'mget':
        const mgetKeys = ParameterTranslator.translateMGetArgs(args);
        batch.mget(mgetKeys);
        break;
      case 'mset':
        const msetData = ParameterTranslator.translateMSetArgs(args);
        batch.mset(msetData);
        break;
      case 'incr':
        batch.incr(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'decr':
        batch.decr(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'incrby':
        batch.incrBy(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'decrby':
        batch.decrBy(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'incrbyfloat':
        batch.incrByFloat(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'append':
        batch.append(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[1]));
        break;
      case 'strlen':
        batch.strlen(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'getrange':
        batch.getrange(ParameterTranslator.normalizeKey(args[0]), args[1], args[2]);
        break;
      case 'setrange':
        batch.setrange(ParameterTranslator.normalizeKey(args[0]), args[1], ParameterTranslator.normalizeValue(args[2]));
        break;
      case 'setex':
        batch.set(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[2]), {
          expiry: { type: TimeUnit.Seconds, count: args[1] }
        });
        break;
      case 'setnx':
        batch.set(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[1]), {
          conditionalSet: 'onlyIfDoesNotExist'
        });
        break;
      case 'psetex':
        batch.set(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[2]), {
          expiry: { type: TimeUnit.Milliseconds, count: args[1] }
        });
        break;
      // Hash commands
      case 'hset':
        const hsetTranslated = ParameterTranslator.translateHSetArgs(args);
        const hashDataType = Object.entries(hsetTranslated.fieldValues).map(([field, value]) => ({
          field,
          value
        }));
        batch.hset(hsetTranslated.key, hashDataType);
        break;
      case 'hget':
        batch.hget(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'hmset':
        const hmsetTranslated = ParameterTranslator.translateHSetArgs(args);
        const hmsetHashDataType = Object.entries(hmsetTranslated.fieldValues).map(([field, value]) => ({
          field,
          value
        }));
        batch.hset(hmsetTranslated.key, hmsetHashDataType);
        break;
      case 'hmget':
        const hmgetTranslated = ParameterTranslator.translateHMGetArgs(args);
        batch.hmget(hmgetTranslated.key, hmgetTranslated.fields);
        break;
      case 'hgetall':
        batch.hgetall(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'hdel':
        batch.hdel(ParameterTranslator.normalizeKey(args[0]), args.slice(1));
        break;
      case 'hexists':
        batch.hexists(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'hkeys':
        batch.hkeys(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'hvals':
        batch.hvals(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'hlen':
        batch.hlen(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'hincrby':
        batch.hincrBy(ParameterTranslator.normalizeKey(args[0]), args[1], args[2]);
        break;
      case 'hincrbyfloat':
        batch.hincrByFloat(ParameterTranslator.normalizeKey(args[0]), args[1], args[2]);
        break;
      case 'hsetnx':
        batch.hsetnx(ParameterTranslator.normalizeKey(args[0]), args[1], ParameterTranslator.normalizeValue(args[2]));
        break;
      // List commands
      case 'lpush':
        const lpushTranslated = ParameterTranslator.translateListPushArgs(args);
        batch.lpush(lpushTranslated.key, lpushTranslated.elements);
        break;
      case 'rpush':
        const rpushTranslated = ParameterTranslator.translateListPushArgs(args);
        batch.rpush(rpushTranslated.key, rpushTranslated.elements);
        break;
      case 'lpop':
        if (args.length > 1) {
          batch.lpopCount(ParameterTranslator.normalizeKey(args[0]), args[1]);
        } else {
          batch.lpop(ParameterTranslator.normalizeKey(args[0]));
        }
        break;
      case 'rpop':
        if (args.length > 1) {
          batch.rpopCount(ParameterTranslator.normalizeKey(args[0]), args[1]);
        } else {
          batch.rpop(ParameterTranslator.normalizeKey(args[0]));
        }
        break;
      case 'lrange':
        batch.lrange(ParameterTranslator.normalizeKey(args[0]), args[1], args[2]);
        break;
      case 'llen':
        batch.llen(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'lindex':
        batch.lindex(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'lset':
        batch.lset(ParameterTranslator.normalizeKey(args[0]), args[1], ParameterTranslator.normalizeValue(args[2]));
        break;
      case 'ltrim':
        batch.ltrim(ParameterTranslator.normalizeKey(args[0]), args[1], args[2]);
        break;
      case 'lrem':
        batch.lrem(ParameterTranslator.normalizeKey(args[0]), args[1], ParameterTranslator.normalizeValue(args[2]));
        break;
      case 'lpushx':
        const lpushxElements = args.slice(1).map(el => ParameterTranslator.normalizeValue(el));
        batch.lpushx(ParameterTranslator.normalizeKey(args[0]), lpushxElements);
        break;
      case 'rpushx':
        const rpushxElements = args.slice(1).map(el => ParameterTranslator.normalizeValue(el));
        batch.rpushx(ParameterTranslator.normalizeKey(args[0]), rpushxElements);
        break;
      // Set commands
      case 'sadd':
        const saddMembers = args.slice(1).map(member => ParameterTranslator.normalizeValue(member));
        batch.sadd(ParameterTranslator.normalizeKey(args[0]), saddMembers);
        break;
      case 'srem':
        const sremMembers = args.slice(1).map(member => ParameterTranslator.normalizeValue(member));
        batch.srem(ParameterTranslator.normalizeKey(args[0]), sremMembers);
        break;
      case 'smembers':
        batch.smembers(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'scard':
        batch.scard(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'sismember':
        batch.sismember(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[1]));
        break;
      case 'spop':
        if (args.length > 1) {
          batch.spopCount(ParameterTranslator.normalizeKey(args[0]), args[1]);
        } else {
          batch.spop(ParameterTranslator.normalizeKey(args[0]));
        }
        break;
      case 'srandmember':
        if (args.length > 1) {
          batch.srandmemberCount(ParameterTranslator.normalizeKey(args[0]), args[1]);
        } else {
          batch.srandmember(ParameterTranslator.normalizeKey(args[0]));
        }
        break;
      case 'sunion':
        const sunionKeys = args.map(key => ParameterTranslator.normalizeKey(key));
        batch.sunion(sunionKeys);
        break;
      case 'sinter':
        const sinterKeys = args.map(key => ParameterTranslator.normalizeKey(key));
        batch.sinter(sinterKeys);
        break;
      case 'sdiff':
        const sdiffKeys = args.map(key => ParameterTranslator.normalizeKey(key));
        batch.sdiff(sdiffKeys);
        break;
      case 'sunionstore':
        const sunionDestination = ParameterTranslator.normalizeKey(args[0]);
        const sunionStoreKeys = args.slice(1).map(key => ParameterTranslator.normalizeKey(key));
        batch.sunionstore(sunionDestination, sunionStoreKeys);
        break;
      case 'sinterstore':
        const sinterDestination = ParameterTranslator.normalizeKey(args[0]);
        const sinterStoreKeys = args.slice(1).map(key => ParameterTranslator.normalizeKey(key));
        batch.sinterstore(sinterDestination, sinterStoreKeys);
        break;
      case 'sdiffstore':
        const sdiffDestination = ParameterTranslator.normalizeKey(args[0]);
        const sdiffStoreKeys = args.slice(1).map(key => ParameterTranslator.normalizeKey(key));
        batch.sdiffstore(sdiffDestination, sdiffStoreKeys);
        break;
      // Sorted Set commands
      case 'zadd':
        const zaddKey = ParameterTranslator.normalizeKey(args[0]);
        const zaddMembers = [];
        for (let i = 1; i < args.length; i += 2) {
          if (i + 1 < args.length && args[i + 1] !== undefined) {
            const member = args[i + 1];
            zaddMembers.push({
              element: ParameterTranslator.normalizeValue(member),
              score: Number(args[i])
            });
          }
        }
        batch.zadd(zaddKey, zaddMembers);
        break;
      case 'zrem':
        const zremKey = ParameterTranslator.normalizeKey(args[0]);
        const zremMembers = args.slice(1).map(member => ParameterTranslator.normalizeValue(member));
        batch.zrem(zremKey, zremMembers);
        break;
      case 'zrange':
        const zrangeKey = ParameterTranslator.normalizeKey(args[0]);
        batch.zrange(zrangeKey, { start: args[1], end: args[2] });
        break;
      case 'zrevrange':
        const zrevrangeKey = ParameterTranslator.normalizeKey(args[0]);
        batch.zrange(zrevrangeKey, { start: args[1], end: args[2] }, true);
        break;
      case 'zscore':
        batch.zscore(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[1]));
        break;
      case 'zcard':
        batch.zcard(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'zrank':
        batch.zrank(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[1]));
        break;
      case 'zrevrank':
        batch.zrevrank(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[1]));
        break;
      case 'zincrby':
        batch.zincrby(ParameterTranslator.normalizeKey(args[0]), args[1], ParameterTranslator.normalizeValue(args[2]));
        break;
      case 'zcount':
        // TODO: Fix boundary type compatibility 
        throw new Error('zcount in pipeline temporarily unavailable');
        break;
      case 'zremrangebyrank':
        batch.zremRangeByRank(ParameterTranslator.normalizeKey(args[0]), args[1], args[2]);
        break;
      case 'zremrangebyscore':
        // TODO: Fix boundary type compatibility
        throw new Error('zremrangebyscore in pipeline temporarily unavailable');
        break;
      // Key commands
      // Key commands
      case 'del':
        const delKeys = ParameterTranslator.translateDelArgs(args);
        batch.del(delKeys);
        break;
      case 'exists':
        const existsKeys = ParameterTranslator.translateExistsArgs(args);
        batch.exists(existsKeys);
        break;
      case 'expire':
        batch.expire(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'ttl':
        batch.ttl(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'type':
        batch.type(ParameterTranslator.normalizeKey(args[0]));
        break;
      // Pub/Sub commands
      case 'publish':
        batch.publish(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[1]));
        break;
      default:
        throw new Error(`Unsupported pipeline command: ${method}`);
    }
  }

  discard(): void {
    this.commands = [];
  }
}

// Multi (transaction) mock implementation
class MultiAdapter implements Multi {
  protected commands: Array<{ method: string; args: any[] }> = [];
  protected redis: RedisAdapter;
  private watchedKeys: Set<string> = new Set();

  constructor(redis: RedisAdapter, watchedKeys?: Set<string>) {
    this.redis = redis;
    if (watchedKeys) {
      this.watchedKeys = new Set(watchedKeys);
    }
  }

  // Basic pipeline methods - just store commands
  set(key: RedisKey, value: RedisValue, ...args: any[]): Multi {
    this.commands.push({ method: 'set', args: [key, value, ...args] });
    return this;
  }

  get(key: RedisKey): Multi {
    this.commands.push({ method: 'get', args: [key] });
    return this;
  }

  mget(...keys: any[]): Multi {
    this.commands.push({ method: 'mget', args: keys });
    return this;
  }

  mset(...args: any[]): Multi {
    this.commands.push({ method: 'mset', args });
    return this;
  }

  incr(key: RedisKey): Multi { this.commands.push({ method: 'incr', args: [key] }); return this; }
  decr(key: RedisKey): Multi { this.commands.push({ method: 'decr', args: [key] }); return this; }
  incrby(key: RedisKey, increment: number): Multi { this.commands.push({ method: 'incrby', args: [key, increment] }); return this; }
  decrby(key: RedisKey, decrement: number): Multi { this.commands.push({ method: 'decrby', args: [key, decrement] }); return this; }
  incrbyfloat(key: RedisKey, increment: number): Multi { this.commands.push({ method: 'incrbyfloat', args: [key, increment] }); return this; }
  append(key: RedisKey, value: RedisValue): Multi { this.commands.push({ method: 'append', args: [key, value] }); return this; }
  strlen(key: RedisKey): Multi { this.commands.push({ method: 'strlen', args: [key] }); return this; }
  getrange(key: RedisKey, start: number, end: number): Multi { this.commands.push({ method: 'getrange', args: [key, start, end] }); return this; }
  setrange(key: RedisKey, offset: number, value: RedisValue): Multi { this.commands.push({ method: 'setrange', args: [key, offset, value] }); return this; }
  setex(key: RedisKey, seconds: number, value: RedisValue): Multi { this.commands.push({ method: 'setex', args: [key, seconds, value] }); return this; }
  setnx(key: RedisKey, value: RedisValue): Multi { this.commands.push({ method: 'setnx', args: [key, value] }); return this; }
  psetex(key: RedisKey, milliseconds: number, value: RedisValue): Multi { this.commands.push({ method: 'psetex', args: [key, milliseconds, value] }); return this; }

  // Hash commands
  hset(key: RedisKey, ...args: any[]): Multi { this.commands.push({ method: 'hset', args: [key, ...args] }); return this; }
  hget(key: RedisKey, field: string): Multi { this.commands.push({ method: 'hget', args: [key, field] }); return this; }
  hmset(key: RedisKey, ...args: any[]): Multi { this.commands.push({ method: 'hmset', args: [key, ...args] }); return this; }
  hmget(key: RedisKey, ...fields: any[]): Multi { this.commands.push({ method: 'hmget', args: [key, ...fields] }); return this; }
  hgetall(key: RedisKey): Multi { this.commands.push({ method: 'hgetall', args: [key] }); return this; }
  hdel(key: RedisKey, ...fields: string[]): Multi { this.commands.push({ method: 'hdel', args: [key, ...fields] }); return this; }
  hexists(key: RedisKey, field: string): Multi { this.commands.push({ method: 'hexists', args: [key, field] }); return this; }
  hkeys(key: RedisKey): Multi { this.commands.push({ method: 'hkeys', args: [key] }); return this; }
  hvals(key: RedisKey): Multi { this.commands.push({ method: 'hvals', args: [key] }); return this; }
  hlen(key: RedisKey): Multi { this.commands.push({ method: 'hlen', args: [key] }); return this; }
  hincrby(key: RedisKey, field: string, increment: number): Multi { this.commands.push({ method: 'hincrby', args: [key, field, increment] }); return this; }
  hincrbyfloat(key: RedisKey, field: string, increment: number): Multi { this.commands.push({ method: 'hincrbyfloat', args: [key, field, increment] }); return this; }
  hsetnx(key: RedisKey, field: string, value: RedisValue): Multi { this.commands.push({ method: 'hsetnx', args: [key, field, value] }); return this; }

  // List commands
  lpush(key: RedisKey, ...elements: any[]): Multi { this.commands.push({ method: 'lpush', args: [key, ...elements] }); return this; }
  rpush(key: RedisKey, ...elements: any[]): Multi { this.commands.push({ method: 'rpush', args: [key, ...elements] }); return this; }
  lpop(key: RedisKey, count?: number): Multi { this.commands.push({ method: 'lpop', args: count !== undefined ? [key, count] : [key] }); return this; }
  rpop(key: RedisKey, count?: number): Multi { this.commands.push({ method: 'rpop', args: count !== undefined ? [key, count] : [key] }); return this; }
  lrange(key: RedisKey, start: number, stop: number): Multi { this.commands.push({ method: 'lrange', args: [key, start, stop] }); return this; }
  llen(key: RedisKey): Multi { this.commands.push({ method: 'llen', args: [key] }); return this; }
  lindex(key: RedisKey, index: number): Multi { this.commands.push({ method: 'lindex', args: [key, index] }); return this; }
  lset(key: RedisKey, index: number, element: RedisValue): Multi { this.commands.push({ method: 'lset', args: [key, index, element] }); return this; }
  ltrim(key: RedisKey, start: number, stop: number): Multi { this.commands.push({ method: 'ltrim', args: [key, start, stop] }); return this; }
  lrem(key: RedisKey, count: number, element: RedisValue): Multi { this.commands.push({ method: 'lrem', args: [key, count, element] }); return this; }
  lpushx(key: RedisKey, ...elements: RedisValue[]): Multi { this.commands.push({ method: 'lpushx', args: [key, ...elements] }); return this; }
  rpushx(key: RedisKey, ...elements: RedisValue[]): Multi { this.commands.push({ method: 'rpushx', args: [key, ...elements] }); return this; }

  // Set commands
  sadd(key: RedisKey, ...members: RedisValue[]): Multi { this.commands.push({ method: 'sadd', args: [key, ...members] }); return this; }
  srem(key: RedisKey, ...members: RedisValue[]): Multi { this.commands.push({ method: 'srem', args: [key, ...members] }); return this; }
  smembers(key: RedisKey): Multi { this.commands.push({ method: 'smembers', args: [key] }); return this; }
  scard(key: RedisKey): Multi { this.commands.push({ method: 'scard', args: [key] }); return this; }
  sismember(key: RedisKey, member: RedisValue): Multi { this.commands.push({ method: 'sismember', args: [key, member] }); return this; }
  spop(key: RedisKey, count?: number): Multi { this.commands.push({ method: 'spop', args: count !== undefined ? [key, count] : [key] }); return this; }
  srandmember(key: RedisKey, count?: number): Multi { this.commands.push({ method: 'srandmember', args: count !== undefined ? [key, count] : [key] }); return this; }
  sunion(...keys: RedisKey[]): Multi { this.commands.push({ method: 'sunion', args: keys }); return this; }
  sinter(...keys: RedisKey[]): Multi { this.commands.push({ method: 'sinter', args: keys }); return this; }
  sdiff(...keys: RedisKey[]): Multi { this.commands.push({ method: 'sdiff', args: keys }); return this; }
  sunionstore(destination: RedisKey, ...keys: RedisKey[]): Multi { this.commands.push({ method: 'sunionstore', args: [destination, ...keys] }); return this; }
  sinterstore(destination: RedisKey, ...keys: RedisKey[]): Multi { this.commands.push({ method: 'sinterstore', args: [destination, ...keys] }); return this; }
  sdiffstore(destination: RedisKey, ...keys: RedisKey[]): Multi { this.commands.push({ method: 'sdiffstore', args: [destination, ...keys] }); return this; }

  // Sorted Set commands
  zadd(key: RedisKey, ...scoreMembers: (number | string)[]): Multi { this.commands.push({ method: 'zadd', args: [key, ...scoreMembers] }); return this; }
  zrem(key: RedisKey, ...members: RedisValue[]): Multi { this.commands.push({ method: 'zrem', args: [key, ...members] }); return this; }
  zrange(key: RedisKey, start: number, stop: number, options?: any): Multi { this.commands.push({ method: 'zrange', args: [key, start, stop, options] }); return this; }
  zrevrange(key: RedisKey, start: number, stop: number, options?: any): Multi { this.commands.push({ method: 'zrevrange', args: [key, start, stop, options] }); return this; }
  zscore(key: RedisKey, member: RedisValue): Multi { this.commands.push({ method: 'zscore', args: [key, member] }); return this; }
  zcard(key: RedisKey): Multi { this.commands.push({ method: 'zcard', args: [key] }); return this; }
  zrank(key: RedisKey, member: RedisValue): Multi { this.commands.push({ method: 'zrank', args: [key, member] }); return this; }
  zrevrank(key: RedisKey, member: RedisValue): Multi { this.commands.push({ method: 'zrevrank', args: [key, member] }); return this; }
  zincrby(key: RedisKey, increment: number, member: RedisValue): Multi { this.commands.push({ method: 'zincrby', args: [key, increment, member] }); return this; }
  zcount(key: RedisKey, min: number | string, max: number | string): Multi { this.commands.push({ method: 'zcount', args: [key, min, max] }); return this; }
  zremrangebyrank(key: RedisKey, start: number, stop: number): Multi { this.commands.push({ method: 'zremrangebyrank', args: [key, start, stop] }); return this; }
  zremrangebyscore(key: RedisKey, min: number | string, max: number | string): Multi { this.commands.push({ method: 'zremrangebyscore', args: [key, min, max] }); return this; }

  // Key commands
  del(...keys: RedisKey[]): Multi { this.commands.push({ method: 'del', args: keys }); return this; }
  exists(...keys: RedisKey[]): Multi { this.commands.push({ method: 'exists', args: keys }); return this; }
  expire(key: RedisKey, seconds: number): Multi { this.commands.push({ method: 'expire', args: [key, seconds] }); return this; }
  ttl(key: RedisKey): Multi { this.commands.push({ method: 'ttl', args: [key] }); return this; }
  type(key: RedisKey): Multi { this.commands.push({ method: 'type', args: [key] }); return this; }

  discard(): void {
    this.commands = [];
  }

  async watch(...keys: RedisKey[]): Promise<string> {
    // Track keys locally
    keys.forEach(key => this.watchedKeys.add(ParameterTranslator.normalizeKey(key)));
    
    // Execute WATCH command through valkey-glide
    const client = await (this.redis as any).ensureConnected();
    const normalizedKeys = keys.map(key => ParameterTranslator.normalizeKey(key));
    await client.customCommand(['WATCH', ...normalizedKeys]);
    
    return 'OK';
  }

  async unwatch(): Promise<string> {
    // Clear local tracking
    this.watchedKeys.clear();
    
    // Execute UNWATCH command through valkey-glide
    const client = await (this.redis as any).ensureConnected();
    await client.customCommand(['UNWATCH']);
    
    return 'OK';
  }

  async exec(): Promise<Array<[Error | null, any]> | null> {
    if (this.commands.length === 0) {
      return [];
    }

    try {
      const client = await (this.redis as any).ensureConnected();
      
      // Pre-validate commands that could cause transaction failure
      // This mimics Redis MULTI/EXEC behavior where invalid commands
      // cause the entire transaction to be discarded
      for (const cmd of this.commands) {
        const validationError = await this.validateCommand(cmd.method, cmd.args);
        if (validationError) {
          // Return null - transaction is discarded due to validation failure
          return null;
        }
      }
      
      const batch = new Batch(true); // Atomic batch for transactions

      // Add all commands to the batch
      for (const cmd of this.commands) {
        try {
          (this as any).addCommandToBatch(batch, cmd.method, cmd.args);
        } catch (error) {
          // If there's an error adding a command, return transaction failure
          return null;
        }
      }

      // Execute the atomic batch
      const results = await client.exec(batch, false); // raiseOnError = false

      // Check if transaction was discarded due to WATCH violations or other failures
      if (results === null) {
        return null; // ioredis convention: null indicates transaction was discarded
      }

      // Format results to match ioredis format: [Error | null, result]
      const formattedResults: Array<[Error | null, any]> = [];

      if (results && Array.isArray(results)) {
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          if (result instanceof Error) {
            formattedResults.push([result, null]);
          } else {
            formattedResults.push([null, result]);
          }
        }
      }

      return formattedResults;
    } catch (error) {
      // Handle transaction failure (e.g., due to WATCH violations or connection issues)
      if (this.isWatchFailure(error)) {
        return null; // ioredis convention: null for discarded transactions
      }
      
      // For other transaction failures, also return null
      return null;
    } finally {
      // Clear commands after execution
      this.commands = [];
      // Clear watched keys on the parent adapter as well
      (this.redis as any).watchedKeys.clear();
    }
  }

  /**
   * Pre-validate commands that could cause transaction failure
   * Returns error string if command would fail, null if command is valid
   */
  private async validateCommand(method: string, args: any[]): Promise<string | null> {
    try {
      const client = await (this.redis as any).ensureConnected();
      
      // Check for common command validation issues
      if (method === 'incr' || method === 'decr' || method === 'incrby' || method === 'decrby' || method === 'incrbyfloat') {
        const key = args[0];
        if (key) {
          // Check if the key exists and contains a non-numeric value
          const value = await client.get(ParameterTranslator.normalizeKey(key));
          if (value !== null) {
            // Try to parse as number
            const numValue = Number(value);
            if (isNaN(numValue)) {
              return `value is not an integer or out of range`;
            }
          }
        }
      }
      
      // Add more validation rules as needed for other commands
      
      return null; // Command is valid
    } catch (error) {
      // If validation itself fails, assume command would fail
      return error instanceof Error ? error.message : 'validation error';
    }
  }

  /**
   * Check if error indicates WATCH key violation
   */
  private isWatchFailure(error: any): boolean {
    // Check for common WATCH failure indicators
    if (error && typeof error.message === 'string') {
      const message = error.message.toLowerCase();
      return message.includes('watch') || 
             message.includes('transaction') ||
             message.includes('multi') ||
             message.includes('exec');
    }
    return false;
  }

  protected addCommandToBatch(batch: Batch, method: string, args: any[]): void {
    // This method is similar to the one in PipelineAdapter but used for transactions
    // We can reuse the same logic since both use Batch
    // Map transaction commands to batch methods
    switch (method) {
      case 'set':
        if (args.length >= 2) {
          const translated = ParameterTranslator.translateSetArgs(args);
          batch.set(translated.key, translated.value, translated.options);
        }
        break;
      case 'get':
        if (args.length >= 1) {
          batch.get(ParameterTranslator.normalizeKey(args[0]));
        }
        break;
      case 'mget':
        const mgetKeys = ParameterTranslator.translateMGetArgs(args);
        batch.mget(mgetKeys);
        break;
      case 'mset':
        const msetData = ParameterTranslator.translateMSetArgs(args);
        batch.mset(msetData);
        break;
      case 'incr':
        batch.incr(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'decr':
        batch.decr(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'incrby':
        batch.incrBy(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'decrby':
        batch.decrBy(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'incrbyfloat':
        batch.incrByFloat(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'append':
        batch.append(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[1]));
        break;
      case 'strlen':
        batch.strlen(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'getrange':
        batch.getrange(ParameterTranslator.normalizeKey(args[0]), args[1], args[2]);
        break;
      case 'setrange':
        batch.setrange(ParameterTranslator.normalizeKey(args[0]), args[1], ParameterTranslator.normalizeValue(args[2]));
        break;
      case 'setex':
        batch.set(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[2]), {
          expiry: { type: TimeUnit.Seconds, count: args[1] }
        });
        break;
      case 'setnx':
        batch.set(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[1]), {
          conditionalSet: 'onlyIfDoesNotExist'
        });
        break;
      case 'psetex':
        batch.set(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[2]), {
          expiry: { type: TimeUnit.Milliseconds, count: args[1] }
        });
        break;
      // Hash commands
      case 'hset':
        const hsetTranslated = ParameterTranslator.translateHSetArgs(args);
        const hashDataType = Object.entries(hsetTranslated.fieldValues).map(([field, value]) => ({
          field,
          value
        }));
        batch.hset(hsetTranslated.key, hashDataType);
        break;
      case 'hget':
        batch.hget(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'hmset':
        const hmsetTranslated = ParameterTranslator.translateHSetArgs(args);
        const hmsetHashDataType = Object.entries(hmsetTranslated.fieldValues).map(([field, value]) => ({
          field,
          value
        }));
        batch.hset(hmsetTranslated.key, hmsetHashDataType);
        break;
      case 'hmget':
        const hmgetTranslated = ParameterTranslator.translateHMGetArgs(args);
        batch.hmget(hmgetTranslated.key, hmgetTranslated.fields);
        break;
      case 'hgetall':
        batch.hgetall(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'hdel':
        batch.hdel(ParameterTranslator.normalizeKey(args[0]), args.slice(1));
        break;
      case 'hexists':
        batch.hexists(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'hkeys':
        batch.hkeys(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'hvals':
        batch.hvals(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'hlen':
        batch.hlen(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'hincrby':
        batch.hincrBy(ParameterTranslator.normalizeKey(args[0]), args[1], args[2]);
        break;
      case 'hincrbyfloat':
        batch.hincrByFloat(ParameterTranslator.normalizeKey(args[0]), args[1], args[2]);
        break;
      case 'hsetnx':
        batch.hsetnx(ParameterTranslator.normalizeKey(args[0]), args[1], ParameterTranslator.normalizeValue(args[2]));
        break;
      // List commands
      case 'lpush':
        const lpushTranslated = ParameterTranslator.translateListPushArgs(args);
        batch.lpush(lpushTranslated.key, lpushTranslated.elements);
        break;
      case 'rpush':
        const rpushTranslated = ParameterTranslator.translateListPushArgs(args);
        batch.rpush(rpushTranslated.key, rpushTranslated.elements);
        break;
      case 'lpop':
        if (args.length > 1) {
          batch.lpopCount(ParameterTranslator.normalizeKey(args[0]), args[1]);
        } else {
          batch.lpop(ParameterTranslator.normalizeKey(args[0]));
        }
        break;
      case 'rpop':
        if (args.length > 1) {
          batch.rpopCount(ParameterTranslator.normalizeKey(args[0]), args[1]);
        } else {
          batch.rpop(ParameterTranslator.normalizeKey(args[0]));
        }
        break;
      case 'lrange':
        batch.lrange(ParameterTranslator.normalizeKey(args[0]), args[1], args[2]);
        break;
      case 'llen':
        batch.llen(ParameterTranslator.normalizeKey(args[0]));
        break;
      case 'lindex':
        batch.lindex(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'lset':
        batch.lset(ParameterTranslator.normalizeKey(args[0]), args[1], ParameterTranslator.normalizeValue(args[2]));
        break;
      case 'ltrim':
        batch.ltrim(ParameterTranslator.normalizeKey(args[0]), args[1], args[2]);
        break;
      case 'lrem':
        batch.lrem(ParameterTranslator.normalizeKey(args[0]), args[1], ParameterTranslator.normalizeValue(args[2]));
        break;
      case 'lpushx':
        const lpushxElements = args.slice(1).map(el => ParameterTranslator.normalizeValue(el));
        batch.lpushx(ParameterTranslator.normalizeKey(args[0]), lpushxElements);
        break;
      case 'rpushx':
        const rpushxElements = args.slice(1).map(el => ParameterTranslator.normalizeValue(el));
        batch.rpushx(ParameterTranslator.normalizeKey(args[0]), rpushxElements);
        break;
      // Key commands
      case 'del':
        const delKeys = ParameterTranslator.translateDelArgs(args);
        batch.del(delKeys);
        break;
      case 'exists':
        const existsKeys = ParameterTranslator.translateExistsArgs(args);
        batch.exists(existsKeys);
        break;
      case 'expire':
        batch.expire(ParameterTranslator.normalizeKey(args[0]), args[1]);
        break;
      case 'ttl':
        batch.ttl(ParameterTranslator.normalizeKey(args[0]));
        break;
      // Pub/Sub commands
      case 'publish':
        batch.publish(ParameterTranslator.normalizeKey(args[0]), ParameterTranslator.normalizeValue(args[1]));
        break;
      
      // Bull compatibility: moveToFinished command
      case 'moveToFinished':
        // Bull's moveToFinished is typically a Lua script
        // For now, we'll implement it as a custom command
        const moveArgs = args.map(arg => ParameterTranslator.normalizeValue(arg));
        batch.customCommand(['EVAL', 'return 1', '0', ...moveArgs]);
        break;
        
      // Sorted set commands
      case 'zrange':
        const zrangeKey = ParameterTranslator.normalizeKey(args[0]);
        batch.zrange(zrangeKey, { start: args[1], end: args[2] });
        break;
      case 'zrevrange':
        const zrevrangeKey = ParameterTranslator.normalizeKey(args[0]);
        batch.zrange(zrevrangeKey, { start: args[1], end: args[2] }, true);
        break;
        
      default:
        throw new Error(`Unsupported transaction command: ${method}`);
    }
  }

  // Bull compatibility: saveStacktrace method for debugging support
  saveStacktrace(): this {
    // ioredis saveStacktrace method - enables stack trace capture for debugging
    // For our implementation, this is a no-op but must exist for Bull compatibility
    return this;
  }

  // Bull compatibility: moveToFinished method for job completion
  moveToFinished(...args: any[]): this {
    // Bull uses this method to mark jobs as finished
    // This is typically a Lua script call, but we'll store it as a custom command
    this.commands.push({ method: 'moveToFinished', args });
    return this;
  }
}

// Export the classes
export { MultiAdapter, PipelineAdapter };
