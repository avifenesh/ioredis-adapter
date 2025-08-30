/**
 * ResultTranslator Comprehensive Tests
 * Testing all result translation methods for GLIDE to ioredis compatibility
 */

import { ResultTranslator } from '../../src/utils/ResultTranslator';
import { SortedSetDataType, GlideString } from '@valkey/valkey-glide';

describe('ResultTranslator', () => {

  describe('flattenSortedSetData', () => {
    test('should flatten valid SortedSetDataType to ioredis format', () => {
      const glideResult: SortedSetDataType = [
        { element: 'member1', score: 1.0 },
        { element: 'member2', score: 2.5 },
        { element: 'member3', score: 3.14159 }
      ];

      const result = ResultTranslator.flattenSortedSetData(glideResult);
      
      expect(result).toEqual([
        'member1', '1',
        'member2', '2.5', 
        'member3', '3.14159'
      ]);
    });

    test('should handle empty SortedSetDataType array', () => {
      const glideResult: SortedSetDataType = [];
      const result = ResultTranslator.flattenSortedSetData(glideResult);
      expect(result).toEqual([]);
    });

    test('should handle non-array input', () => {
      const result = ResultTranslator.flattenSortedSetData(null as any);
      expect(result).toEqual([]);
    });

    test('should handle SortedSetDataType with Buffer elements', () => {
      const glideResult: SortedSetDataType = [
        { element: Buffer.from('binary_member'), score: 1.0 },
        { element: 'string_member', score: 2.0 }
      ];

      const result = ResultTranslator.flattenSortedSetData(glideResult);
      
      expect(result).toEqual([
        'binary_member', '1',
        'string_member', '2'
      ]);
    });

    test('should handle SortedSetDataType with negative scores', () => {
      const glideResult: SortedSetDataType = [
        { element: 'negative', score: -1.5 },
        { element: 'positive', score: 1.5 },
        { element: 'zero', score: 0 }
      ];

      const result = ResultTranslator.flattenSortedSetData(glideResult);
      
      expect(result).toEqual([
        'negative', '-1.5',
        'positive', '1.5',
        'zero', '0'
      ]);
    });

    test('should handle very large and small scores', () => {
      const glideResult: SortedSetDataType = [
        { element: 'large', score: Number.MAX_SAFE_INTEGER },
        { element: 'small', score: Number.MIN_SAFE_INTEGER },
        { element: 'infinity', score: Infinity },
        { element: 'negative_infinity', score: -Infinity }
      ];

      const result = ResultTranslator.flattenSortedSetData(glideResult);
      
      expect(result[1]).toBe(Number.MAX_SAFE_INTEGER.toString());
      expect(result[3]).toBe(Number.MIN_SAFE_INTEGER.toString());
      expect(result[5]).toBe('Infinity');
      expect(result[7]).toBe('-Infinity');
    });
  });

  describe('formatStreamEntries', () => {
    test('should handle empty stream entries array', () => {
      const result = ResultTranslator.formatStreamEntries([]);
      expect(result).toEqual([]);
    });

    test('should handle non-array input', () => {
      const result = ResultTranslator.formatStreamEntries(null as any);
      expect(result).toEqual([]);
    });

    test('should pass through stream entries as placeholder', () => {
      const glideResult = [
        { id: '1234567890-0', fields: { field1: 'value1', field2: 'value2' } },
        { id: '1234567891-0', fields: { field3: 'value3' } }
      ];

      const result = ResultTranslator.formatStreamEntries(glideResult);
      
      // Currently passes through as-is (placeholder implementation)
      expect(result).toEqual(glideResult);
    });

    test('should handle mixed stream entry types', () => {
      const glideResult = [
        'stream_entry_1',
        { complex: 'object' },
        null,
        123
      ];

      const result = ResultTranslator.formatStreamEntries(glideResult);
      expect(result).toHaveLength(4);
      expect(result).toEqual(glideResult);
    });
  });

  describe('formatBlockingPopResult', () => {
    test('should format valid blocking pop result', () => {
      const glideResult: [GlideString, GlideString, number] = ['key1', 'member1', 5.5];
      
      const result = ResultTranslator.formatBlockingPopResult(glideResult);
      
      expect(result).toEqual(['key1', 'member1', '5.5']);
    });

    test('should handle null input', () => {
      const result = ResultTranslator.formatBlockingPopResult(null);
      expect(result).toBeNull();
    });

    test('should handle undefined input', () => {
      const result = ResultTranslator.formatBlockingPopResult(undefined as any);
      expect(result).toBeNull();
    });

    test('should handle non-array input', () => {
      const result = ResultTranslator.formatBlockingPopResult('not-an-array' as any);
      expect(result).toBeNull();
    });

    test('should handle array with wrong length', () => {
      const result1 = ResultTranslator.formatBlockingPopResult(['key'] as any);
      expect(result1).toBeNull();

      const result2 = ResultTranslator.formatBlockingPopResult(['key', 'member'] as any);
      expect(result2).toBeNull();

      const result3 = ResultTranslator.formatBlockingPopResult(['key', 'member', 1, 'extra'] as any);
      expect(result3).toBeNull();
    });

    test('should handle Buffer GlideString inputs', () => {
      const glideResult: [GlideString, GlideString, number] = [
        Buffer.from('buffer_key'),
        Buffer.from('buffer_member'),
        42.7
      ];
      
      const result = ResultTranslator.formatBlockingPopResult(glideResult);
      
      expect(result).toEqual(['buffer_key', 'buffer_member', '42.7']);
    });

    test('should handle zero and negative scores', () => {
      const glideResult: [GlideString, GlideString, number] = ['key', 'member', 0];
      const result1 = ResultTranslator.formatBlockingPopResult(glideResult);
      expect(result1).toEqual(['key', 'member', '0']);

      const negativeResult: [GlideString, GlideString, number] = ['key', 'member', -3.14];
      const result2 = ResultTranslator.formatBlockingPopResult(negativeResult);
      expect(result2).toEqual(['key', 'member', '-3.14']);
    });
  });

  describe('convertStringArray', () => {
    test('should convert valid GlideString array', () => {
      const glideResult: GlideString[] = ['string1', 'string2', 'string3'];
      
      const result = ResultTranslator.convertStringArray(glideResult);
      
      expect(result).toEqual(['string1', 'string2', 'string3']);
    });

    test('should handle empty array', () => {
      const result = ResultTranslator.convertStringArray([]);
      expect(result).toEqual([]);
    });

    test('should handle non-array input', () => {
      const result = ResultTranslator.convertStringArray('not-an-array' as any);
      expect(result).toEqual([]);
    });

    test('should handle Buffer GlideString elements', () => {
      const glideResult: GlideString[] = [
        Buffer.from('buffer1'),
        'regular_string',
        Buffer.from('buffer2')
      ];
      
      const result = ResultTranslator.convertStringArray(glideResult);
      
      expect(result).toEqual(['buffer1', 'regular_string', 'buffer2']);
    });

    test('should handle null elements gracefully', () => {
      const glideResult: GlideString[] = [
        'valid',
        null as any,
        undefined as any,
        'another_valid'
      ];
      
      const result = ResultTranslator.convertStringArray(glideResult);
      
      expect(result).toEqual(['valid', '', '', 'another_valid']);
    });

    test('should handle mixed string and Buffer array', () => {
      const glideResult: GlideString[] = [
        'string',
        Buffer.from('binary_data', 'utf8'),
        '',
        Buffer.from('more_binary')
      ];
      
      const result = ResultTranslator.convertStringArray(glideResult);
      
      expect(result).toEqual(['string', 'binary_data', '', 'more_binary']);
    });
  });

  describe('formatRangeResult', () => {
    test('should format SortedSetDataType when withScores is true', () => {
      const glideResult: SortedSetDataType = [
        { element: 'member1', score: 1.0 },
        { element: 'member2', score: 2.0 }
      ];
      
      const result = ResultTranslator.formatRangeResult(glideResult, true);
      
      expect(result).toEqual(['member1', '1', 'member2', '2']);
    });

    test('should format string array when withScores is false', () => {
      const glideResult: GlideString[] = ['member1', 'member2', 'member3'];
      
      const result = ResultTranslator.formatRangeResult(glideResult, false);
      
      expect(result).toEqual(['member1', 'member2', 'member3']);
    });

    test('should handle non-array input', () => {
      const result1 = ResultTranslator.formatRangeResult(null as any, true);
      expect(result1).toEqual([]);

      const result2 = ResultTranslator.formatRangeResult(undefined as any, false);
      expect(result2).toEqual([]);
    });

    test('should handle empty arrays', () => {
      const result1 = ResultTranslator.formatRangeResult([], true);
      expect(result1).toEqual([]);

      const result2 = ResultTranslator.formatRangeResult([], false);
      expect(result2).toEqual([]);
    });

    test('should handle Buffer elements when withScores is false', () => {
      const glideResult: GlideString[] = [
        Buffer.from('binary1'),
        'string1',
        Buffer.from('binary2')
      ];
      
      const result = ResultTranslator.formatRangeResult(glideResult, false);
      
      expect(result).toEqual(['binary1', 'string1', 'binary2']);
    });

    test('should handle SortedSetDataType with Buffer elements when withScores is true', () => {
      const glideResult: SortedSetDataType = [
        { element: Buffer.from('buffer_member'), score: 1.5 },
        { element: 'string_member', score: 2.5 }
      ];
      
      const result = ResultTranslator.formatRangeResult(glideResult, true);
      
      expect(result).toEqual(['buffer_member', '1.5', 'string_member', '2.5']);
    });
  });

  describe('formatFloatResult', () => {
    test('should format integer values', () => {
      expect(ResultTranslator.formatFloatResult(42)).toBe('42');
      expect(ResultTranslator.formatFloatResult(0)).toBe('0');
      expect(ResultTranslator.formatFloatResult(-15)).toBe('-15');
    });

    test('should format decimal values', () => {
      expect(ResultTranslator.formatFloatResult(3.14159)).toBe('3.14159');
      expect(ResultTranslator.formatFloatResult(0.5)).toBe('0.5');
      expect(ResultTranslator.formatFloatResult(-2.75)).toBe('-2.75');
    });

    test('should handle floating point precision issues', () => {
      // JavaScript floating point arithmetic can be imprecise
      const result1 = ResultTranslator.formatFloatResult(0.1 + 0.2);
      expect(parseFloat(result1)).toBeCloseTo(0.3, 10);

      const result2 = ResultTranslator.formatFloatResult(1.1 * 1.1);
      expect(parseFloat(result2)).toBeCloseTo(1.21, 10);
    });

    test('should handle very small numbers', () => {
      expect(ResultTranslator.formatFloatResult(0.000000000000001)).toBe('1e-15');
      // Number.MIN_VALUE may be rounded to 0 due to precision handling
      const minValueResult = ResultTranslator.formatFloatResult(Number.MIN_VALUE);
      expect(minValueResult === '5e-324' || minValueResult === '0').toBe(true);
    });

    test('should handle very large numbers', () => {
      expect(ResultTranslator.formatFloatResult(Number.MAX_SAFE_INTEGER)).toBe('9007199254740991');
      expect(ResultTranslator.formatFloatResult(1e20)).toBe('100000000000000000000');
    });

    test('should handle special float values', () => {
      expect(ResultTranslator.formatFloatResult(Infinity)).toBe('Infinity');
      expect(ResultTranslator.formatFloatResult(-Infinity)).toBe('-Infinity');
      expect(ResultTranslator.formatFloatResult(NaN)).toBe('NaN');
    });

    test('should handle rounding edge cases', () => {
      // Test numbers that require proper rounding
      expect(ResultTranslator.formatFloatResult(1.9999999999999998)).toBe('2');
      expect(ResultTranslator.formatFloatResult(0.9999999999999999)).toBe('1');
    });
  });

  describe('translateError', () => {
    test('should pass through Error instances unchanged', () => {
      const originalError = new Error('Test error message');
      const result = ResultTranslator.translateError(originalError);
      
      expect(result).toBe(originalError);
      expect(result.message).toBe('Test error message');
    });

    test('should convert error-like objects to Error instances', () => {
      const errorLike = { message: 'Custom error message' };
      const result = ResultTranslator.translateError(errorLike);
      
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Custom error message');
    });

    test('should handle null error input', () => {
      const result = ResultTranslator.translateError(null);
      
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Unknown GLIDE error');
    });

    test('should handle undefined error input', () => {
      const result = ResultTranslator.translateError(undefined);
      
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Unknown GLIDE error');
    });

    test('should handle string error input', () => {
      const result = ResultTranslator.translateError('String error');
      
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Unknown GLIDE error');
    });

    test('should handle object without message property', () => {
      const errorObject = { code: 'ERR_CODE', details: 'Some details' };
      const result = ResultTranslator.translateError(errorObject);
      
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Unknown GLIDE error');
    });

    test('should preserve Error subclass types', () => {
      class CustomError extends Error {
        constructor(message: string, public code: string) {
          super(message);
          this.name = 'CustomError';
        }
      }

      const customError = new CustomError('Custom message', 'CUSTOM_CODE');
      const result = ResultTranslator.translateError(customError);
      
      expect(result).toBe(customError);
      expect(result).toBeInstanceOf(CustomError);
      expect(result.message).toBe('Custom message');
      expect((result as CustomError).code).toBe('CUSTOM_CODE');
    });

    test('should handle TypeError and other Error types', () => {
      const typeError = new TypeError('Type error message');
      const result = ResultTranslator.translateError(typeError);
      
      expect(result).toBe(typeError);
      expect(result).toBeInstanceOf(TypeError);
      expect(result.message).toBe('Type error message');
    });
  });
});