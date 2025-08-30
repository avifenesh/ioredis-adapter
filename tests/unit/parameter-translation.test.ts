/**
 * Parameter Translation Edge Cases Tests
 * 
 * Real-world edge cases and parameter translation patterns:
 * - Complex Redis command parameter variations
 * - Type conversion edge cases from production bugs
 * - Argument validation patterns from high-traffic systems
 * - Special character handling in keys and values
 * - Multi-type parameter handling (strings, numbers, arrays)
 */

import { ParameterTranslator } from '../../src/utils/ParameterTranslator';

describe('Parameter Translation - Edge Cases & Production Patterns', () => {
  describe('String Parameter Translation', () => {
    test('should handle empty and whitespace strings', () => {
      // Empty string
      const emptyResult = ParameterTranslator.translateStringParameters('');
      expect(emptyResult).toBe('');

      // Whitespace only
      const whitespaceResult = ParameterTranslator.translateStringParameters('   ');
      expect(whitespaceResult).toBe('   ');

      // String with newlines (common in JSON payloads)
      const multilineResult = ParameterTranslator.translateStringParameters('line1\\nline2\\nline3');
      expect(multilineResult).toBe('line1\\nline2\\nline3');
    });

    test('should handle special characters and Unicode', () => {
      // Unicode characters (emojis, international text)
      const emojiResult = ParameterTranslator.translateStringParameters('Hello 👋 World 🌍');
      expect(emojiResult).toBe('Hello 👋 World 🌍');

      // Chinese characters (common in international apps)
      const chineseResult = ParameterTranslator.translateStringParameters('你好世界');
      expect(chineseResult).toBe('你好世界');

      // Arabic text (right-to-left)
      const arabicResult = ParameterTranslator.translateStringParameters('مرحبا بالعالم');
      expect(arabicResult).toBe('مرحبا بالعالم');

      // Special characters that might break parsing
      const specialCharsResult = ParameterTranslator.translateStringParameters('key:with"quotes\'and\\backslashes');
      expect(specialCharsResult).toBe('key:with"quotes\'and\\backslashes');
    });

    test('should handle very long strings', () => {
      // Long string (common in social media posts, comments)
      const longString = 'A'.repeat(10000);
      const result = ParameterTranslator.translateStringParameters(longString);
      expect(result).toBe(longString);
      expect(result.length).toBe(10000);
    });

    test('should handle null and undefined inputs', () => {
      // These might come from JavaScript applications
      expect(() => ParameterTranslator.translateStringParameters(null as any)).not.toThrow();
      expect(() => ParameterTranslator.translateStringParameters(undefined as any)).not.toThrow();
    });
  });

  describe('Numeric Parameter Translation', () => {
    test('should handle various number formats', () => {
      // Integer
      const intResult = ParameterTranslator.translateNumericParameters(42);
      expect(intResult).toBe(42);

      // Floating point
      const floatResult = ParameterTranslator.translateNumericParameters(3.14159);
      expect(floatResult).toBe(3.14159);

      // Negative numbers
      const negativeResult = ParameterTranslator.translateNumericParameters(-100);
      expect(negativeResult).toBe(-100);

      // Zero
      const zeroResult = ParameterTranslator.translateNumericParameters(0);
      expect(zeroResult).toBe(0);
    });

    test('should handle edge case numbers', () => {
      // Very large numbers (JavaScript safe integer limit)
      const largeResult = ParameterTranslator.translateNumericParameters(Number.MAX_SAFE_INTEGER);
      expect(largeResult).toBe(Number.MAX_SAFE_INTEGER);

      // Very small numbers
      const smallResult = ParameterTranslator.translateNumericParameters(Number.MIN_SAFE_INTEGER);
      expect(smallResult).toBe(Number.MIN_SAFE_INTEGER);

      // Scientific notation
      const scientificResult = ParameterTranslator.translateNumericParameters(1e10);
      expect(scientificResult).toBe(10000000000);
    });

    test('should handle special numeric values', () => {
      // Infinity (common in scoring systems)
      const infResult = ParameterTranslator.translateNumericParameters(Infinity);
      expect(infResult).toBe(Infinity);

      const negInfResult = ParameterTranslator.translateNumericParameters(-Infinity);
      expect(negInfResult).toBe(-Infinity);

      // NaN (should handle gracefully)
      const nanResult = ParameterTranslator.translateNumericParameters(NaN);
      expect(Number.isNaN(nanResult)).toBe(true);
    });

    test('should handle string numbers', () => {
      // String that looks like a number
      const stringNumberResult = ParameterTranslator.translateNumericParameters('123' as any);
      expect(typeof stringNumberResult).toBe('number');
      expect(stringNumberResult).toBe(123);

      // String with decimal
      const decimalStringResult = ParameterTranslator.translateNumericParameters('45.67' as any);
      expect(decimalStringResult).toBe(45.67);
    });
  });

  describe('Array Parameter Translation', () => {
    test('should handle mixed-type arrays', () => {
      // Array with different types (common in MSET, HMSET)
      const mixedArray = ['key1', 'value1', 'key2', 42, 'key3', true, 'key4', null];
      const result = ParameterTranslator.translateArrayParameters(mixedArray);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(8);
      expect(result[0]).toBe('key1');
      expect(result[3]).toBe(42);
      expect(result[5]).toBe(true);
    });

    test('should handle nested arrays', () => {
      // Nested arrays (might come from complex data structures)
      const nestedArray = [['a', 'b'], ['c', 'd'], ['e', 'f']];
      const result = ParameterTranslator.translateArrayParameters(nestedArray);
      
      expect(Array.isArray(result)).toBe(true);
      // Should flatten or handle nested structure appropriately
    });

    test('should handle empty arrays', () => {
      const emptyResult = ParameterTranslator.translateArrayParameters([]);
      expect(Array.isArray(emptyResult)).toBe(true);
      expect(emptyResult).toHaveLength(0);
    });

    test('should handle arrays with undefined and null values', () => {
      // Arrays with missing values (common in sparse data)
      const sparseArray = ['key1', undefined, 'key2', null, 'key3', ''];
      const result = ParameterTranslator.translateArrayParameters(sparseArray);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('key1');
      expect(result).toContain('key2');
      expect(result).toContain('key3');
    });

    test('should handle very large arrays', () => {
      // Large array (batch operations)
      const largeArray = Array.from({ length: 1000 }, (_, i) => `item_${i}`);
      const result = ParameterTranslator.translateArrayParameters(largeArray);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1000);
      expect(result[0]).toBe('item_0');
      expect(result[999]).toBe('item_999');
    });
  });

  describe('Object Parameter Translation', () => {
    test('should handle complex objects', () => {
      // Complex object (session data, user profiles)
      const complexObject = {
        user_id: 123456,
        username: 'john_doe',
        email: 'john@example.com',
        preferences: {
          theme: 'dark',
          notifications: true,
          language: 'en'
        },
        last_login: new Date().toISOString(),
        tags: ['premium', 'verified'],
        metadata: null
      };

      const result = ParameterTranslator.translateObjectParameters(complexObject);
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('user_id');
      expect(result).toHaveProperty('username');
    });

    test('should handle objects with special keys', () => {
      // Keys with special characters (common in i18n, config)
      const specialKeyObject = {
        'config:app:timeout': 5000,
        'i18n:messages:en:welcome': 'Welcome!',
        'user:123:session:abc': 'active',
        'cache:item:special-chars:key': 'value',
        'metrics:2024-01-01:pageviews': 1500
      };

      const result = ParameterTranslator.translateObjectParameters(specialKeyObject);
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('config:app:timeout');
      expect(result).toHaveProperty('i18n:messages:en:welcome');
    });

    test('should handle objects with circular references', () => {
      // Circular reference (potential memory leak scenario)
      const circularObj: any = { name: 'test' };
      circularObj.self = circularObj;

      // Should handle gracefully without infinite recursion
      expect(() => {
        ParameterTranslator.translateObjectParameters(circularObj);
      }).not.toThrow();
    });

    test('should handle objects with functions', () => {
      // Object with functions (should be ignored or handled)
      const objWithFunctions = {
        data: 'value',
        compute: () => 42,
        process: function() { return 'processed'; }
      };

      const result = ParameterTranslator.translateObjectParameters(objWithFunctions);
      expect(result).toHaveProperty('data');
      // Functions should be handled appropriately (ignored or converted)
    });
  });

  describe('Hash Set Parameter Translation', () => {
    test('should handle HMSET with various data types', () => {
      // Real-world HMSET scenarios
      const hmsetArgs = ['user:123', 'name', 'John Doe', 'age', 30, 'active', true, 'score', 95.5];
      const result = ParameterTranslator.translateHashSetParameters(hmsetArgs);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBe('user:123'); // key
      expect(result).toContain('name');
      expect(result).toContain('John Doe');
      expect(result).toContain('age');
      expect(result).toContain(30);
    });

    test('should handle HMSET with object format', () => {
      // Object format for HMSET (ioredis style)
      const key = 'session:abc123';
      const fields = {
        user_id: '456',
        login_time: Date.now().toString(),
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0 (compatible)',
        active: 'true',
        permissions: JSON.stringify(['read', 'write'])
      };

      const result = ParameterTranslator.translateHashSetParameters([key, fields]);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBe(key);
    });

    test('should handle empty hash sets', () => {
      const emptyHash = ParameterTranslator.translateHashSetParameters(['key:empty']);
      expect(Array.isArray(emptyHash)).toBe(true);
      expect(emptyHash).toContain('key:empty');
    });
  });

  describe('Set Operations Parameter Translation', () => {
    test('should handle SADD with multiple members', () => {
      // Social network followers, tags, categories
      const followers = ['user:123', 'user:456', 'user:789', 'user:101112'];
      const result = ParameterTranslator.translateSetParameters(['following:user:abc', ...followers]);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBe('following:user:abc');
      expect(result.slice(1)).toEqual(followers);
    });

    test('should handle set operations with special values', () => {
      // Tags with special characters, numbers, Unicode
      const tags = ['#javascript', '2024年', 'user:premium', 'level:99', '🚀rocket', 'test-tag'];
      const result = ParameterTranslator.translateSetParameters(['tags:post:123', ...tags]);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('#javascript');
      expect(result).toContain('🚀rocket');
    });
  });

  describe('Score/Rank Parameter Translation', () => {
    test('should handle ZADD with various score types', () => {
      // Leaderboard, ranking data
      const zaddArgs = [
        'leaderboard:game', 
        1000, 'player1',
        95.5, 'player2', 
        -50, 'player3',
        Infinity, 'cheater', // Infinity score
        0, 'newbie'
      ];
      
      const result = ParameterTranslator.translateScoreParameters(zaddArgs);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBe('leaderboard:game');
      expect(result).toContain(1000);
      expect(result).toContain('player1');
      expect(result).toContain(Infinity);
    });

    test('should handle timestamp-based scoring', () => {
      // Timeline, activity feed scoring
      const now = Date.now();
      const timelineArgs = [
        'timeline:user:123',
        now - 3600000, 'post:1',      // 1 hour ago
        now - 1800000, 'post:2',      // 30 minutes ago
        now, 'post:3'                 // now
      ];
      
      const result = ParameterTranslator.translateScoreParameters(timelineArgs);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('timeline:user:123');
      expect(result).toContain(now);
    });

    test('should handle floating point precision', () => {
      // Precise scoring (ratings, analytics)
      const preciseArgs = [
        'ratings:movie:123',
        4.7563, 'user:a',
        3.1415, 'user:b',
        2.7182, 'user:c'
      ];
      
      const result = ParameterTranslator.translateScoreParameters(preciseArgs);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain(4.7563);
      expect(result).toContain(3.1415);
    });
  });

  describe('Range Parameter Translation', () => {
    test('should handle various range formats', () => {
      // ZRANGE, LRANGE style parameters
      const numericRange = ParameterTranslator.translateRangeParameters([0, -1]);
      expect(Array.isArray(numericRange)).toBe(true);
      expect(numericRange).toEqual([0, -1]);

      // String range parameters (scores)
      const scoreRange = ParameterTranslator.translateRangeParameters(['0', '+inf']);
      expect(Array.isArray(scoreRange)).toBe(true);
      expect(scoreRange).toEqual(['0', '+inf']);
    });

    test('should handle infinity ranges', () => {
      // Common in ZRANGEBYSCORE
      const infinityRanges = [
        ['-inf', '+inf'],
        ['-inf', '100'],
        ['0', '+inf'],
        [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]
      ];

      for (const range of infinityRanges) {
        const result = ParameterTranslator.translateRangeParameters(range);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
      }
    });

    test('should handle limit parameters', () => {
      // LIMIT offset count
      const limitParams = ParameterTranslator.translateRangeParameters(['LIMIT', 10, 20]);
      expect(Array.isArray(limitParams)).toBe(true);
      expect(limitParams).toContain('LIMIT');
      expect(limitParams).toContain(10);
      expect(limitParams).toContain(20);
    });
  });

  describe('Command Option Translation', () => {
    test('should handle SET command options', () => {
      // SET with various options
      const setWithOptions = ParameterTranslator.translateCommandOptions(['key', 'value', 'EX', 300, 'NX']);
      expect(Array.isArray(setWithOptions)).toBe(true);
      expect(setWithOptions).toContain('EX');
      expect(setWithOptions).toContain(300);
      expect(setWithOptions).toContain('NX');
    });

    test('should handle SCAN cursor and pattern options', () => {
      // SCAN with MATCH and COUNT
      const scanOptions = ParameterTranslator.translateCommandOptions([0, 'MATCH', 'user:*', 'COUNT', 100]);
      expect(Array.isArray(scanOptions)).toBe(true);
      expect(scanOptions).toContain('MATCH');
      expect(scanOptions).toContain('user:*');
      expect(scanOptions).toContain('COUNT');
      expect(scanOptions).toContain(100);
    });

    test('should handle SORT command options', () => {
      // Complex SORT command
      const sortOptions = ParameterTranslator.translateCommandOptions([
        'mylist', 'BY', 'weight_*', 'GET', 'object_*', 'DESC', 'ALPHA', 'LIMIT', 0, 10
      ]);
      expect(Array.isArray(sortOptions)).toBe(true);
      expect(sortOptions).toContain('BY');
      expect(sortOptions).toContain('GET');
      expect(sortOptions).toContain('DESC');
      expect(sortOptions).toContain('ALPHA');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle null and undefined parameters gracefully', () => {
      // These might come from JavaScript applications with missing data
      expect(() => ParameterTranslator.translateStringParameters(null as any)).not.toThrow();
      expect(() => ParameterTranslator.translateNumericParameters(undefined as any)).not.toThrow();
      expect(() => ParameterTranslator.translateArrayParameters(null as any)).not.toThrow();
    });

    test('should handle type mismatches gracefully', () => {
      // Wrong types passed to translation functions
      expect(() => ParameterTranslator.translateNumericParameters('not-a-number' as any)).not.toThrow();
      expect(() => ParameterTranslator.translateArrayParameters('not-an-array' as any)).not.toThrow();
    });

    test('should handle very large parameter sets', () => {
      // Large parameter arrays (batch operations)
      const largeParamSet = Array.from({ length: 10000 }, (_, i) => `param_${i}`);
      expect(() => {
        ParameterTranslator.translateArrayParameters(largeParamSet);
      }).not.toThrow();
    });

    test('should handle parameters with control characters', () => {
      // Control characters that might break parsing
      const controlChars = 'text\x00with\x01control\x02chars\x03';
      const result = ParameterTranslator.translateStringParameters(controlChars);
      expect(typeof result).toBe('string');
    });

    test('should handle binary data as parameters', () => {
      // Binary data (might come from file uploads, images)
      const binaryData = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]); // PNG header
      expect(() => {
        ParameterTranslator.translateStringParameters(binaryData.toString('binary'));
      }).not.toThrow();
    });

    test('should handle parameters with extreme lengths', () => {
      // Very long key names (might cause issues)
      const longKey = 'key:' + 'a'.repeat(1000000); // 1MB key
      expect(() => {
        ParameterTranslator.translateStringParameters(longKey);
      }).not.toThrow();
    });

    test('should handle malformed JSON in parameters', () => {
      // Malformed JSON that might be passed as parameter
      const malformedJson = '{"incomplete": json data';
      expect(() => {
        ParameterTranslator.translateStringParameters(malformedJson);
      }).not.toThrow();
    });
  });

  describe('Performance and Memory Edge Cases', () => {
    test('should handle memory-intensive parameter translation', () => {
      // Large object with many properties
      const largeObject: Record<string, any> = {};
      for (let i = 0; i < 10000; i++) {
        largeObject[`property_${i}`] = `value_${i}_${'x'.repeat(100)}`;
      }

      const startTime = Date.now();
      const result = ParameterTranslator.translateObjectParameters(largeObject);
      const endTime = Date.now();

      expect(typeof result).toBe('object');
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle deeply nested parameter structures', () => {
      // Deep nesting that might cause stack overflow
      const deepObject: any = {};
      let current = deepObject;
      
      for (let i = 0; i < 100; i++) {
        current.next = { level: i };
        current = current.next;
      }

      expect(() => {
        ParameterTranslator.translateObjectParameters(deepObject);
      }).not.toThrow();
    });
  });
});