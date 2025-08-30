/**
 * Key Management Test Suite  
 * Tests for TTL, persistence, key operations, and expiration patterns
 *
 * Based on real-world patterns from:
 * - Spotify's session key management
 * - Uber's cache TTL strategies
 * - Amazon's key rotation patterns
 * - Netflix's auto-expiring data
 * - Discord's temporary data cleanup
 */

import { RedisAdapter } from '../../src/adapters/RedisAdapter';
import { RedisOptions } from '../../src/types';

describe('Key Management - TTL & Persistence Patterns', () => {
  let redis: RedisAdapter;

  beforeEach(async () => {
    const config: RedisOptions = {
      host: 'localhost',
      port: 6379,
      lazyConnect: true
    };
    redis = new RedisAdapter(config);
  });

  afterEach(async () => {
    if (redis) {
      await redis.quit();
    }
  });

  describe('Session Management Patterns', () => {
    test('should handle user session TTL like Spotify', async () => {
      const sessionKey = 'session:user:' + Math.random();
      const sessionData = JSON.stringify({
        userId: '12345',
        loginTime: Date.now(),
        permissions: ['read', 'write'],
        preferences: { theme: 'dark', language: 'en' }
      });
      
      // Set session with 30-minute TTL
      await redis.setex(sessionKey, 1800, sessionData);
      
      // Verify TTL is set
      const ttl = await redis.ttl(sessionKey);
      expect(ttl).toBeGreaterThan(1790);
      expect(ttl).toBeLessThanOrEqual(1800);
      
      // Verify session data
      const retrievedData = await redis.get(sessionKey);
      expect(retrievedData).toBe(sessionData);
      
      // Extend session TTL (user activity)
      await redis.expire(sessionKey, 3600);
      
      const newTtl = await redis.ttl(sessionKey);
      expect(newTtl).toBeGreaterThan(3590);
    });

    test('should implement rolling session expiration', async () => {
      const sessionKey = 'rolling:session:' + Math.random();
      
      await redis.setex(sessionKey, 900, 'session_data'); // 15 minutes
      
      // Simulate user activity - refresh TTL
      await new Promise(resolve => setTimeout(resolve, 100));
      await redis.expire(sessionKey, 900); // Reset to 15 minutes
      
      const ttl = await redis.ttl(sessionKey);
      expect(ttl).toBeGreaterThan(890);
    });

    test('should handle session cleanup on logout', async () => {
      const sessionKey = 'logout:session:' + Math.random();
      
      // Create session
      await redis.setex(sessionKey, 3600, 'active_session');
      expect(await redis.exists(sessionKey)).toBe(1);
      
      // Logout - remove session immediately
      await redis.del(sessionKey);
      expect(await redis.exists(sessionKey)).toBe(0);
      
      // TTL should return -2 (key doesn't exist)
      const ttl = await redis.ttl(sessionKey);
      expect(ttl).toBe(-2);
    });
  });

  describe('Cache TTL Strategies', () => {
    test('should implement cache warming with TTL like Uber', async () => {
      const cacheKey = 'cache:route:' + Math.random();
      
      // Warm cache with long TTL for popular route
      const routeData = JSON.stringify({
        route: 'downtown-airport',
        estimatedTime: 25,
        trafficFactor: 1.2,
        cachedAt: Date.now()
      });
      
      await redis.setex(cacheKey, 3600, routeData); // 1 hour cache
      
      // Verify cache hit
      const cached = await redis.get(cacheKey);
      expect(cached).toBe(routeData);
      
      // Check remaining TTL
      const ttl = await redis.ttl(cacheKey);
      expect(ttl).toBeLessThanOrEqual(3600);
      expect(ttl).toBeGreaterThan(3500);
    });

    test('should implement staggered cache expiration', async () => {
      const baseKey = 'staggered:cache:' + Math.random();
      
      // Create multiple cache entries with different TTLs
      await redis.setex(`${baseKey}:priority:high`, 300, 'high_priority_data'); // 5 min
      await redis.setex(`${baseKey}:priority:medium`, 600, 'medium_priority_data'); // 10 min
      await redis.setex(`${baseKey}:priority:low`, 1200, 'low_priority_data'); // 20 min
      
      // Verify all exist
      expect(await redis.exists(`${baseKey}:priority:high`)).toBe(1);
      expect(await redis.exists(`${baseKey}:priority:medium`)).toBe(1);
      expect(await redis.exists(`${baseKey}:priority:low`)).toBe(1);
      
      // Check TTLs are different
      const ttlHigh = await redis.ttl(`${baseKey}:priority:high`);
      const ttlMedium = await redis.ttl(`${baseKey}:priority:medium`);
      const ttlLow = await redis.ttl(`${baseKey}:priority:low`);
      
      expect(ttlHigh).toBeLessThan(ttlMedium);
      expect(ttlMedium).toBeLessThan(ttlLow);
    });

    test('should handle cache refresh patterns', async () => {
      const cacheKey = 'refresh:cache:' + Math.random();
      
      // Set initial cache
      await redis.setex(cacheKey, 60, 'initial_data');
      
      // Refresh cache with new data and extended TTL
      await redis.setex(cacheKey, 120, 'refreshed_data');
      
      const data = await redis.get(cacheKey);
      expect(data).toBe('refreshed_data');
      
      const ttl = await redis.ttl(cacheKey);
      expect(ttl).toBeGreaterThan(110);
    });
  });

  describe('Temporary Data Management', () => {
    test('should handle rate limiting windows like Amazon', async () => {
      const rateLimitKey = 'rate:limit:' + Math.random();
      
      // Set rate limit counter with window expiration
      await redis.setex(rateLimitKey, 3600, '1'); // 1 request in 1 hour window
      
      // Increment counter (new request)
      const currentCount = await redis.incr(rateLimitKey);
      expect(currentCount).toBe(2);
      
      // TTL should still be maintained after increment
      const ttl = await redis.ttl(rateLimitKey);
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(3600);
    });

    test('should implement OTP expiration like Netflix', async () => {
      const otpKey = 'otp:' + Math.random();
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // OTP expires in 5 minutes
      await redis.setex(otpKey, 300, otpCode);
      
      // Verify OTP exists and is correct
      const storedOtp = await redis.get(otpKey);
      expect(storedOtp).toBe(otpCode);
      
      // Check TTL
      const ttl = await redis.ttl(otpKey);
      expect(ttl).toBeLessThanOrEqual(300);
      expect(ttl).toBeGreaterThan(290);
      
      // Consume OTP (delete after use)
      await redis.del(otpKey);
      expect(await redis.get(otpKey)).toBeNull();
    });

    test('should handle temporary upload tokens', async () => {
      const tokenKey = 'upload:token:' + Math.random();
      const tokenData = JSON.stringify({
        uploadId: 'upload_123',
        maxSize: 10485760, // 10MB
        allowedTypes: ['image/jpeg', 'image/png'],
        createdAt: Date.now()
      });
      
      // Upload token expires in 15 minutes
      await redis.setex(tokenKey, 900, tokenData);
      
      // Verify token
      const token = await redis.get(tokenKey);
      expect(token).toBe(tokenData);
      
      // Remove token after use
      await redis.del(tokenKey);
      expect(await redis.exists(tokenKey)).toBe(0);
    });
  });

  describe('Key Persistence Patterns', () => {
    test('should handle persistent data without TTL', async () => {
      const configKey = 'config:app:' + Math.random();
      const configData = JSON.stringify({
        appName: 'MyApp',
        version: '1.0.0',
        features: { analytics: true, notifications: true }
      });
      
      // Set without TTL (persistent)
      await redis.set(configKey, configData);
      
      // TTL should be -1 (no expiration)
      const ttl = await redis.ttl(configKey);
      expect(ttl).toBe(-1);
      
      // Data should persist
      const data = await redis.get(configKey);
      expect(data).toBe(configData);
    });

    test('should convert expiring key to persistent', async () => {
      const dataKey = 'convert:persistent:' + Math.random();
      
      // Initially set with TTL
      await redis.setex(dataKey, 3600, 'temporary_data');
      
      let ttl = await redis.ttl(dataKey);
      expect(ttl).toBeGreaterThan(0);
      
      // Make it persistent
      await redis.persist(dataKey);
      
      ttl = await redis.ttl(dataKey);
      expect(ttl).toBe(-1); // No expiration
      
      const data = await redis.get(dataKey);
      expect(data).toBe('temporary_data');
    });

    test('should handle key backup and restore patterns', async () => {
      const primaryKey = 'primary:data:' + Math.random();
      const backupKey = 'backup:data:' + Math.random();
      
      const importantData = JSON.stringify({
        userId: '54321',
        criticalInfo: 'important_business_data',
        timestamp: Date.now()
      });
      
      // Store in primary location (with TTL)
      await redis.setex(primaryKey, 7200, importantData);
      
      // Create backup (persistent)
      await redis.set(backupKey, importantData);
      
      // Primary should have TTL, backup should not
      expect(await redis.ttl(primaryKey)).toBeGreaterThan(0);
      expect(await redis.ttl(backupKey)).toBe(-1);
      
      // Both should have same data
      expect(await redis.get(primaryKey)).toBe(importantData);
      expect(await redis.get(backupKey)).toBe(importantData);
    });
  });

  describe('Key Type and Metadata Operations', () => {
    test('should identify key types for cleanup strategies', async () => {
      const baseKey = 'type:test:' + Math.random();
      
      // Create different data types
      await redis.set(`${baseKey}:string`, 'string_value');
      await redis.hset(`${baseKey}:hash`, 'field', 'value');
      await redis.sadd(`${baseKey}:set`, 'member1', 'member2');
      await redis.zadd(`${baseKey}:zset`, 1, 'member1');
      await redis.lpush(`${baseKey}:list`, 'item1');
      
      // Check types
      expect(await redis.type(`${baseKey}:string`)).toBe('string');
      expect(await redis.type(`${baseKey}:hash`)).toBe('hash');
      expect(await redis.type(`${baseKey}:set`)).toBe('set');
      expect(await redis.type(`${baseKey}:zset`)).toBe('zset');
      expect(await redis.type(`${baseKey}:list`)).toBe('list');
      expect(await redis.type(`${baseKey}:nonexistent`)).toBe('none');
    });

    test('should handle bulk key operations', async () => {
      const keyPrefix = 'bulk:' + Math.random();
      const keys = [
        `${keyPrefix}:key1`,
        `${keyPrefix}:key2`, 
        `${keyPrefix}:key3`,
        `${keyPrefix}:key4`
      ];
      
      // Create multiple keys
      for (let i = 0; i < keys.length; i++) {
        await redis.set(keys[i]!, `value_${i}`);
      }
      
      // Check all exist
      const existsCount = await redis.exists(...keys);
      expect(existsCount).toBe(keys.length);
      
      // Delete multiple keys
      const deletedCount = await redis.del(...keys);
      expect(deletedCount).toBe(keys.length);
      
      // Verify all deleted
      expect(await redis.exists(...keys)).toBe(0);
    });

    test('should handle key pattern matching for maintenance', async () => {
      const prefix = 'pattern:' + Math.random();
      
      // Create keys with pattern
      await redis.set(`${prefix}:user:123`, 'user_data');
      await redis.set(`${prefix}:user:456`, 'user_data');
      await redis.set(`${prefix}:session:abc`, 'session_data');
      await redis.set(`${prefix}:session:def`, 'session_data');
      await redis.set(`${prefix}:other:xyz`, 'other_data');
      
      // Find keys by pattern  
      const userKeys = await redis.keys(`${prefix}:user:*`);
      expect(userKeys).toHaveLength(2);
      expect(userKeys.every(key => key.includes('user'))).toBe(true);
      
      const sessionKeys = await redis.keys(`${prefix}:session:*`);
      expect(sessionKeys).toHaveLength(2);
      expect(sessionKeys.every(key => key.includes('session'))).toBe(true);
    });
  });

  describe('Expiration Event Simulation', () => {
    test('should handle near-expiration scenarios', async () => {
      const shortKey = 'short:lived:' + Math.random();
      
      // Set very short TTL
      await redis.setex(shortKey, 2, 'short_lived_data');
      
      // Verify exists initially
      expect(await redis.exists(shortKey)).toBe(1);
      expect(await redis.ttl(shortKey)).toBeLessThanOrEqual(2);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Should be expired
      expect(await redis.exists(shortKey)).toBe(0);
      expect(await redis.ttl(shortKey)).toBe(-2);
      expect(await redis.get(shortKey)).toBeNull();
    });

    test('should handle TTL updates and cancellations', async () => {
      const mutableKey = 'mutable:ttl:' + Math.random();
      
      // Set with initial TTL
      await redis.setex(mutableKey, 300, 'mutable_data');
      expect(await redis.ttl(mutableKey)).toBeLessThanOrEqual(300);
      
      // Update TTL to longer duration
      await redis.expire(mutableKey, 600);
      expect(await redis.ttl(mutableKey)).toBeGreaterThan(500);
      
      // Cancel expiration (make persistent)
      await redis.persist(mutableKey);
      expect(await redis.ttl(mutableKey)).toBe(-1);
      
      // Data should still be there
      expect(await redis.get(mutableKey)).toBe('mutable_data');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle TTL operations on non-existent keys', async () => {
      const nonExistentKey = 'nonexistent:' + Math.random();
      
      // TTL on non-existent key should return -2
      expect(await redis.ttl(nonExistentKey)).toBe(-2);
      
      // EXPIRE on non-existent key should return 0
      const expireResult = await redis.expire(nonExistentKey, 300);
      expect(expireResult).toBe(0);
      
      // PERSIST on non-existent key should return 0
      const persistResult = await redis.persist(nonExistentKey);
      expect(persistResult).toBe(0);
    });

    test('should handle invalid TTL values gracefully', async () => {
      const testKey = 'ttl:test:' + Math.random();
      await redis.set(testKey, 'test_value');
      
      // Zero TTL should expire immediately
      await redis.expire(testKey, 0);
      
      // Key should be expired/deleted  
      expect(await redis.exists(testKey)).toBe(0);
    });

    test('should handle type operations on various data structures', async () => {
      const baseKey = 'type:edge:' + Math.random();
      
      // Test TYPE on fresh key (should be 'none')
      expect(await redis.type(`${baseKey}:fresh`)).toBe('none');
      
      // Create and delete key, then check type
      await redis.set(`${baseKey}:temp`, 'temp');
      await redis.del(`${baseKey}:temp`);
      expect(await redis.type(`${baseKey}:temp`)).toBe('none');
    });

    test('should handle concurrent TTL operations', async () => {
      const concurrentKey = 'concurrent:ttl:' + Math.random();
      
      await redis.setex(concurrentKey, 3600, 'concurrent_data');
      
      // Multiple TTL checks should be consistent
      const ttl1 = await redis.ttl(concurrentKey);
      const ttl2 = await redis.ttl(concurrentKey);
      
      // TTL values should be close (within a few seconds)
      expect(Math.abs(ttl1 - ttl2)).toBeLessThan(5);
      expect(ttl1).toBeGreaterThan(3500);
      expect(ttl2).toBeGreaterThan(3500);
    });
  });
});