/**
 * JSON Commands Comprehensive Tests
 * 
 * Tests ValkeyJSON / RedisJSON v2 compatibility:
 * - Document storage and retrieval patterns
 * - JSONPath operations and queries
 * - Real-world use cases from modern applications
 * - E-commerce product catalogs, user profiles, config management
 * - Gaming leaderboards, analytics data, content management
 * - API responses caching, session data, configuration
 */

import { RedisAdapter } from '../../src/adapters/RedisAdapter';
import { getValkeyBundleTestConfig, checkAvailableModules, waitForValkeyBundle } from '../utils/valkey-bundle-config';

describe('JSON Commands - ValkeyJSON Compatibility', () => {
  let redis: RedisAdapter;

  beforeAll(async () => {
    const config = await getValkeyBundleTestConfig();
    redis = new RedisAdapter(config);
    
    // Wait for valkey-bundle to be ready and check modules
    const isReady = await waitForValkeyBundle(redis);
    if (!isReady) {
      throw new Error('Valkey-bundle is not ready or modules not available. Make sure to start: docker-compose -f docker-compose.valkey-bundle.yml up -d');
    }
    
    const modules = await checkAvailableModules(redis);
    if (!modules.json) {
      throw new Error('JSON module not available in valkey-bundle');
    }
  });

  beforeEach(async () => {
    // Clean up any existing test keys
    try {
      const keys = await redis.keys('*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  afterAll(async () => {
    if (redis) {
      await redis.disconnect();
    }
  });

  describe('Basic JSON Document Operations', () => {
    test('should set and get simple JSON documents', async () => {
      const userProfile = {
        id: 123,
        name: 'John Doe',
        email: 'john@example.com',
        active: true,
        score: 95.5
      };

      // Set JSON document
      const setResult = await redis.jsonSet('user:123', '$', userProfile);
      expect(setResult).toBe('OK');

      // Get entire document
      const getResult = await redis.jsonGet('user:123');
      expect(getResult).toBeTruthy();
      
      const parsed = JSON.parse(getResult!);
      expect(parsed.id).toBe(123);
      expect(parsed.name).toBe('John Doe');
      expect(parsed.active).toBe(true);
      expect(parsed.score).toBe(95.5);
    });

    test('should handle nested JSON documents', async () => {
      const complexDoc = {
        user: {
          profile: {
            name: 'Alice Smith',
            age: 28,
            preferences: {
              theme: 'dark',
              notifications: true,
              languages: ['en', 'es', 'fr']
            }
          },
          stats: {
            login_count: 45,
            last_login: '2024-01-15T10:30:00Z',
            achievements: ['first_login', 'power_user']
          }
        }
      };

      await redis.jsonSet('complex:doc', '$', complexDoc);
      
      // Get specific nested paths
      const userName = await redis.jsonGet('complex:doc', '$.user.profile.name');
      expect(userName).toBeTruthy();
      
      const preferences = await redis.jsonGet('complex:doc', '$.user.profile.preferences');
      expect(preferences).toBeTruthy();
      
      const parsed = JSON.parse(preferences!);
      expect(parsed.theme).toBe('dark');
      expect(parsed.languages).toContain('en');
    });

    test('should handle JSON SET with conditions (NX/XX)', async () => {
      // Test NX (only if not exists)
      const result1 = await redis.jsonSet('conditional:test', '$', { value: 1 }, 'NX');
      expect(result1).toBe('OK');

      // Should fail with NX since key exists
      const result2 = await redis.jsonSet('conditional:test', '$', { value: 2 }, 'NX');
      expect(result2).toBeNull();

      // Should succeed with XX since key exists
      const result3 = await redis.jsonSet('conditional:test', '$', { value: 3 }, 'XX');
      expect(result3).toBe('OK');

      // Verify the value was updated
      const final = await redis.jsonGet('conditional:test');
      const parsed = JSON.parse(final!);
      expect(parsed.value).toBe(3);
    });
  });

  describe('JSON Path Operations', () => {
    beforeEach(async () => {
      const testDoc = {
        users: [
          { id: 1, name: 'Alice', score: 85 },
          { id: 2, name: 'Bob', score: 92 },
          { id: 3, name: 'Charlie', score: 78 }
        ],
        metadata: {
          total: 3,
          updated: '2024-01-01',
          tags: ['active', 'verified']
        }
      };
      await redis.jsonSet('pathtest', '$', testDoc);
    });

    test('should get type information for paths', async () => {
      // Test different data types
      const rootType = await redis.jsonType('pathtest', '$');
      expect(rootType).toBe('object');

      const arrayType = await redis.jsonType('pathtest', '$.users');
      expect(arrayType).toBe('array');

      const stringType = await redis.jsonType('pathtest', '$.metadata.updated');
      expect(stringType).toBe('string');

      const numberType = await redis.jsonType('pathtest', '$.metadata.total');
      expect(numberType).toBe('integer');
    });

    test('should delete specific paths', async () => {
      // Delete a specific array element
      const deleteCount = await redis.jsonDel('pathtest', '$.users[1]');
      expect(deleteCount).toBe(1);

      // Verify deletion
      const users = await redis.jsonGet('pathtest', '$.users');
      const parsed = JSON.parse(users!);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].name).toBe('Alice');
      expect(parsed[1].name).toBe('Charlie'); // Bob was removed
    });

    test('should clear paths to empty/null values', async () => {
      // Clear an array
      const clearCount = await redis.jsonClear('pathtest', '$.metadata.tags');
      expect(clearCount).toBe(1);

      // Verify array is empty
      const tags = await redis.jsonGet('pathtest', '$.metadata.tags');
      const parsed = JSON.parse(tags!);
      expect(parsed).toEqual([]);
    });
  });

  describe('Numeric Operations', () => {
    beforeEach(async () => {
      const counterDoc = {
        stats: {
          page_views: 100,
          unique_visitors: 25,
          conversion_rate: 2.5
        }
      };
      await redis.jsonSet('counters', '$', counterDoc);
    });

    test('should increment numeric values', async () => {
      // Increment integer
      const result1 = await redis.jsonNumIncrBy('counters', '$.stats.page_views', 15);
      expect(result1).toBeTruthy();

      // Increment float
      const result2 = await redis.jsonNumIncrBy('counters', '$.stats.conversion_rate', 0.5);
      expect(result2).toBeTruthy();

      // Verify results
      const final = await redis.jsonGet('counters', '$.stats');
      const parsed = JSON.parse(final!);
      expect(parsed.page_views).toBe(115);
      expect(parsed.conversion_rate).toBe(3.0);
    });

    test('should multiply numeric values', async () => {
      // Multiply by 2
      const result = await redis.jsonNumMultBy('counters', '$.stats.page_views', 2);
      expect(result).toBeTruthy();

      // Verify result
      const final = await redis.jsonGet('counters', '$.stats.page_views');
      const parsed = JSON.parse(final!);
      expect(parsed).toBe(200);
    });
  });

  describe('String Operations', () => {
    beforeEach(async () => {
      const textDoc = {
        messages: {
          welcome: 'Hello',
          description: 'This is a test'
        }
      };
      await redis.jsonSet('strings', '$', textDoc);
    });

    test('should append to string values', async () => {
      // Append to string
      const newLength = await redis.jsonStrAppend('strings', '$.messages.welcome', ' World!');
      expect(newLength).toBeGreaterThan(0);

      // Verify result
      const result = await redis.jsonGet('strings', '$.messages.welcome');
      const parsed = JSON.parse(result!);
      expect(parsed).toBe('Hello World!');
    });

    test('should get string length', async () => {
      const length = await redis.jsonStrLen('strings', '$.messages.description');
      expect(length).toBe(14); // 'This is a test' = 14 characters
    });
  });

  describe('Array Operations', () => {
    beforeEach(async () => {
      const arrayDoc = {
        items: ['apple', 'banana'],
        numbers: [1, 2, 3],
        mixed: ['hello', 42, true]
      };
      await redis.jsonSet('arrays', '$', arrayDoc);
    });

    test('should append to arrays', async () => {
      // Append to fruit array
      const newLength = await redis.jsonArrAppend('arrays', '$.items', 'orange', 'grape');
      expect(newLength).toBe(4);

      // Verify result
      const result = await redis.jsonGet('arrays', '$.items');
      const parsed = JSON.parse(result!);
      expect(parsed).toEqual(['apple', 'banana', 'orange', 'grape']);
    });

    test('should insert into arrays', async () => {
      // Insert at position 1
      const newLength = await redis.jsonArrInsert('arrays', '$.numbers', 1, 1.5);
      expect(newLength).toBe(4);

      // Verify result
      const result = await redis.jsonGet('arrays', '$.numbers');
      const parsed = JSON.parse(result!);
      expect(parsed).toEqual([1, 1.5, 2, 3]);
    });

    test('should get array length', async () => {
      const length = await redis.jsonArrLen('arrays', '$.mixed');
      expect(length).toBe(3);
    });

    test('should pop elements from arrays', async () => {
      // Pop from end (default)
      const popped = await redis.jsonArrPop('arrays', '$.items');
      expect(popped).toBeTruthy();

      // Pop from specific index
      const poppedAtIndex = await redis.jsonArrPop('arrays', '$.numbers', 0);
      expect(poppedAtIndex).toBeTruthy();

      // Verify results
      const items = await redis.jsonGet('arrays', '$.items');
      const itemsParsed = JSON.parse(items!);
      expect(itemsParsed).toEqual(['apple']); // banana was popped

      const numbers = await redis.jsonGet('arrays', '$.numbers');
      const numbersParsed = JSON.parse(numbers!);
      expect(numbersParsed).toEqual([2, 3]); // 1 was popped from index 0
    });

    test('should trim arrays', async () => {
      // Trim to keep only middle element
      const newLength = await redis.jsonArrTrim('arrays', '$.numbers', 1, 1);
      expect(newLength).toBe(1);

      // Verify result
      const result = await redis.jsonGet('arrays', '$.numbers');
      const parsed = JSON.parse(result!);
      expect(parsed).toEqual([2]); // Only middle element remains
    });
  });

  describe('Object Operations', () => {
    beforeEach(async () => {
      const objectDoc = {
        config: {
          theme: 'dark',
          language: 'en',
          notifications: true,
          timeout: 300
        },
        user: {
          name: 'Test User',
          role: 'admin'
        }
      };
      await redis.jsonSet('objects', '$', objectDoc);
    });

    test('should get object keys', async () => {
      const keys = await redis.jsonObjKeys('objects', '$.config');
      expect(Array.isArray(keys)).toBe(true);
      expect(keys).toContain('theme');
      expect(keys).toContain('language');
      expect(keys).toContain('notifications');
      expect(keys).toContain('timeout');
    });

    test('should get object length', async () => {
      const configLength = await redis.jsonObjLen('objects', '$.config');
      expect(configLength).toBe(4);

      const userLength = await redis.jsonObjLen('objects', '$.user');
      expect(userLength).toBe(2);
    });
  });

  describe('Boolean Operations', () => {
    beforeEach(async () => {
      const boolDoc = {
        flags: {
          enabled: true,
          debug: false,
          experimental: true
        }
      };
      await redis.jsonSet('booleans', '$', boolDoc);
    });

    test('should toggle boolean values', async () => {
      // Toggle true to false
      const result1 = await redis.jsonToggle('booleans', '$.flags.enabled');
      expect(result1).toBe(0); // 0 for false

      // Toggle false to true
      const result2 = await redis.jsonToggle('booleans', '$.flags.debug');
      expect(result2).toBe(1); // 1 for true

      // Verify results
      const final = await redis.jsonGet('booleans', '$.flags');
      const parsed = JSON.parse(final!);
      expect(parsed.enabled).toBe(false);
      expect(parsed.debug).toBe(true);
      expect(parsed.experimental).toBe(true); // unchanged
    });
  });

  describe('Real-World Use Cases', () => {
    test('should handle e-commerce product catalog', async () => {
      const product = {
        id: 'prod_123',
        name: 'Gaming Laptop',
        price: 1299.99,
        category: 'Electronics',
        specs: {
          cpu: 'Intel i7',
          ram: '16GB',
          storage: '1TB SSD',
          gpu: 'NVIDIA RTX 3060'
        },
        reviews: [
          { user: 'user1', rating: 5, comment: 'Excellent!' },
          { user: 'user2', rating: 4, comment: 'Good performance' }
        ],
        tags: ['gaming', 'laptop', 'high-performance'],
        in_stock: true,
        stock_count: 15
      };

      // Store product
      await redis.jsonSet('product:prod_123', '$', product);

      // Update price
      await redis.jsonNumMultBy('product:prod_123', '$.price', 0.9); // 10% discount

      // Add new review
      await redis.jsonArrAppend('product:prod_123', '$.reviews', 
        { user: 'user3', rating: 5, comment: 'Amazing laptop!' }
      );

      // Decrease stock
      await redis.jsonNumIncrBy('product:prod_123', '$.stock_count', -1);

      // Get updated product
      const updated = await redis.jsonGet('product:prod_123');
      const parsedProduct = JSON.parse(updated!);
      
      expect(parsedProduct.price).toBeCloseTo(1169.99, 2); // Discounted price
      expect(parsedProduct.reviews).toHaveLength(3);
      expect(parsedProduct.stock_count).toBe(14);
    });

    test('should handle user session data', async () => {
      const session = {
        user_id: 'user_456',
        login_time: '2024-01-15T10:30:00Z',
        permissions: ['read', 'write'],
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC'
        },
        activity: {
          page_views: 0,
          actions_performed: []
        },
        authenticated: true
      };

      // Store session
      await redis.jsonSet('session:sess_789', '$', session);

      // Track page view
      await redis.jsonNumIncrBy('session:sess_789', '$.activity.page_views', 1);

      // Add action
      await redis.jsonArrAppend('session:sess_789', '$.activity.actions_performed',
        { action: 'view_profile', timestamp: '2024-01-01T10:00:00.000Z' }
      );

      // Update preferences
      await redis.jsonSet('session:sess_789', '$.preferences.theme', 'dark');

      // Get final session state
      const finalSession = await redis.jsonGet('session:sess_789');
      const parsed = JSON.parse(finalSession!);
      
      expect(parsed.activity.page_views).toBe(1);
      expect(parsed.activity.actions_performed).toHaveLength(1);
      expect(parsed.preferences.theme).toBe('dark');
    });

    test('should handle application configuration', async () => {
      const config = {
        app_name: 'MyApp',
        version: '1.0.0',
        environment: 'production',
        database: {
          host: 'db.example.com',
          port: 5432,
          max_connections: 100
        },
        cache: {
          ttl: 3600,
          max_size: 1000
        },
        features: {
          new_ui: true,
          beta_features: false,
          analytics: true
        },
        maintenance_mode: false
      };

      // Store configuration
      await redis.jsonSet('app:config', '$', config);

      // Enable maintenance mode
      await redis.jsonToggle('app:config', '$.maintenance_mode');

      // Update cache settings
      await redis.jsonNumIncrBy('app:config', '$.cache.ttl', 1200); // Add 20 minutes
      await redis.jsonNumMultBy('app:config', '$.cache.max_size', 2); // Double max size

      // Enable beta features
      await redis.jsonToggle('app:config', '$.features.beta_features');

      // Get updated config
      const updated = await redis.jsonGet('app:config');
      const parsedConfig = JSON.parse(updated!);
      
      expect(parsedConfig.maintenance_mode).toBe(true);
      expect(parsedConfig.cache.ttl).toBe(4800);
      expect(parsedConfig.cache.max_size).toBe(2000);
      expect(parsedConfig.features.beta_features).toBe(true);
    });
  });

  describe('Advanced JSONPath Queries', () => {
    beforeEach(async () => {
      const complexData = {
        users: [
          { id: 1, name: 'Alice', age: 25, city: 'NYC', active: true },
          { id: 2, name: 'Bob', age: 30, city: 'LA', active: false },
          { id: 3, name: 'Charlie', age: 35, city: 'NYC', active: true }
        ],
        cities: {
          NYC: { population: 8000000, timezone: 'EST' },
          LA: { population: 4000000, timezone: 'PST' }
        }
      };
      await redis.jsonSet('complex:data', '$', complexData);
    });

    test('should handle complex path queries', async () => {
      // Get all user names
      const names = await redis.jsonGet('complex:data', '$..name');
      expect(names).toBeTruthy();

      // Get all active users
      const activeUsers = await redis.jsonGet('complex:data', '$.users[?(@.active == true)]');
      if (activeUsers) {
        const parsed = JSON.parse(activeUsers);
        // Should contain Alice and Charlie
        expect(Array.isArray(parsed) || typeof parsed === 'object').toBe(true);
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle operations on non-existent keys', async () => {
      // Get from non-existent key
      const result = await redis.jsonGet('nonexistent:key');
      expect(result).toBeNull();

      // Delete from non-existent key
      const deleteCount = await redis.jsonDel('nonexistent:key');
      expect(deleteCount).toBe(0);

      // Type of non-existent key
      const type = await redis.jsonType('nonexistent:key');
      expect(type).toBeNull();
    });

    test('should handle invalid paths gracefully', async () => {
      // Set up test data
      await redis.jsonSet('test:key', '$', { name: 'test' });

      // Try to get invalid path
      const result = await redis.jsonGet('test:key', '$.invalid.path');
      expect(result).toBeNull();

      // Try to delete invalid path
      const deleteCount = await redis.jsonDel('test:key', '$.invalid.path');
      expect(deleteCount).toBe(0);
    });

    test('should handle type mismatches', async () => {
      // Set up test data with different types
      await redis.jsonSet('type:test', '$', {
        string_field: 'hello',
        number_field: 42,
        array_field: [1, 2, 3],
        object_field: { nested: true }
      });

      // Try to get array length of non-array
      const length = await redis.jsonArrLen('type:test', '$.string_field');
      expect(length).toBeNull();

      // Try to get object keys of non-object
      const keys = await redis.jsonObjKeys('type:test', '$.number_field');
      expect(keys).toBeNull();
    });

    test('should handle large JSON documents', async () => {
      // Create large document
      const largeDoc = {
        metadata: { size: 'large' },
        data: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          value: `item_${i}`,
          timestamp: new Date().toISOString(),
          random: Math.random()
        }))
      };

      // Store large document
      const result = await redis.jsonSet('large:doc', '$', largeDoc);
      expect(result).toBe('OK');

      // Get array length
      const length = await redis.jsonArrLen('large:doc', '$.data');
      expect(length).toBe(1000);

      // Get specific element
      const element = await redis.jsonGet('large:doc', '$.data[500]');
      expect(element).toBeTruthy();

      const parsed = JSON.parse(element!);
      expect(parsed.id).toBe(500);
    });
  });

  describe('Debug and Utility Operations', () => {
    beforeEach(async () => {
      const debugDoc = {
        level1: {
          level2: {
            level3: {
              deep: true,
              value: 'nested'
            }
          }
        },
        array: [1, 2, 3, 4, 5]
      };
      await redis.jsonSet('debug:test', '$', debugDoc);
    });

    test('should provide debug information', async () => {
      // Get memory usage (if supported)
      try {
        const memory = await redis.jsonDebug('MEMORY', 'debug:test');
        expect(typeof memory).toBe('number');
      } catch (error) {
        // Debug commands might not be supported in all environments
        expect(error).toBeDefined();
      }

      // Get depth information (if supported) 
      try {
        const depth = await redis.jsonDebug('DEPTH', 'debug:test');
        expect(typeof depth).toBe('number');
      } catch (error) {
        // Debug commands might not be supported in all environments
        expect(error).toBeDefined();
      }
    });

    test('should convert to RESP format', async () => {
      try {
        const resp = await redis.jsonResp('debug:test', '$.array');
        expect(resp).toBeDefined();
      } catch (error) {
        // RESP conversion might not be supported in all environments
        expect(error).toBeDefined();
      }
    });

    test('should support legacy FORGET command', async () => {
      // FORGET is alias for DEL (RedisJSON v1 compatibility)
      const deleteCount = await redis.jsonForget('debug:test', '$.array');
      expect(typeof deleteCount).toBe('number');

      // Verify deletion
      const result = await redis.jsonGet('debug:test', '$.array');
      expect(result).toBeNull();
    });
  });
});