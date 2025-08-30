/**
 * Hash Commands Comprehensive Tests  
 * Real-world patterns: Session storage, user profiles, object caching, shopping carts
 */

import { RedisAdapter } from '../../src/adapters/RedisAdapter';
import { getRedisTestConfig } from '../utils/redis-config';

describe('Hash Commands - Real-World Patterns', () => {
  let redis: RedisAdapter;

  beforeEach(async () => {
    const config = await getRedisTestConfig();
    redis = new RedisAdapter(config);
  });

  afterEach(async () => {
    await redis.disconnect();
  });

  describe('User Session Management', () => {
    test('should manage user session data with HSET/HGET', async () => {
      const sessionKey = 'session:' + Math.random();
      
      // Create session
      const result1 = await redis.hset(sessionKey, 'userId', '12345');
      expect(result1).toBe(1);

      const result2 = await redis.hset(sessionKey, 'username', 'john_doe', 'email', 'john@example.com');
      expect(result2).toBe(2);

      // Retrieve session data
      const userId = await redis.hget(sessionKey, 'userId');
      expect(userId).toBe('12345');

      const username = await redis.hget(sessionKey, 'username');
      expect(username).toBe('john_doe');

      const nonexistent = await redis.hget(sessionKey, 'nonexistent');
      expect(nonexistent).toBeNull();
    });

    test('should handle bulk session operations with HMGET/HMSET', async () => {
      const sessionKey = 'session:bulk:' + Math.random();
      
      // Set multiple fields at once with object
      const sessionData = {
        userId: '67890',
        username: 'jane_doe',
        email: 'jane@example.com',
        role: 'admin',
        lastLogin: '2024-01-01T12:00:00Z'
      };
      
      const result = await redis.hmset(sessionKey, sessionData);
      expect(result).toBe('OK');

      // Get multiple fields at once
      const values = await redis.hmget(sessionKey, 'userId', 'username', 'email', 'nonexistent');
      expect(values).toEqual(['67890', 'jane_doe', 'jane@example.com', null]);

      // Get all session data
      const allData = await redis.hgetall(sessionKey);
      expect(allData).toEqual(sessionData);
    });

    test('should update session counters with HINCRBY', async () => {
      const sessionKey = 'session:counter:' + Math.random();
      
      // Initialize session with login count
      await redis.hset(sessionKey, 'loginCount', '1');

      // Increment login count
      const newCount = await redis.hincrby(sessionKey, 'loginCount', 1);
      expect(newCount).toBe(2);

      // Increment non-existent field
      const pageViews = await redis.hincrby(sessionKey, 'pageViews', 5);
      expect(pageViews).toBe(5);

      const finalCount = await redis.hget(sessionKey, 'loginCount');
      expect(finalCount).toBe('2');
    });
  });

  describe('User Profile Caching', () => {
    test('should cache user profiles with HGETALL', async () => {
      const profileKey = 'profile:user:' + Math.random();
      
      // Store user profile
      const profileData = {
        id: '123',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        preferences: JSON.stringify({ theme: 'dark', notifications: true })
      };

      const result = await redis.hmset(profileKey, profileData);
      expect(result).toBe('OK');

      // Retrieve full profile
      const storedProfile = await redis.hgetall(profileKey);
      expect(storedProfile.id).toBe('123');
      expect(storedProfile.name).toBe('Alice Johnson');
      
      const preferences = JSON.parse(storedProfile.preferences!);
      expect(preferences.theme).toBe('dark');
      expect(preferences.notifications).toBe(true);
    });

    test('should handle profile field operations', async () => {
      const profileKey = 'profile:fields:' + Math.random();
      
      await redis.hset(profileKey, 'name', 'Bob Smith', 'age', '30');

      // Check field existence
      const nameExists = await redis.hexists(profileKey, 'name');
      expect(nameExists).toBe(1);

      const emailExists = await redis.hexists(profileKey, 'email');
      expect(emailExists).toBe(0);

      // Get field count
      const fieldCount = await redis.hlen(profileKey);
      expect(fieldCount).toBe(2);

      // Get all field names
      const fieldNames = await redis.hkeys(profileKey);
      expect(fieldNames.sort()).toEqual(['age', 'name']);

      // Get all values
      const values = await redis.hvals(profileKey);
      expect(values.sort()).toEqual(['30', 'Bob Smith']);
    });
  });

  describe('Shopping Cart Implementation', () => {
    test('should manage shopping cart items', async () => {
      const cartKey = 'cart:user:' + Math.random();
      
      // Add items to cart
      await redis.hset(cartKey, 'item_1', JSON.stringify({
        productId: 'PROD-001',
        name: 'Laptop',
        price: 999.99,
        quantity: 1
      }));

      await redis.hset(cartKey, 'item_2', JSON.stringify({
        productId: 'PROD-002', 
        name: 'Mouse',
        price: 29.99,
        quantity: 2
      }));

      // Get cart contents
      const cartItems = await redis.hgetall(cartKey);
      expect(Object.keys(cartItems)).toHaveLength(2);

      const item1 = JSON.parse(cartItems.item_1!);
      expect(item1.productId).toBe('PROD-001');
      expect(item1.price).toBe(999.99);

      // Remove an item
      const removed = await redis.hdel(cartKey, 'item_1');
      expect(removed).toBe(1);

      const remainingItems = await redis.hlen(cartKey);
      expect(remainingItems).toBe(1);
    });

    test('should handle cart item quantity updates', async () => {
      const cartKey = 'cart:quantity:' + Math.random();
      
      // Add item with quantity
      await redis.hset(cartKey, 'item_quantity_1', '3');

      // Increase quantity
      const newQuantity = await redis.hincrby(cartKey, 'item_quantity_1', 2);
      expect(newQuantity).toBe(5);

      // Decrease quantity
      const decreasedQuantity = await redis.hincrby(cartKey, 'item_quantity_1', -1);
      expect(decreasedQuantity).toBe(4);
    });
  });

  describe('Advanced Hash Operations', () => {
    test('should handle floating point increments', async () => {
      const metricsKey = 'metrics:' + Math.random();
      
      // Initialize metrics
      await redis.hset(metricsKey, 'cpu_usage', '45.5');

      // Increment with float
      const newCpuUsage = await redis.hincrbyfloat(metricsKey, 'cpu_usage', 2.3);
      expect(parseFloat(newCpuUsage.toString())).toBeCloseTo(47.8, 1);

      // Initialize new field with float increment
      const diskUsage = await redis.hincrbyfloat(metricsKey, 'disk_usage', 33.7);
      expect(parseFloat(diskUsage.toString())).toBeCloseTo(33.7, 1);
    });

    test('should handle conditional field setting with HSETNX', async () => {
      const configKey = 'config:app:' + Math.random();
      
      // Set default configuration
      const result1 = await redis.hsetnx(configKey, 'theme', 'light');
      expect(result1).toBe(1); // Field was set

      const result2 = await redis.hsetnx(configKey, 'theme', 'dark');
      expect(result2).toBe(0); // Field was not set (already exists)

      // Verify the original value wasn't changed
      const theme = await redis.hget(configKey, 'theme');
      expect(theme).toBe('light');

      // Set a new field
      const result3 = await redis.hsetnx(configKey, 'language', 'en');
      expect(result3).toBe(1);
    });

    test('should handle bulk field deletion', async () => {
      const tempKey = 'temp:data:' + Math.random();
      
      // Create hash with multiple fields
      await redis.hmset(tempKey, {
        field1: 'value1',
        field2: 'value2', 
        field3: 'value3',
        field4: 'value4'
      });

      const initialCount = await redis.hlen(tempKey);
      expect(initialCount).toBe(4);

      // Delete multiple fields
      const deletedCount = await redis.hdel(tempKey, 'field1', 'field3', 'nonexistent');
      expect(deletedCount).toBe(2); // Only 2 fields existed and were deleted

      const remainingCount = await redis.hlen(tempKey);
      expect(remainingCount).toBe(2);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle operations on non-existent hashes', async () => {
      const nonExistentKey = 'nonexistent:hash:' + Math.random();
      
      // Operations on non-existent hash should return appropriate defaults
      const value = await redis.hget(nonExistentKey, 'field');
      expect(value).toBeNull();

      const values = await redis.hmget(nonExistentKey, 'field1', 'field2');
      expect(values).toEqual([null, null]);

      const allData = await redis.hgetall(nonExistentKey);
      expect(allData).toEqual({});

      const exists = await redis.hexists(nonExistentKey, 'field');
      expect(exists).toBe(0);

      const length = await redis.hlen(nonExistentKey);
      expect(length).toBe(0);

      const keys = await redis.hkeys(nonExistentKey);
      expect(keys).toEqual([]);

      const vals = await redis.hvals(nonExistentKey);
      expect(vals).toEqual([]);
    });

    test('should handle type conflicts gracefully', async () => {
      const stringKey = 'string:key:' + Math.random();
      
      // Set a string value
      await redis.set(stringKey, 'not-a-hash');

      // Hash operations should fail on string keys
      await expect(redis.hset(stringKey, 'field', 'value')).rejects.toThrow();
      await expect(redis.hget(stringKey, 'field')).rejects.toThrow();
    });

    test('should handle empty field names and values', async () => {
      const edgeCaseKey = 'edge:case:' + Math.random();
      
      // Test empty value
      const result = await redis.hset(edgeCaseKey, 'empty_value', '');
      expect(result).toBe(1);

      // Retrieve empty value
      const emptyValue = await redis.hget(edgeCaseKey, 'empty_value');
      expect(emptyValue).toBe('');
    });
  });
});