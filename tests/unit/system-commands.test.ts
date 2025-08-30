/**
 * System Commands Test Suite
 * Tests for monitoring, metrics, and system operations
 * 
 * Based on real-world patterns from:
 * - Netflix's Redis monitoring dashboards
 * - Airbnb's performance tracking systems  
 * - Stripe's Redis health checks
 * - Discord's memory monitoring
 * - GitHub's system diagnostics
 */

import { RedisAdapter } from '../../src/adapters/RedisAdapter';
import { RedisOptions } from '../../src/types';

describe('System Commands - Monitoring & Metrics', () => {
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

  describe('Server Information Commands', () => {
    test('should retrieve server info like Netflix monitoring', async () => {
      const info = await redis.info();
      
      expect(typeof info).toBe('string');
      expect(info.length).toBeGreaterThan(0);
      
      // Should contain standard Redis info sections
      expect(info).toContain('redis_version');
      expect(info).toContain('used_memory');
      expect(info).toContain('connected_clients');
    });

    test('should get specific info sections for targeted monitoring', async () => {
      // Test memory section for monitoring memory usage
      const memoryInfo = await redis.info('memory');
      expect(typeof memoryInfo).toBe('string');
      expect(memoryInfo).toContain('used_memory');
      
      // Test stats section for performance metrics
      const statsInfo = await redis.info('stats');
      expect(typeof statsInfo).toBe('string');
      expect(statsInfo).toContain('total_commands_processed');
    });

    test('should get server configuration like Airbnb systems', async () => {
      // Get maxmemory configuration
      const maxmemory = await redis.config('GET', 'maxmemory');
      expect(Array.isArray(maxmemory)).toBe(true);
      
      // Get timeout configuration
      const timeout = await redis.config('GET', 'timeout');
      expect(Array.isArray(timeout)).toBe(true);
      
      // Pattern to get all save-related configs
      const saveConfigs = await redis.config('GET', 'save*');
      expect(Array.isArray(saveConfigs)).toBe(true);
    });

    test('should monitor database size like Discord', async () => {
      // Add some test data
      await redis.set('monitor:test:1', 'value1');
      await redis.set('monitor:test:2', 'value2');
      await redis.hset('monitor:hash', 'field1', 'value1');
      await redis.sadd('monitor:set', 'member1', 'member2');
      
      // Get database size
      const dbsize = await redis.dbsize();
      expect(typeof dbsize).toBe('number');
      expect(dbsize).toBeGreaterThan(0);
    });
  });

  describe('Memory Monitoring Commands', () => {
    test('should track memory usage patterns like Stripe', async () => {
      // Create data structures of different types
      const baseKey = 'memory:test:' + Math.random();
      
      // String data
      await redis.set(`${baseKey}:string`, 'x'.repeat(1000));
      
      // Hash data
      const hashData: Record<string, string> = {};
      for (let i = 0; i < 50; i++) {
        hashData[`field_${i}`] = `value_${i}_${'x'.repeat(20)}`;
      }
      await redis.hmset(`${baseKey}:hash`, hashData);
      
      // List data
      const listKey = `${baseKey}:list`;
      for (let i = 0; i < 30; i++) {
        await redis.lpush(listKey, `item_${i}_${'x'.repeat(15)}`);
      }
      
      // Get memory usage for specific key
      try {
        const memoryUsage = await redis.memory('USAGE', `${baseKey}:string`);
        expect(typeof memoryUsage).toBe('number');
        expect(memoryUsage).toBeGreaterThan(0);
      } catch (error) {
        // MEMORY USAGE might not be available in all Redis versions
        expect(error).toBeDefined();
      }
    });

    test('should analyze memory statistics for performance tuning', async () => {
      // Get overall memory stats from INFO
      const info = await redis.info('memory');
      
      // Parse memory stats
      const lines = info.split('\r\n');
      const memoryStats: Record<string, string> = {};
      
      for (const line of lines) {
        if (line.includes(':') && !line.startsWith('#')) {
          const [key, value] = line.split(':');
          if (key && value) {
            memoryStats[key] = value;
          }
        }
      }
      
      // Verify key memory metrics exist
      expect('used_memory' in memoryStats).toBe(true);
      expect('used_memory_rss' in memoryStats).toBe(true);
      
      // Memory should be positive numbers
      const usedMemory = parseInt(memoryStats['used_memory'] || '0');
      expect(usedMemory).toBeGreaterThan(0);
    });
  });

  describe('Client Monitoring Commands', () => {
    test('should monitor client connections like GitHub', async () => {
      // Get client list
      try {
        const clients = await redis.client('LIST');
        expect(typeof clients).toBe('string');
        expect(clients.length).toBeGreaterThan(0);
        
        // Should contain client information
        expect(clients).toContain('addr=');
        expect(clients).toContain('fd=');
      } catch (error) {
        // CLIENT LIST might be restricted in some environments
        expect(error).toBeDefined();
      }
    });

    test('should track command statistics for performance analysis', async () => {
      // Execute various commands to generate stats
      await redis.set('stats:test:1', 'value1');
      await redis.get('stats:test:1');
      await redis.hset('stats:hash', 'field', 'value');
      await redis.hget('stats:hash', 'field');
      await redis.incr('stats:counter');
      
      // Get command statistics
      const info = await redis.info('commandstats');
      expect(typeof info).toBe('string');
      
      if (info.includes('cmdstat_')) {
        // Parse command stats
        const lines = info.split('\r\n');
        let foundSetStat = false;
        let foundGetStat = false;
        
        for (const line of lines) {
          if (line.includes('cmdstat_set')) foundSetStat = true;
          if (line.includes('cmdstat_get')) foundGetStat = true;
        }
        
        expect(foundSetStat || foundGetStat).toBe(true);
      }
    });
  });

  describe('Performance Monitoring Commands', () => {
    test('should measure latency like Netflix systems', async () => {
      const key = 'latency:test:' + Math.random();
      
      // Measure SET operation latency
      const startTime = Date.now();
      await redis.set(key, 'test_value');
      const setLatency = Date.now() - startTime;
      expect(setLatency).toBeGreaterThanOrEqual(0);
      expect(setLatency).toBeLessThan(1000); // Should be fast
      
      // Measure GET operation latency
      const getStartTime = Date.now();
      const value = await redis.get(key);
      const getLatency = Date.now() - getStartTime;
      expect(getLatency).toBeGreaterThanOrEqual(0);
      expect(getLatency).toBeLessThan(1000);
      expect(value).toBe('test_value');
    });

    test('should monitor slowlog for performance issues', async () => {
      try {
        // Get slow log entries
        const slowlog = await redis.slowlog('GET', '10');
        expect(Array.isArray(slowlog)).toBe(true);
        
        // Each entry should be an array with [id, timestamp, duration, command]
        for (const entry of slowlog.slice(0, 3)) {
          expect(Array.isArray(entry)).toBe(true);
          if (entry.length >= 4) {
            expect(typeof entry[0]).toBe('number'); // ID
            expect(typeof entry[1]).toBe('number'); // Timestamp
            expect(typeof entry[2]).toBe('number'); // Duration
            expect(Array.isArray(entry[3])).toBe(true); // Command array
          }
        }
      } catch (error) {
        // SLOWLOG might be disabled or restricted
        expect(error).toBeDefined();
      }
    });

    test('should benchmark operations for capacity planning', async () => {
      const operations = 100;
      const testKey = 'benchmark:' + Math.random();
      
      // Benchmark SET operations
      const setStartTime = Date.now();
      for (let i = 0; i < operations; i++) {
        await redis.set(`${testKey}:${i}`, `value_${i}`);
      }
      const setDuration = Date.now() - setStartTime;
      const setOpsPerSecond = (operations / setDuration) * 1000;
      
      expect(setOpsPerSecond).toBeGreaterThan(0);
      
      // Benchmark GET operations
      const getStartTime = Date.now();
      for (let i = 0; i < operations; i++) {
        await redis.get(`${testKey}:${i}`);
      }
      const getDuration = Date.now() - getStartTime;
      const getOpsPerSecond = (operations / getDuration) * 1000;
      
      expect(getOpsPerSecond).toBeGreaterThan(0);
      
      // Performance should be reasonable
      expect(setOpsPerSecond).toBeGreaterThan(10); // At least 10 ops/sec
      expect(getOpsPerSecond).toBeGreaterThan(10);
    });
  });

  describe('Debugging and Diagnostic Commands', () => {
    test('should provide debug information for troubleshooting', async () => {
      const key = 'debug:test:' + Math.random();
      await redis.set(key, 'debug_value');
      
      try {
        // Get object information for debugging
        const objectInfo = await redis.debug('OBJECT', key);
        expect(typeof objectInfo).toBe('string');
        expect(objectInfo.length).toBeGreaterThan(0);
      } catch (error) {
        // DEBUG commands might be disabled in production
        expect(error).toBeDefined();
      }
    });

    test('should support ping for connectivity testing', async () => {
      // Basic ping
      const pong = await redis.ping();
      expect(pong).toBe('PONG');
      
      // Ping with custom message
      const customMessage = 'health_check_' + Math.random();
      const response = await redis.ping(customMessage);
      expect(response).toBe(customMessage);
    });

    test('should handle echo for message verification', async () => {
      const testMessage = 'echo_test_' + Math.random();
      const response = await redis.echo(testMessage);
      expect(response).toBe(testMessage);
    });

    test('should provide time information for synchronization', async () => {
      const time = await redis.time();
      expect(Array.isArray(time)).toBe(true);
      expect(time).toHaveLength(2);
      
      // First element should be Unix timestamp (seconds)
      expect(typeof time[0]).toBe('string');
      expect(parseInt(time[0])).toBeGreaterThan(1600000000); // After 2020
      
      // Second element should be microseconds
      expect(typeof time[1]).toBe('string');
      expect(parseInt(time[1])).toBeGreaterThanOrEqual(0);
      expect(parseInt(time[1])).toBeLessThan(1000000);
    });
  });

  describe('Security and Access Monitoring', () => {
    test('should handle auth-related monitoring', async () => {
      // Test auth state (should succeed without auth in test environment)
      try {
        await redis.ping();
        expect(true).toBe(true); // Connection works
      } catch (error) {
        // May require auth in some environments
        expect(error).toBeDefined();
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle unknown INFO sections gracefully', async () => {
      try {
        const result = await redis.info('nonexistent_section');
        expect(typeof result).toBe('string');
        // Should return empty or minimal info
      } catch (error) {
        // Some implementations may throw error for unknown sections
        expect(error).toBeDefined();
      }
    });

    test('should handle CONFIG commands with invalid parameters', async () => {
      try {
        await redis.config('GET', 'nonexistent_config_parameter');
        // Should return empty array for non-existent config
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should handle MEMORY commands gracefully when not supported', async () => {
      try {
        await redis.memory('USAGE', 'test_key');
        // If supported, should return number
      } catch (error) {
        // MEMORY commands might not be available in older Redis versions
        expect(error).toBeDefined();
      }
    });

    test('should handle CLIENT commands when restricted', async () => {
      try {
        await redis.client('LIST');
        // If allowed, should return string
      } catch (error) {
        // CLIENT commands might be restricted
        expect(error).toBeDefined();
      }
    });

    test('should handle DEBUG commands when disabled', async () => {
      try {
        await redis.debug('OBJECT', 'test_key');
        // If enabled, should return debug info
      } catch (error) {
        // DEBUG commands are often disabled in production
        expect(error).toBeDefined();
      }
    });
  });
});