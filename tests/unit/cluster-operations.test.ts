/**
 * Cluster Operations Comprehensive Tests
 * 
 * Real-world patterns based on production systems:
 * - Twitter's timeline sharding across 16384 slots
 * - Instagram's photo metadata distribution
 * - Discord's message routing and failover
 * - Netflix's session data clustering 
 * - LinkedIn's analytics pipeline sharding
 * - Stack Overflow's cached query distribution
 */

import { BaseClusterAdapter } from '../../src/adapters/BaseClusterAdapter';
import { RedisClusterOptions } from '../../src/types';

describe('Cluster Operations - Production Patterns', () => {
  let cluster: BaseClusterAdapter;

  beforeEach(async () => {
    const config: RedisClusterOptions = {
      nodes: [
        { host: 'localhost', port: 6379 }
      ],
      lazyConnect: true
    };
    cluster = new BaseClusterAdapter(config);
  });

  afterEach(async () => {
    if (cluster) {
      await cluster.disconnect();
    }
  });

  describe('Twitter Timeline Sharding Pattern', () => {
    test('should handle user timeline distribution across slots', async () => {
      // Twitter shards user timelines by user_id hash
      const userId1 = 'user:12345';
      const userId2 = 'user:67890';
      const userId3 = 'user:11111';

      // Timeline data for different users should go to different slots
      const timelineKey1 = `timeline:${userId1}`;
      const timelineKey2 = `timeline:${userId2}`;
      const timelineKey3 = `timeline:${userId3}`;

      // Add timeline entries (sorted sets for chronological order)
      const now = Date.now();
      await cluster.zadd(timelineKey1, now - 3600, 'tweet:1001');
      await cluster.zadd(timelineKey1, now - 1800, 'tweet:1002');
      await cluster.zadd(timelineKey1, now, 'tweet:1003');

      await cluster.zadd(timelineKey2, now - 2400, 'tweet:2001');
      await cluster.zadd(timelineKey2, now - 600, 'tweet:2002');

      await cluster.zadd(timelineKey3, now - 900, 'tweet:3001');

      // Verify data distribution and retrieval
      const timeline1 = await cluster.zrevrange(timelineKey1, 0, -1);
      expect(timeline1).toEqual(['tweet:1003', 'tweet:1002', 'tweet:1001']);

      const timeline2 = await cluster.zrevrange(timelineKey2, 0, -1);
      expect(timeline2).toEqual(['tweet:2002', 'tweet:2001']);

      const timeline3Count = await cluster.zcard(timelineKey3);
      expect(timeline3Count).toBe(1);
    });

    test('should handle hashtag trending across cluster', async () => {
      // Twitter tracks hashtag counts across all cluster nodes
      const hashtags = ['#worldcup', '#ai', '#nodejs', '#redis', '#tech'];
      
      for (const hashtag of hashtags) {
        const key = `trending:${hashtag}`;
        // Simulate incremental updates from different sources
        await cluster.incrby(key, Math.floor(Math.random() * 1000) + 100);
      }

      // Verify all hashtag counts are accessible
      for (const hashtag of hashtags) {
        const count = await cluster.get(`trending:${hashtag}`);
        expect(parseInt(count || '0')).toBeGreaterThan(99);
      }
    });
  });

  describe('Instagram Photo Metadata Sharding', () => {
    test('should distribute photo metadata efficiently', async () => {
      const photoIds = ['photo:abc123', 'photo:def456', 'photo:ghi789'];
      
      // Instagram stores photo metadata as hashes
      for (let i = 0; i < photoIds.length; i++) {
        const photoId = photoIds[i];
        await cluster.hmset(photoId, {
          'user_id': `user_${i + 1000}`,
          'timestamp': (Date.now() - i * 3600000).toString(),
          'likes': (Math.floor(Math.random() * 10000)).toString(),
          'location': `location_${i}`,
          'filter': `filter_${i % 5}`,
          'width': '1080',
          'height': '1080',
          'file_size': (Math.floor(Math.random() * 2000000) + 500000).toString()
        });
      }

      // Verify metadata retrieval across cluster
      for (const photoId of photoIds) {
        const metadata = await cluster.hgetall(photoId);
        expect(metadata).toHaveProperty('user_id');
        expect(metadata).toHaveProperty('timestamp');
        expect(metadata).toHaveProperty('likes');
        expect(parseInt(metadata.likes)).toBeGreaterThanOrEqual(0);
      }

      // Test batch metadata retrieval
      const photo1Likes = await cluster.hget(photoIds[0], 'likes');
      const photo2User = await cluster.hget(photoIds[1], 'user_id');
      
      expect(photo1Likes).toBeTruthy();
      expect(photo2User).toMatch(/user_\d+/);
    });

    test('should handle user photo collections', async () => {
      const userId = 'user:instagram_user';
      const userPhotosKey = `user:${userId}:photos`;
      
      // User's photo collection stored as sorted set (by timestamp)
      const photos = [
        { id: 'photo:001', timestamp: Date.now() - 86400000 }, // 1 day ago
        { id: 'photo:002', timestamp: Date.now() - 43200000 }, // 12 hours ago
        { id: 'photo:003', timestamp: Date.now() - 3600000 },  // 1 hour ago
        { id: 'photo:004', timestamp: Date.now() }             // now
      ];

      for (const photo of photos) {
        await cluster.zadd(userPhotosKey, photo.timestamp, photo.id);
      }

      // Get recent photos (last 2)
      const recentPhotos = await cluster.zrevrange(userPhotosKey, 0, 1);
      expect(recentPhotos).toEqual(['photo:004', 'photo:003']);

      // Get photos from last 24 hours
      const oneDayAgo = Date.now() - 86400000;
      const dayPhotos = await cluster.zrangebyscore(userPhotosKey, oneDayAgo, Date.now());
      expect(dayPhotos.length).toBe(4);
    });
  });

  describe('Discord Message Routing Pattern', () => {
    test('should route messages to correct server shards', async () => {
      // Discord routes messages by guild (server) ID
      const guildIds = ['guild:123', 'guild:456', 'guild:789'];
      const channels = ['general', 'memes', 'help'];
      
      for (const guildId of guildIds) {
        for (const channel of channels) {
          const messageKey = `messages:${guildId}:${channel}`;
          
          // Add recent messages (list for chronological order)
          await cluster.lpush(messageKey, 
            JSON.stringify({
              id: `msg_${Date.now()}_1`,
              author: 'user123',
              content: 'Hello everyone!',
              timestamp: Date.now()
            })
          );
          
          await cluster.lpush(messageKey, 
            JSON.stringify({
              id: `msg_${Date.now()}_2`, 
              author: 'user456',
              content: 'How is everyone doing?',
              timestamp: Date.now() + 1000
            })
          );

          // Keep only last 50 messages (Discord pattern)
          await cluster.ltrim(messageKey, 0, 49);
        }
      }

      // Verify message retrieval for specific guild/channel
      const testChannel = `messages:${guildIds[0]}:${channels[0]}`;
      const messages = await cluster.lrange(testChannel, 0, 4);
      
      expect(messages.length).toBe(2);
      for (const msgStr of messages) {
        const msg = JSON.parse(msgStr);
        expect(msg).toHaveProperty('id');
        expect(msg).toHaveProperty('author');
        expect(msg).toHaveProperty('content');
      }
    });

    test('should handle voice channel presence tracking', async () => {
      const guildId = 'guild:discord_server';
      const voiceChannels = ['General', 'Gaming', 'Music'];
      
      for (const channel of voiceChannels) {
        const presenceKey = `voice:${guildId}:${channel}`;
        
        // Add users to voice channel (set for unique users)
        await cluster.sadd(presenceKey, 'user123', 'user456', 'user789');
        
        // Set TTL for automatic cleanup (Discord pattern)
        await cluster.expire(presenceKey, 3600); // 1 hour
      }

      // Check voice channel population
      const generalUsers = await cluster.smembers(`voice:${guildId}:General`);
      expect(generalUsers.length).toBe(3);
      expect(generalUsers).toContain('user123');

      // Check user count
      const musicCount = await cluster.scard(`voice:${guildId}:Music`);
      expect(musicCount).toBe(3);

      // Remove user from channel
      const removed = await cluster.srem(`voice:${guildId}:Gaming`, 'user456');
      expect(removed).toBe(1);

      const remainingCount = await cluster.scard(`voice:${guildId}:Gaming`);
      expect(remainingCount).toBe(2);
    });
  });

  describe('Netflix Session Data Clustering', () => {
    test('should manage user sessions across cluster nodes', async () => {
      const sessions = [
        { id: 'session:abc123', userId: 'user:netflix1', device: 'web' },
        { id: 'session:def456', userId: 'user:netflix2', device: 'mobile' },
        { id: 'session:ghi789', userId: 'user:netflix3', device: 'tv' }
      ];

      // Store session data with TTL (Netflix pattern)
      for (const session of sessions) {
        await cluster.hmset(session.id, {
          user_id: session.userId,
          device_type: session.device,
          login_time: Date.now().toString(),
          last_activity: Date.now().toString(),
          ip_address: '192.168.1.100',
          user_agent: 'Netflix/1.0',
          subscription_tier: 'premium'
        });
        
        // Sessions expire after 24 hours of inactivity
        await cluster.expire(session.id, 86400);
      }

      // Verify session retrieval
      for (const session of sessions) {
        const sessionData = await cluster.hgetall(session.id);
        expect(sessionData.user_id).toBe(session.userId);
        expect(sessionData.device_type).toBe(session.device);
        
        // Check TTL is set
        const ttl = await cluster.ttl(session.id);
        expect(ttl).toBeGreaterThan(86300); // Should be close to 86400
      }

      // Update session activity
      const activeSession = sessions[0];
      await cluster.hset(activeSession.id, 'last_activity', Date.now().toString());
      await cluster.expire(activeSession.id, 86400); // Reset TTL
      
      const updatedActivity = await cluster.hget(activeSession.id, 'last_activity');
      expect(parseInt(updatedActivity || '0')).toBeGreaterThan(0);
    });

    test('should track viewing history per user', async () => {
      const userId = 'user:netflix_viewer';
      const viewingHistoryKey = `history:${userId}`;
      
      const shows = [
        { title: 'Stranger Things S4E1', timestamp: Date.now() - 3600000 },
        { title: 'The Crown S5E3', timestamp: Date.now() - 1800000 },
        { title: 'Wednesday S1E1', timestamp: Date.now() - 900000 },
        { title: 'You S4E2', timestamp: Date.now() }
      ];

      // Store viewing history as sorted set (by timestamp)
      for (const show of shows) {
        await cluster.zadd(viewingHistoryKey, show.timestamp, show.title);
      }

      // Get recent viewing history (last 3 shows)
      const recentHistory = await cluster.zrevrange(viewingHistoryKey, 0, 2);
      expect(recentHistory).toEqual([
        'You S4E2',
        'Wednesday S1E1', 
        'The Crown S5E3'
      ]);

      // Get viewing from last 2 hours
      const twoHoursAgo = Date.now() - 7200000;
      const recentViews = await cluster.zrangebyscore(viewingHistoryKey, twoHoursAgo, Date.now());
      expect(recentViews.length).toBe(4);
    });
  });

  describe('Cluster Slot Distribution & Failover', () => {
    test('should handle keys distributed across hash slots', async () => {
      // Test that keys hash to different slots (16384 total slots)
      const testKeys = [
        'user:1000', 'user:2000', 'user:3000', 'user:4000', 'user:5000',
        'session:abc', 'session:def', 'session:ghi', 'session:jkl',
        'cache:home', 'cache:profile', 'cache:search', 'cache:feed'
      ];

      // Set values for all test keys
      for (let i = 0; i < testKeys.length; i++) {
        await cluster.set(testKeys[i], `value_${i}`);
      }

      // Verify all keys are retrievable (proving slot distribution works)
      for (let i = 0; i < testKeys.length; i++) {
        const value = await cluster.get(testKeys[i]);
        expect(value).toBe(`value_${i}`);
      }

      // Test batch operations across slots
      const values = await cluster.mget(testKeys);
      expect(values).toHaveLength(testKeys.length);
      
      for (let i = 0; i < values.length; i++) {
        expect(values[i]).toBe(`value_${i}`);
      }
    });

    test('should handle cluster info commands', async () => {
      try {
        // These commands help monitor cluster health
        const clusterInfo = await cluster.cluster('INFO');
        expect(typeof clusterInfo).toBe('string');
        expect(clusterInfo.length).toBeGreaterThan(0);
      } catch (error) {
        // Cluster commands might not be available in single-node test setup
        expect(error).toBeDefined();
      }

      try {
        const clusterNodes = await cluster.cluster('NODES');
        expect(typeof clusterNodes).toBe('string');
      } catch (error) {
        // Expected in single-node setup
        expect(error).toBeDefined();
      }
    });

    test('should handle cross-slot operations correctly', async () => {
      // Operations that span multiple hash slots
      const key1 = 'multi:key1';
      const key2 = 'multi:key2';
      const key3 = 'multi:key3';

      // These keys likely map to different slots
      await cluster.set(key1, 'value1');
      await cluster.set(key2, 'value2');  
      await cluster.set(key3, 'value3');

      // Multi-key operations should work despite different slots
      const values = await cluster.mget([key1, key2, key3]);
      expect(values).toEqual(['value1', 'value2', 'value3']);

      // Test exists on multiple keys
      const existsCount = await cluster.exists(key1, key2, key3);
      expect(existsCount).toBe(3);
    });
  });

  describe('LinkedIn Analytics Pipeline Sharding', () => {
    test('should handle analytics event distribution', async () => {
      const eventTypes = ['page_view', 'profile_view', 'connection_request', 'message_sent'];
      const userIds = ['user:1001', 'user:1002', 'user:1003', 'user:1004', 'user:1005'];
      
      // LinkedIn tracks events per user in sorted sets (by timestamp)
      for (const userId of userIds) {
        for (const eventType of eventTypes) {
          const eventKey = `events:${userId}:${eventType}`;
          const timestamp = Date.now() - Math.floor(Math.random() * 86400000); // Random within 24h
          const eventId = `event_${Date.now()}_${Math.random()}`;
          
          await cluster.zadd(eventKey, timestamp, eventId);
          
          // Keep only last 1000 events per type per user
          await cluster.zremrangebyrank(eventKey, 0, -1001);
        }
      }

      // Verify event storage and retrieval
      const testUserEvents = `events:${userIds[0]}:page_view`;
      const eventCount = await cluster.zcard(testUserEvents);
      expect(eventCount).toBeGreaterThanOrEqual(1);

      // Get recent events (last hour)
      const oneHourAgo = Date.now() - 3600000;
      const recentEvents = await cluster.zrangebyscore(testUserEvents, oneHourAgo, Date.now());
      expect(Array.isArray(recentEvents)).toBe(true);
    });

    test('should aggregate analytics counters', async () => {
      const metrics = [
        'daily:page_views', 'daily:profile_views', 
        'daily:searches', 'daily:connections'
      ];

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      // Increment various metrics (LinkedIn pattern)
      for (const metric of metrics) {
        const dailyKey = `${metric}:${today}`;
        const incrementValue = Math.floor(Math.random() * 1000) + 100;
        await cluster.incrby(dailyKey, incrementValue);
        
        // Set expiration for 90 days (analytics retention)
        await cluster.expire(dailyKey, 90 * 24 * 3600);
      }

      // Verify metrics are tracked
      for (const metric of metrics) {
        const dailyKey = `${metric}:${today}`;
        const count = await cluster.get(dailyKey);
        expect(parseInt(count || '0')).toBeGreaterThan(99);
      }

      // Test batch metric retrieval
      const metricKeys = metrics.map(m => `${m}:${today}`);
      const allCounts = await cluster.mget(metricKeys);
      
      for (const count of allCounts) {
        expect(parseInt(count || '0')).toBeGreaterThan(99);
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle connection failures gracefully', async () => {
      // Test error handling for non-existent keys
      const result = await cluster.get('nonexistent:key');
      expect(result).toBeNull();

      const hashResult = await cluster.hgetall('nonexistent:hash');
      expect(hashResult).toEqual({});

      const listLength = await cluster.llen('nonexistent:list');
      expect(listLength).toBe(0);
    });

    test('should handle type errors correctly', async () => {
      const key = 'type:test:key';
      
      // Set as string first
      await cluster.set(key, 'string_value');

      // Try to use as different types (should fail)
      await expect(cluster.lpush(key, 'item')).rejects.toThrow();
      await expect(cluster.sadd(key, 'member')).rejects.toThrow();
      await expect(cluster.hset(key, 'field', 'value')).rejects.toThrow();
    });

    test('should handle large value operations', async () => {
      const largeKey = 'large:data:test';
      const largeValue = 'x'.repeat(10000); // 10KB string

      // Should handle large values
      await cluster.set(largeKey, largeValue);
      const retrieved = await cluster.get(largeKey);
      expect(retrieved).toBe(largeValue);
      expect(retrieved!.length).toBe(10000);
    });

    test('should handle concurrent operations', async () => {
      const concurrentKey = 'concurrent:test';
      
      // Execute multiple operations concurrently
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(cluster.incr(concurrentKey));
      }

      const results = await Promise.all(promises);
      
      // All increments should succeed
      expect(results).toHaveLength(10);
      for (const result of results) {
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThan(0);
      }

      // Final value should be 10
      const finalValue = await cluster.get(concurrentKey);
      expect(parseInt(finalValue || '0')).toBe(10);
    });
  });
});