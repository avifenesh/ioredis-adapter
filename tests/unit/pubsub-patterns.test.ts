/**
 * Pub/Sub Patterns Comprehensive Tests
 * 
 * Real-world patterns based on production systems:
 * - Slack's channel message routing and notifications
 * - Discord's real-time presence and voice channel updates
 * - Twitch's live chat and stream event broadcasting
 * - WhatsApp's message delivery and group chat patterns
 * - GitHub's webhook event distribution
 * - Trading platforms' real-time price updates
 */

import { RedisAdapter } from '../../src/adapters/RedisAdapter';
import { getRedisTestConfig } from '../utils/redis-config';

describe('Pub/Sub Patterns - Real-World Message Routing', () => {
  let publisher: RedisAdapter;
  let subscriber: RedisAdapter;

  beforeEach(async () => {
    const config = await getRedisTestConfig();
    publisher = new RedisAdapter(config);
    subscriber = new RedisAdapter(config);
  });

  afterEach(async () => {
    // Clean up subscribers first
    if (subscriber) {
      try {
        await subscriber.unsubscribe();
        await subscriber.punsubscribe();
      } catch (error) {
        // Ignore cleanup errors
      }
      await subscriber.disconnect();
    }
    
    if (publisher) {
      await publisher.disconnect();
    }
  });

  describe('Slack Channel Notification Pattern', () => {
    test('should route messages to specific channels', async () => {
      const receivedMessages: Array<{ channel: string; message: string }> = [];
      
      // Subscribe to specific Slack-style channels
      await subscriber.subscribe('channel:general', 'channel:random', 'channel:tech-discuss');
      
      subscriber.on('message', (channel: string, message: string) => {
        receivedMessages.push({ channel, message });
      });

      // Wait for subscription to be established
      await new Promise(resolve => setTimeout(resolve, 100));

      // Simulate Slack messages to different channels
      await publisher.publish('channel:general', JSON.stringify({
        user: 'alice',
        text: 'Good morning everyone!',
        timestamp: Date.now(),
        thread_ts: null
      }));

      await publisher.publish('channel:tech-discuss', JSON.stringify({
        user: 'bob_dev',
        text: 'Anyone tried the new Redis features?',
        timestamp: Date.now(),
        thread_ts: null
      }));

      await publisher.publish('channel:random', JSON.stringify({
        user: 'charlie',
        text: 'Coffee break time! ☕',
        timestamp: Date.now(),
        thread_ts: null
      }));

      // Wait for messages to be received
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(receivedMessages).toHaveLength(3);
      
      const generalMsg = receivedMessages.find(m => m.channel === 'channel:general');
      const techMsg = receivedMessages.find(m => m.channel === 'channel:tech-discuss');
      const randomMsg = receivedMessages.find(m => m.channel === 'channel:random');

      expect(generalMsg).toBeDefined();
      expect(techMsg).toBeDefined();
      expect(randomMsg).toBeDefined();

      // Verify message content
      const generalData = JSON.parse(generalMsg!.message);
      expect(generalData.user).toBe('alice');
      expect(generalData.text).toContain('Good morning');

      const techData = JSON.parse(techMsg!.message);
      expect(techData.user).toBe('bob_dev');
      expect(techData.text).toContain('Redis features');
    });

    test('should handle direct message notifications', async () => {
      const dmMessages: Array<{ channel: string; message: string }> = [];
      
      // Subscribe to direct message patterns (Slack DM format)
      await subscriber.psubscribe('dm:user123:*', 'dm:*:user123');
      
      subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
        dmMessages.push({ channel, message });
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Send DM from user456 to user123
      await publisher.publish('dm:user456:user123', JSON.stringify({
        from: 'user456',
        to: 'user123',
        text: 'Hey, can you review my PR?',
        timestamp: Date.now(),
        is_dm: true
      }));

      // Send DM from user123 to user789 (should also match pattern)
      await publisher.publish('dm:user123:user789', JSON.stringify({
        from: 'user123',
        to: 'user789', 
        text: 'Sure, will check it out!',
        timestamp: Date.now(),
        is_dm: true
      }));

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(dmMessages.length).toBeGreaterThanOrEqual(1);
      
      const incomingDM = dmMessages.find(m => m.channel === 'dm:user456:user123');
      expect(incomingDM).toBeDefined();

      const dmData = JSON.parse(incomingDM!.message);
      expect(dmData.from).toBe('user456');
      expect(dmData.to).toBe('user123');
      expect(dmData.is_dm).toBe(true);
    });
  });

  describe('Discord Real-Time Presence Pattern', () => {
    test('should broadcast user presence updates', async () => {
      const presenceUpdates: Array<{ channel: string; message: string }> = [];
      
      // Subscribe to guild presence updates (Discord pattern)
      await subscriber.psubscribe('presence:guild:*');
      
      subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
        presenceUpdates.push({ channel, message });
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Simulate user coming online
      await publisher.publish('presence:guild:123456', JSON.stringify({
        user_id: 'user789',
        status: 'online',
        activity: {
          name: 'Visual Studio Code',
          type: 'PLAYING'
        },
        timestamp: Date.now()
      }));

      // User starts playing a game
      await publisher.publish('presence:guild:123456', JSON.stringify({
        user_id: 'user789',
        status: 'dnd',
        activity: {
          name: 'Cyberpunk 2077',
          type: 'PLAYING',
          details: 'Night City'
        },
        timestamp: Date.now()
      }));

      // Another user joins voice channel
      await publisher.publish('presence:guild:123456', JSON.stringify({
        user_id: 'user456',
        voice_channel: 'General',
        voice_state: 'joined',
        timestamp: Date.now()
      }));

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(presenceUpdates.length).toBeGreaterThanOrEqual(3);

      const onlineUpdate = presenceUpdates.find(u => {
        const data = JSON.parse(u.message);
        return data.user_id === 'user789' && data.status === 'online';
      });
      expect(onlineUpdate).toBeDefined();

      const voiceUpdate = presenceUpdates.find(u => {
        const data = JSON.parse(u.message);
        return data.voice_channel === 'General';
      });
      expect(voiceUpdate).toBeDefined();
    });

    test('should handle voice channel state changes', async () => {
      const voiceUpdates: string[] = [];
      
      // Subscribe to voice channel events
      await subscriber.subscribe('voice:channel:updates');
      
      subscriber.on('message', (channel: string, message: string) => {
        if (channel === 'voice:channel:updates') {
          voiceUpdates.push(message);
        }
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // User joins voice channel
      await publisher.publish('voice:channel:updates', JSON.stringify({
        action: 'user_joined',
        channel_id: 'voice_general',
        user_id: 'user123',
        timestamp: Date.now()
      }));

      // User mutes microphone
      await publisher.publish('voice:channel:updates', JSON.stringify({
        action: 'user_muted',
        channel_id: 'voice_general',
        user_id: 'user123',
        muted: true,
        timestamp: Date.now()
      }));

      // User leaves voice channel
      await publisher.publish('voice:channel:updates', JSON.stringify({
        action: 'user_left',
        channel_id: 'voice_general',
        user_id: 'user123',
        timestamp: Date.now()
      }));

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(voiceUpdates.length).toBe(3);

      const joinEvent = JSON.parse(voiceUpdates[0]);
      expect(joinEvent.action).toBe('user_joined');
      expect(joinEvent.user_id).toBe('user123');

      const muteEvent = JSON.parse(voiceUpdates[1]);
      expect(muteEvent.action).toBe('user_muted');
      expect(muteEvent.muted).toBe(true);

      const leaveEvent = JSON.parse(voiceUpdates[2]);
      expect(leaveEvent.action).toBe('user_left');
    });
  });

  describe('Twitch Live Chat Pattern', () => {
    test('should handle high-frequency chat messages', async () => {
      const chatMessages: string[] = [];
      
      // Subscribe to Twitch stream chat
      await subscriber.subscribe('chat:stream:12345');
      
      subscriber.on('message', (channel: string, message: string) => {
        if (channel === 'chat:stream:12345') {
          chatMessages.push(message);
        }
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Simulate rapid chat messages (Twitch pattern)
      const messages = [
        { user: 'viewer1', text: 'First!', badges: ['subscriber'] },
        { user: 'viewer2', text: 'PogChamp', badges: [] },
        { user: 'moderator1', text: 'Welcome everyone!', badges: ['moderator'] },
        { user: 'viewer3', text: 'Amazing play!', badges: ['vip'] },
        { user: 'viewer4', text: 'Kappa', badges: [] }
      ];

      for (const msg of messages) {
        await publisher.publish('chat:stream:12345', JSON.stringify({
          username: msg.user,
          message: msg.text,
          badges: msg.badges,
          timestamp: Date.now(),
          color: '#FF0000',
          emotes: []
        }));
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      expect(chatMessages.length).toBe(5);

      // Verify message structure
      const firstMessage = JSON.parse(chatMessages[0]);
      expect(firstMessage.username).toBe('viewer1');
      expect(firstMessage.message).toBe('First!');
      expect(firstMessage.badges).toContain('subscriber');

      const modMessage = JSON.parse(chatMessages[2]);
      expect(modMessage.badges).toContain('moderator');
    });

    test('should handle stream event notifications', async () => {
      const streamEvents: string[] = [];
      
      // Subscribe to stream events
      await subscriber.subscribe('stream:events:12345');
      
      subscriber.on('message', (channel: string, message: string) => {
        if (channel === 'stream:events:12345') {
          streamEvents.push(message);
        }
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Stream goes live
      await publisher.publish('stream:events:12345', JSON.stringify({
        event: 'stream_online',
        streamer: 'pro_gamer',
        title: 'Speedrunning Portal 2!',
        game: 'Portal 2',
        viewers: 0,
        timestamp: Date.now()
      }));

      // New follower
      await publisher.publish('stream:events:12345', JSON.stringify({
        event: 'new_follower',
        follower: 'new_viewer123',
        total_followers: 1543,
        timestamp: Date.now()
      }));

      // Raid received
      await publisher.publish('stream:events:12345', JSON.stringify({
        event: 'raid_received',
        from_streamer: 'other_streamer',
        raiders: 250,
        timestamp: Date.now()
      }));

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(streamEvents.length).toBe(3);

      const liveEvent = JSON.parse(streamEvents[0]);
      expect(liveEvent.event).toBe('stream_online');
      expect(liveEvent.game).toBe('Portal 2');

      const followerEvent = JSON.parse(streamEvents[1]);
      expect(followerEvent.event).toBe('new_follower');
      expect(followerEvent.total_followers).toBe(1543);

      const raidEvent = JSON.parse(streamEvents[2]);
      expect(raidEvent.event).toBe('raid_received');
      expect(raidEvent.raiders).toBe(250);
    });
  });

  describe('GitHub Webhook Event Distribution', () => {
    test('should route repository events to subscribers', async () => {
      const webhookEvents: Array<{ channel: string; message: string }> = [];
      
      // Subscribe to GitHub webhook events by repository
      await subscriber.psubscribe('github:repo:*/push', 'github:repo:*/pull_request');
      
      subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
        webhookEvents.push({ channel, message });
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Push event
      await publisher.publish('github:repo:myorg/myproject/push', JSON.stringify({
        event: 'push',
        repository: 'myorg/myproject',
        pusher: 'developer1',
        commits: [
          {
            id: 'abc123',
            message: 'Fix authentication bug',
            author: 'developer1',
            timestamp: new Date().toISOString()
          }
        ],
        ref: 'refs/heads/main'
      }));

      // Pull request event
      await publisher.publish('github:repo:myorg/myproject/pull_request', JSON.stringify({
        event: 'pull_request',
        action: 'opened',
        repository: 'myorg/myproject',
        pull_request: {
          number: 42,
          title: 'Add new feature',
          user: 'contributor1',
          base: 'main',
          head: 'feature-branch'
        }
      }));

      // Different repo push (should also be received due to pattern)
      await publisher.publish('github:repo:otherorg/otherproject/push', JSON.stringify({
        event: 'push',
        repository: 'otherorg/otherproject',
        pusher: 'maintainer1',
        commits: [
          {
            id: 'def456',
            message: 'Update documentation',
            author: 'maintainer1'
          }
        ]
      }));

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(webhookEvents.length).toBeGreaterThanOrEqual(3);

      const pushEvent = webhookEvents.find(e => e.channel.includes('myorg/myproject/push'));
      expect(pushEvent).toBeDefined();
      
      const pushData = JSON.parse(pushEvent!.message);
      expect(pushData.event).toBe('push');
      expect(pushData.pusher).toBe('developer1');

      const prEvent = webhookEvents.find(e => e.channel.includes('pull_request'));
      expect(prEvent).toBeDefined();
      
      const prData = JSON.parse(prEvent!.message);
      expect(prData.event).toBe('pull_request');
      expect(prData.pull_request.number).toBe(42);
    });
  });

  describe('Trading Platform Real-Time Price Updates', () => {
    test('should broadcast market data to subscribers', async () => {
      const priceUpdates: Array<{ channel: string; message: string }> = [];
      
      // Subscribe to cryptocurrency price feeds
      await subscriber.psubscribe('market:crypto:*', 'market:forex:*');
      
      subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
        priceUpdates.push({ channel, message });
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Bitcoin price update
      await publisher.publish('market:crypto:BTC-USD', JSON.stringify({
        symbol: 'BTC-USD',
        price: 45230.50,
        change_24h: 2.34,
        volume_24h: 28500000000,
        timestamp: Date.now(),
        exchange: 'binance'
      }));

      // Ethereum price update
      await publisher.publish('market:crypto:ETH-USD', JSON.stringify({
        symbol: 'ETH-USD',
        price: 3125.75,
        change_24h: -1.23,
        volume_24h: 15200000000,
        timestamp: Date.now(),
        exchange: 'coinbase'
      }));

      // Forex update
      await publisher.publish('market:forex:EUR-USD', JSON.stringify({
        symbol: 'EUR-USD',
        bid: 1.0842,
        ask: 1.0844,
        spread: 0.0002,
        timestamp: Date.now(),
        provider: 'reuters'
      }));

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(priceUpdates.length).toBe(3);

      const btcUpdate = priceUpdates.find(u => u.channel.includes('BTC-USD'));
      expect(btcUpdate).toBeDefined();
      
      const btcData = JSON.parse(btcUpdate!.message);
      expect(btcData.symbol).toBe('BTC-USD');
      expect(btcData.price).toBe(45230.50);

      const forexUpdate = priceUpdates.find(u => u.channel.includes('EUR-USD'));
      expect(forexUpdate).toBeDefined();
      
      const forexData = JSON.parse(forexUpdate!.message);
      expect(forexData.bid).toBe(1.0842);
      expect(forexData.ask).toBe(1.0844);
    });

    test('should handle trading alerts and notifications', async () => {
      const alerts: string[] = [];
      
      // Subscribe to trading alerts
      await subscriber.subscribe('alerts:price:BTC-USD', 'alerts:volume:high');
      
      subscriber.on('message', (channel: string, message: string) => {
        alerts.push(message);
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Price alert triggered
      await publisher.publish('alerts:price:BTC-USD', JSON.stringify({
        type: 'price_alert',
        symbol: 'BTC-USD',
        condition: 'above',
        threshold: 45000,
        current_price: 45230.50,
        user_id: 'trader123',
        timestamp: Date.now()
      }));

      // Volume spike alert
      await publisher.publish('alerts:volume:high', JSON.stringify({
        type: 'volume_alert',
        symbol: 'ETH-USD',
        volume_threshold: 10000000000,
        current_volume: 15200000000,
        spike_percentage: 52,
        timestamp: Date.now()
      }));

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(alerts.length).toBe(2);

      const priceAlert = JSON.parse(alerts[0]);
      expect(priceAlert.type).toBe('price_alert');
      expect(priceAlert.current_price).toBe(45230.50);
      expect(priceAlert.condition).toBe('above');

      const volumeAlert = JSON.parse(alerts[1]);
      expect(volumeAlert.type).toBe('volume_alert');
      expect(volumeAlert.spike_percentage).toBe(52);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle subscription to non-existent channels', async () => {
      const messages: string[] = [];
      
      // Subscribe to channels that may not receive messages
      await subscriber.subscribe('empty:channel:1', 'empty:channel:2');
      
      subscriber.on('message', (channel: string, message: string) => {
        messages.push(message);
      });

      // Wait without sending any messages
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should not have received any messages
      expect(messages).toHaveLength(0);

      // Now send a message to verify subscription works
      await publisher.publish('empty:channel:1', 'test message');
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(messages).toHaveLength(1);
      expect(messages[0]).toBe('test message');
    });

    test('should handle pattern subscription with no matches', async () => {
      const patternMessages: Array<{ pattern: string; channel: string; message: string }> = [];
      
      // Subscribe to pattern that won't match published channels
      await subscriber.psubscribe('nomatch:*:test');
      
      subscriber.on('pmessage', (pattern: string, channel: string, message: string) => {
        patternMessages.push({ pattern, channel, message });
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Publish to channels that don't match the pattern
      await publisher.publish('different:channel', 'message1');
      await publisher.publish('another:format:channel', 'message2');

      await new Promise(resolve => setTimeout(resolve, 200));

      // Should not receive any messages
      expect(patternMessages).toHaveLength(0);

      // Now publish to matching channel
      await publisher.publish('nomatch:something:test', 'matching message');
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(patternMessages).toHaveLength(1);
      expect(patternMessages[0].message).toBe('matching message');
    });

    test('should handle unsubscribe operations', async () => {
      const messages: string[] = [];
      
      await subscriber.subscribe('test:unsubscribe:1', 'test:unsubscribe:2');
      
      subscriber.on('message', (channel: string, message: string) => {
        messages.push(`${channel}:${message}`);
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Send initial messages
      await publisher.publish('test:unsubscribe:1', 'msg1');
      await publisher.publish('test:unsubscribe:2', 'msg2');

      await new Promise(resolve => setTimeout(resolve, 100));
      expect(messages).toHaveLength(2);

      // Unsubscribe from one channel
      await subscriber.unsubscribe('test:unsubscribe:1');
      
      await new Promise(resolve => setTimeout(resolve, 100));

      // Send more messages
      await publisher.publish('test:unsubscribe:1', 'msg3'); // Should not receive
      await publisher.publish('test:unsubscribe:2', 'msg4'); // Should receive

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should only have received 3 messages (not the 4th from unsubscribed channel)
      expect(messages).toHaveLength(3);
      expect(messages).toContain('test:unsubscribe:2:msg4');
      expect(messages).not.toContain('test:unsubscribe:1:msg3');
    });

    test('should handle large message payloads', async () => {
      const largeMessages: string[] = [];
      
      await subscriber.subscribe('large:message:test');
      
      subscriber.on('message', (channel: string, message: string) => {
        largeMessages.push(message);
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Create a large message (1KB)
      const largePayload = JSON.stringify({
        data: 'x'.repeat(1000),
        timestamp: Date.now(),
        metadata: {
          size: '1KB',
          type: 'large_payload_test'
        }
      });

      await publisher.publish('large:message:test', largePayload);
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(largeMessages).toHaveLength(1);
      
      const received = JSON.parse(largeMessages[0]);
      expect(received.data.length).toBe(1000);
      expect(received.metadata.type).toBe('large_payload_test');
    });
  });
});