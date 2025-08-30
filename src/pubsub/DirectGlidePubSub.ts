/**
 * Direct GLIDE Pub/Sub Utility
 * 
 * This utility provides the working GLIDE pub/sub pattern that can be used
 * directly in applications. It does NOT encapsulate the polling - instead,
 * it provides utilities to set up the working pattern.
 */

import { 
  GlideClient, 
  GlideClientConfiguration, 
  PubSubMsg, 
  ProtocolVersion 
} from '@valkey/valkey-glide';
import { RedisOptions } from '../types';

export interface PubSubClients {
  publisher: GlideClient;
  subscriber: GlideClient;
}

export interface PubSubMessage {
  channel: string;
  message: string;
  pattern?: string;
}

/**
 * Create separate publisher and subscriber clients
 */
export async function createPubSubClients(
  options: RedisOptions,
  subscriptions: {
    channels?: string[];
    patterns?: string[];
  }
): Promise<PubSubClients> {
  const baseConfig: GlideClientConfiguration = {
    addresses: [{ host: options.host || 'localhost', port: options.port || 6379 }],
    protocol: ProtocolVersion.RESP3,
  };

  // Create publisher client (regular client)
  const publisher = await GlideClient.createClient(baseConfig);

  // Create subscriber client with subscriptions
  const subscriberConfig: GlideClientConfiguration = {
    ...baseConfig,
    pubsubSubscriptions: {
      channelsAndPatterns: {}
    }
  };

  // Add exact channels
  if (subscriptions.channels && subscriptions.channels.length > 0) {
    subscriberConfig.pubsubSubscriptions!.channelsAndPatterns![
      GlideClientConfiguration.PubSubChannelModes.Exact
    ] = new Set(subscriptions.channels);
  }

  // Add pattern channels
  if (subscriptions.patterns && subscriptions.patterns.length > 0) {
    subscriberConfig.pubsubSubscriptions!.channelsAndPatterns![
      GlideClientConfiguration.PubSubChannelModes.Pattern
    ] = new Set(subscriptions.patterns);
  }

  const subscriber = await GlideClient.createClient(subscriberConfig);

  return { publisher, subscriber };
}

/**
 * Publish a message using GLIDE client
 */
export async function publishMessage(
  publisher: GlideClient,
  channel: string,
  message: string
): Promise<number> {
  return await publisher.publish(message, channel); // GLIDE order: message, channel
}

/**
 * Poll for messages using the working pattern
 * 
 * This function implements the exact pattern that works with GLIDE.
 * It should be called in a loop in your application code.
 */
export async function pollForMessage(
  subscriber: GlideClient,
  timeoutMs: number = 100
): Promise<PubSubMessage | null> {
  try {
    const message: PubSubMsg | null = await Promise.race([
      subscriber.getPubSubMessage(),
      new Promise<null>(resolve => setTimeout(() => resolve(null), timeoutMs))
    ]);

    if (message) {
      const result: PubSubMessage = {
        channel: String(message.channel),
        message: String(message.message)
      };
      
      if (message.pattern) {
        result.pattern = String(message.pattern);
      }
      
      return result;
    }

    return null;
  } catch (error) {
    // Ignore errors during client shutdown - this is expected
    if (error && typeof error === 'object' && 'name' in error) {
      if (error.name === 'ClosingError') {
        return null; // Client is closing, stop polling
      }
    }
    console.error('Error polling for message:', error);
    return null;
  }
}

/**
 * Create a simple polling loop
 * 
 * This is a utility function that implements the working polling pattern.
 * Use this in your application code where you have direct control.
 */
export async function createPollingLoop(
  subscriber: GlideClient,
  onMessage: (message: PubSubMessage) => void,
  options: {
    maxIterations?: number;
    pollTimeoutMs?: number;
    loopDelayMs?: number;
  } = {}
): Promise<void> {
  const {
    maxIterations = 1000,
    pollTimeoutMs = 100,
    loopDelayMs = 10
  } = options;

  // Use the proven for-loop pattern
  for (let i = 0; i < maxIterations; i++) {
    const message = await pollForMessage(subscriber, pollTimeoutMs);
    
    if (message) {
      onMessage(message);
    }

    // Small delay to prevent tight loop
    await new Promise(resolve => setTimeout(resolve, loopDelayMs));
  }
}

/**
 * Cleanup pub/sub clients
 */
export function cleanupPubSubClients(clients: PubSubClients): void {
  clients.publisher.close();
  clients.subscriber.close();
}

/**
 * Example usage pattern for applications
 */
export const exampleUsage = `
// Example: Direct GLIDE Pub/Sub Usage

import { 
  createPubSubClients, 
  publishMessage, 
  createPollingLoop, 
  cleanupPubSubClients 
} from './DirectGlidePubSub';

async function example() {
  // Create clients
  const clients = await createPubSubClients(
    { host: 'localhost', port: 6379 },
    { 
      channels: ['my-channel'], 
      patterns: ['news.*'] 
    }
  );

  // Set up message handling
  const handleMessage = (message) => {
    if (message.pattern) {
      console.log('Pattern message:', message.pattern, message.channel, message.message);
    } else {
      console.log('Channel message:', message.channel, message.message);
    }
  };

  // Start polling (in background)
  const pollingPromise = createPollingLoop(clients.subscriber, handleMessage);

  // Publish messages
  await publishMessage(clients.publisher, 'my-channel', 'Hello World!');
  await publishMessage(clients.publisher, 'news.sports', 'Goal scored!');

  // Wait and cleanup
  setTimeout(() => {
    cleanupPubSubClients(clients);
  }, 5000);
}
`;

/**
 * Library Integration Helper
 * 
 * This provides a pattern for integrating with Redis libraries using direct GLIDE
 * Works with Bull/BullMQ, connect-redis, Socket.IO adapters, and other libraries
 */
export class LibraryGlideIntegration {
  private clients: PubSubClients | null = null;
  private pollingActive = false;
  private channels = new Set<string>();
  private patterns = new Set<string>();
  private onMessageCallback: ((msg: PubSubMessage) => void) | null = null;

  constructor(onMessage?: (msg: PubSubMessage) => void) {
    if (onMessage) this.onMessageCallback = onMessage;
  }

  setOnMessage(handler: (msg: PubSubMessage) => void) {
    this.onMessageCallback = handler;
  }

  async initialize(options: RedisOptions, subs: string[] | { channels?: string[]; patterns?: string[] }) {
    const channels = Array.isArray(subs) ? subs : (subs.channels || []);
    const patterns = Array.isArray(subs) ? [] : (subs.patterns || []);

    this.channels = new Set(channels.map(String));
    this.patterns = new Set(patterns.map(String));

    this.clients = await createPubSubClients(options, {
      channels: Array.from(this.channels),
      patterns: Array.from(this.patterns),
    });
    this.pollingActive = true;

    // Start polling in background
    this.startPolling();
  }

  private async startPolling() {
    if (!this.clients) return;

    const poll = async () => {
      if (!this.pollingActive || !this.clients) return;

      try {
        const message = await pollForMessage(this.clients.subscriber);
        if (message && this.pollingActive) {
          this.handleLibraryMessage(message);
        }
      } catch (error) {
        // Stop polling if client is closing
        if (error && typeof error === 'object' && 'name' in error && error.name === 'ClosingError') {
          this.pollingActive = false;
          return;
        }
        // Otherwise continue polling
      }

      if (this.pollingActive) {
        setImmediate(poll);
      }
    };

    setImmediate(poll);
  }

  private handleLibraryMessage(message: PubSubMessage) {
    if (this.onMessageCallback) {
      this.onMessageCallback(message);
    } else {
      console.log('Library message:', message.channel, message.message);
    }
  }

  async publish(channel: string, message: string): Promise<number> {
    if (!this.clients) throw new Error('Not initialized');
    return await publishMessage(this.clients.publisher, channel, message);
  }

  getSubscriptions() {
    return {
      channels: Array.from(this.channels),
      patterns: Array.from(this.patterns),
    };
  }

  async updateSubscriptions(options: RedisOptions, updates: { addChannels?: string[]; removeChannels?: string[]; addPatterns?: string[]; removePatterns?: string[] }) {
    // Update sets
    (updates.addChannels || []).forEach(c => this.channels.add(String(c)));
    (updates.removeChannels || []).forEach(c => this.channels.delete(String(c)));
    (updates.addPatterns || []).forEach(p => this.patterns.add(String(p)));
    (updates.removePatterns || []).forEach(p => this.patterns.delete(String(p)));

    // Recreate clients to apply new subscriptions
    await this.reinitialize(options);
  }

  private async reinitialize(options: RedisOptions) {
    const currentHandler = this.onMessageCallback;
    await this.cleanup();
    this.onMessageCallback = currentHandler || null;
    await this.initialize(options, { channels: Array.from(this.channels), patterns: Array.from(this.patterns) });
  }

  async cleanup() {
    this.pollingActive = false;
    // Small delay to let polling complete
    await new Promise(resolve => setTimeout(resolve, 10));
    if (this.clients) {
      cleanupPubSubClients(this.clients);
      this.clients = null;
    }
  }
}

// Keep the old export for backward compatibility
export const BullGlideIntegration = LibraryGlideIntegration;
