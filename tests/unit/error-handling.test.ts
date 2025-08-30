/**
 * Error Handling and Edge Case Tests
 * Real-world patterns: Connection resilience, command failures, recovery scenarios
 */

import { RedisAdapter } from '../../src/adapters/RedisAdapter';
import { getRedisTestConfig } from '../utils/redis-config';

describe('Error Handling and Edge Cases', () => {
  let redis: RedisAdapter;

  beforeEach(async () => {
    const config = await getRedisTestConfig();
    redis = new RedisAdapter(config);
  });

  afterEach(async () => {
    await redis.disconnect();
  });

  describe('Connection Error Handling', () => {
    test('should handle graceful disconnection', async () => {
      // Verify we can perform operations
      await redis.set('test:disconnect', 'value');
      const value = await redis.get('test:disconnect');
      expect(value).toBe('value');
      
      // Disconnect and verify
      await redis.disconnect();
      
      // Should be able to reconnect
      const config = await getRedisTestConfig();
      redis = new RedisAdapter(config);
      
      const reconnectedValue = await redis.get('test:disconnect');
      expect(reconnectedValue).toBe('value');
    });

    test('should handle invalid configuration gracefully', async () => {
      // Test with various invalid configs that should not crash
      expect(() => {
        new RedisAdapter({ host: '', port: 0 });
      }).not.toThrow();
    });
  });

  describe('Command Error Scenarios', () => {
    test('should handle type conflicts gracefully', async () => {
      const key = 'type:conflict:' + Math.random();
      
      // Set as string
      await redis.set(key, 'string_value');
      
      // Try to use as list - should throw appropriate error
      await expect(redis.lpush(key, 'value')).rejects.toThrow();
      
      // Try to use as hash - should throw appropriate error  
      await expect(redis.hset(key, 'field', 'value')).rejects.toThrow();
      
      // Try to use as set - should throw appropriate error
      await expect(redis.sadd(key, 'member')).rejects.toThrow();
      
      // Try to use as zset - should throw appropriate error
      await expect(redis.zadd(key, 1, 'member')).rejects.toThrow();
    });

    test('should handle invalid command arguments', async () => {
      const key = 'invalid:args:' + Math.random();
      
      // Invalid LSET arguments
      await redis.rpush(key, 'a', 'b', 'c');
      await expect(redis.lset(key, 999, 'value')).rejects.toThrow();
      await expect(redis.lset(key, -999, 'value')).rejects.toThrow();
      
      // Invalid INCR on non-numeric value
      await redis.set(key + ':non_numeric', 'not_a_number');
      await expect(redis.incr(key + ':non_numeric')).rejects.toThrow();
    });

    test('should handle memory pressure scenarios', async () => {
      const largeKey = 'memory:test:' + Math.random();
      
      // Create a large string (within reasonable test limits)
      const largeValue = 'x'.repeat(100000); // 100KB
      
      try {
        await redis.set(largeKey, largeValue);
        const retrieved = await redis.get(largeKey);
        expect(retrieved).toBe(largeValue);
      } catch (error) {
        // If memory is limited, should get appropriate error
        expect((error as Error).message).toMatch(/memory|space|limit/i);
      }
      
      // Clean up
      await redis.del(largeKey);
    });
  });

  describe('Transaction Error Handling', () => {
    test('should handle transaction failures gracefully', async () => {
      const multi = redis.multi();
      
      // Add some valid commands
      multi.set('tx:test1', 'value1');
      multi.set('tx:test2', 'value2');
      
      // Add a command that might fail
      multi.incr('tx:test1'); // Will fail because it's a string
      
      // Execute transaction
      const results = await multi.exec();
      
      // Should get results for all commands, even if some fail
      expect(results).toBeTruthy();
      expect(Array.isArray(results)).toBe(true);
    });

    test('should handle empty transactions', async () => {
      const multi = redis.multi();
      const results = await multi.exec();
      
      expect(results).toBeTruthy();
      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(0);
    });
  });

  describe('Pipeline Error Recovery', () => {
    test('should handle mixed success/failure in pipelines', async () => {
      const pipeline = redis.pipeline();
      
      // Valid commands
      pipeline.set('pipe:success1', 'ok');
      pipeline.set('pipe:success2', 'ok');
      
      // Invalid command
      pipeline.incr('pipe:success1'); // Will fail
      
      // More valid commands
      pipeline.get('pipe:success2');
      
      const results = await pipeline.exec();
      
      expect(results).toBeTruthy();
      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(4);
      
      // First two should succeed
      expect(results[0]?.[1]).toBe('OK');
      expect(results[1]?.[1]).toBe('OK');
      
      // Third should fail
      expect(results[2]?.[0]).toBeTruthy(); // Should have error
      
      // Fourth should succeed
      expect(results[3]?.[1]).toBe('ok');
    });

    test('should handle pipeline abort scenarios', async () => {
      const pipeline = redis.pipeline();
      
      pipeline.set('abort:test', 'value');
      pipeline.get('abort:test');
      
      // Should be able to execute normally
      const results = await pipeline.exec();
      expect(results).toHaveLength(2);
    });
  });

  describe('Data Structure Edge Cases', () => {
    test('should handle empty data structures', async () => {
      const baseKey = 'empty:' + Math.random();
      
      // Empty list operations
      const listKey = baseKey + ':list';
      expect(await redis.llen(listKey)).toBe(0);
      expect(await redis.lpop(listKey)).toBeNull();
      expect(await redis.lrange(listKey, 0, -1)).toEqual([]);
      
      // Empty set operations
      const setKey = baseKey + ':set';
      expect(await redis.scard(setKey)).toBe(0);
      expect(await redis.spop(setKey)).toBeNull();
      expect(await redis.smembers(setKey)).toEqual([]);
      
      // Empty hash operations
      const hashKey = baseKey + ':hash';
      expect(await redis.hlen(hashKey)).toBe(0);
      expect(await redis.hkeys(hashKey)).toEqual([]);
      expect(await redis.hgetall(hashKey)).toEqual({});
      
      // Empty zset operations
      const zsetKey = baseKey + ':zset';
      expect(await redis.zcard(zsetKey)).toBe(0);
      expect(await redis.zrange(zsetKey, 0, -1)).toEqual([]);
    });

    test('should handle boundary value operations', async () => {
      const key = 'boundary:' + Math.random();
      
      // Test with empty strings
      await redis.set(key + ':empty', '');
      const empty = await redis.get(key + ':empty');
      expect(empty).toBe('');
      
      // Test with very long field names in hashes
      const longField = 'field_' + 'x'.repeat(1000);
      await redis.hset(key + ':hash', longField, 'value');
      const longFieldValue = await redis.hget(key + ':hash', longField);
      expect(longFieldValue).toBe('value');
      
      // Test with special characters
      const specialChars = '!@#$%^&*()_+{}|:"<>?[];\'\\,./~`';
      await redis.set(key + ':special', specialChars);
      const specialValue = await redis.get(key + ':special');
      expect(specialValue).toBe(specialChars);
    });

    test('should handle numeric edge cases', async () => {
      const key = 'numeric:' + Math.random();
      
      // Test with zero
      await redis.set(key + ':zero', '0');
      const incremented = await redis.incr(key + ':zero');
      expect(incremented).toBe(1);
      
      // Test with negative numbers
      await redis.set(key + ':negative', '-5');
      const decremented = await redis.decr(key + ':negative');
      expect(decremented).toBe(-6);
      
      // Test with float precision
      const floatKey = key + ':float';
      await redis.set(floatKey, '0.0');
      const floatIncr = await redis.incrbyfloat(floatKey, 0.1);
      expect(parseFloat(floatIncr.toString())).toBeCloseTo(0.1, 10);
    });
  });

  describe('Concurrency and Race Conditions', () => {
    test('should handle concurrent operations on same key', async () => {
      const key = 'concurrent:' + Math.random();
      await redis.set(key, '0');
      
      // Simulate concurrent increments
      const concurrentOperations = Array.from({ length: 10 }, () =>
        redis.incr(key)
      );
      
      const results = await Promise.all(concurrentOperations);
      
      // All operations should succeed
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThan(0);
      });
      
      // Final value should be 10
      const finalValue = await redis.get(key);
      expect(parseInt(finalValue!)).toBe(10);
    });

    test('should handle concurrent pipeline executions', async () => {
      const baseKey = 'pipe_concurrent:' + Math.random();
      
      const createPipeline = (suffix: string) => {
        const pipeline = redis.pipeline();
        pipeline.set(baseKey + ':' + suffix, suffix);
        pipeline.get(baseKey + ':' + suffix);
        return pipeline.exec();
      };
      
      const pipelines = Array.from({ length: 5 }, (_, i) =>
        createPipeline(i.toString())
      );
      
      const results = await Promise.all(pipelines);
      
      // All pipelines should succeed
      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result).toHaveLength(2);
        expect(result?.[0]?.[1]).toBe('OK'); // SET result
        expect(result?.[1]?.[1]).toBe(index.toString()); // GET result
      });
    });
  });

  describe('Resource Cleanup and Lifecycle', () => {
    test('should handle proper cleanup of expired keys', async () => {
      const key = 'cleanup:expire:' + Math.random();
      
      // Set key with very short TTL
      await redis.setex(key, 1, 'temporary');
      
      // Verify it exists
      const beforeExpiry = await redis.get(key);
      expect(beforeExpiry).toBe('temporary');
      
      // Wait for expiry
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      // Should be gone
      const afterExpiry = await redis.get(key);
      expect(afterExpiry).toBeNull();
      
      const ttl = await redis.ttl(key);
      expect(ttl).toBe(-2); // Key doesn't exist
    });

    test('should handle cleanup of complex data structures', async () => {
      const baseKey = 'cleanup:complex:' + Math.random();
      
      // Create complex structures
      await redis.hmset(baseKey + ':hash', { field1: 'value1', field2: 'value2' });
      await redis.sadd(baseKey + ':set', 'member1', 'member2');
      await redis.zadd(baseKey + ':zset', 1, 'item1', 2, 'item2');
      await redis.rpush(baseKey + ':list', 'item1', 'item2');
      
      // Verify they exist
      expect(await redis.hlen(baseKey + ':hash')).toBeGreaterThan(0);
      expect(await redis.scard(baseKey + ':set')).toBeGreaterThan(0);
      expect(await redis.zcard(baseKey + ':zset')).toBeGreaterThan(0);
      expect(await redis.llen(baseKey + ':list')).toBeGreaterThan(0);
      
      // Cleanup all at once
      const deleted = await redis.del(
        baseKey + ':hash',
        baseKey + ':set', 
        baseKey + ':zset',
        baseKey + ':list'
      );
      
      expect(deleted).toBe(4);
      
      // Verify cleanup
      expect(await redis.hlen(baseKey + ':hash')).toBe(0);
      expect(await redis.scard(baseKey + ':set')).toBe(0);
      expect(await redis.zcard(baseKey + ':zset')).toBe(0);
      expect(await redis.llen(baseKey + ':list')).toBe(0);
    });
  });

  describe('Command Parameter Validation', () => {
    test('should validate command parameters appropriately', async () => {
      const key = 'validation:' + Math.random();
      
      // Test invalid range parameters
      await redis.rpush(key, 'a', 'b', 'c');
      
      // Valid ranges should work
      const validRange = await redis.lrange(key, 0, 1);
      expect(validRange).toEqual(['a', 'b']);
      
      // Out of bounds ranges should return empty or partial results  
      const outOfBounds = await redis.lrange(key, 10, 20);
      expect(outOfBounds).toEqual([]);
      
      const negativeRange = await redis.lrange(key, -10, -5);
      expect(Array.isArray(negativeRange)).toBe(true);
    });

    test('should handle malformed key patterns', async () => {
      // Keys with special characters
      const specialKeys = [
        'key:with:colons',
        'key*with*asterisks',
        'key[with]brackets',
        'key{with}braces',
        'key with spaces'
      ];
      
      for (const specialKey of specialKeys) {
        await redis.set(specialKey, 'value');
        const value = await redis.get(specialKey);
        expect(value).toBe('value');
      }
      
      // Clean up
      await redis.del(...specialKeys);
    });
  });

  describe('Recovery Scenarios', () => {
    test('should handle graceful degradation', async () => {
      const key = 'recovery:' + Math.random();
      
      // Successful operation
      await redis.set(key, 'value');
      const value = await redis.get(key);
      expect(value).toBe('value');
      
      // Even if we encounter errors, basic operations should still work
      try {
        await redis.incr(key); // Will fail on string value
      } catch (error) {
        // Expected to fail
        expect(error).toBeTruthy();
      }
      
      // Should still be able to perform other operations
      const stillExists = await redis.get(key);
      expect(stillExists).toBe('value');
      
      await redis.del(key);
      const afterDelete = await redis.get(key);
      expect(afterDelete).toBeNull();
    });

    test('should maintain data consistency during errors', async () => {
      const key = 'consistency:' + Math.random();
      
      // Set up initial state
      await redis.rpush(key, 'item1', 'item2', 'item3');
      const initialLength = await redis.llen(key);
      expect(initialLength).toBe(3);
      
      // Attempt operations that might partially fail
      try {
        await redis.lset(key, 999, 'invalid_index'); // Should fail
      } catch (error) {
        // Expected to fail
      }
      
      // Verify list is unchanged
      const afterError = await redis.llen(key);
      expect(afterError).toBe(3);
      
      const items = await redis.lrange(key, 0, -1);
      expect(items).toEqual(['item1', 'item2', 'item3']);
    });
  });
});