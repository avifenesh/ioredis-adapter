/**
 * Command Parameter Translation Layer
 * Converts ioredis command arguments to valkey-glide compatible formats
 */

import { RedisKey, RedisValue } from '../types';
import { TimeUnit } from '@valkey/valkey-glide';

export class ParameterTranslator {
  /**
   * Convert SET command arguments from ioredis format to valkey-glide format
   * ioredis: SET key value [EX seconds] [PX milliseconds] [NX|XX]
   * valkey-glide: set(key, value, options?)
   */
  static translateSetArgs(args: any[]): {
    key: string;
    value: string;
    options?: any;
  } {
    if (args.length < 2) {
      throw new Error('SET requires at least 2 arguments: key and value');
    }

    const [key, value, ...optionArgs] = args;
    
    // Validate key is not empty (ioredis compatibility)
    if (key === '' || key === null || key === undefined) {
      throw new Error('ERR wrong number of arguments for \'set\' command');
    }
    
    const result = {
      key: key.toString(),
      value: value.toString(),
      options: this.parseSetOptions(optionArgs),
    };

    return result;
  }

  /**
   * Parse SET command options
   */
  private static parseSetOptions(args: any[]): any {
    if (args.length === 0) return undefined;
    
    const options: any = {};
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      // Handle connect-redis object format: { expiration: { type: 'EX', value: 3600 } }
      if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
        if (arg.expiration) {
          const expiration = arg.expiration;
          if (expiration.type && expiration.value !== undefined) {
            switch (expiration.type.toUpperCase()) {
              case 'EX':
                options.expiry = {
                  type: TimeUnit.Seconds,
                  count: parseInt(expiration.value, 10)
                };
                break;
              case 'PX':
                options.expiry = {
                  type: TimeUnit.Milliseconds,
                  count: parseInt(expiration.value, 10)
                };
                break;
            }
          }
        }
        // Handle other object properties if needed
        if (arg.conditionalSet) {
          options.conditionalSet = arg.conditionalSet;
        }
        if (arg.returnOldValue) {
          options.returnOldValue = arg.returnOldValue;
        }
      }
      // Handle ioredis string format: 'EX', 1, 'NX', etc.
      else if (typeof arg === 'string') {
        const upperArg = arg.toUpperCase();
        
        switch (upperArg) {
          case 'EX':
            if (i + 1 < args.length) {
              options.expiry = {
                type: TimeUnit.Seconds,
                count: parseInt(args[++i], 10)
              };
            }
            break;
          case 'PX':
            if (i + 1 < args.length) {
              options.expiry = {
                type: TimeUnit.Milliseconds,
                count: parseInt(args[++i], 10)
              };
            }
            break;
          case 'NX':
            options.conditionalSet = 'onlyIfDoesNotExist';
            break;
          case 'XX':
            options.conditionalSet = 'onlyIfExists';
            break;
          case 'GET':
            options.returnOldValue = true;
            break;
        }
      }
    }
    
    return Object.keys(options).length > 0 ? options : undefined;
  }

  /**
   * Convert MGET arguments from ioredis variadic/array format to valkey-glide array format
   * ioredis: MGET key1 key2 key3 OR MGET [key1, key2, key3]
   * valkey-glide: mget([key1, key2, key3])
   */
  static translateMGetArgs(args: any[]): string[] {
    if (args.length === 0) {
      throw new Error('MGET requires at least 1 key');
    }

    // Handle both variadic and array forms
    if (args.length === 1 && Array.isArray(args[0])) {
      return args[0].map((key: RedisKey) => key.toString());
    }
    
    return args.map((key: RedisKey) => key.toString());
  }

  /**
   * Convert MSET arguments from ioredis variadic/object format to valkey-glide object format
   * ioredis: MSET key1 val1 key2 val2 OR MSET {key1: val1, key2: val2}
   * valkey-glide: mset({key1: val1, key2: val2})
   */
  static translateMSetArgs(args: any[]): Record<string, string> {
    if (args.length === 0) {
      throw new Error('MSET requires at least 1 key-value pair');
    }

    // Handle object format
    if (args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0])) {
      const result: Record<string, string> = {};
      for (const [key, value] of Object.entries(args[0])) {
        result[key] = String(value);
      }
      return result;
    }
    
    // Handle variadic format
    if (args.length % 2 !== 0) {
      throw new Error('MSET requires an even number of arguments (key-value pairs)');
    }
    
    const result: Record<string, string> = {};
    for (let i = 0; i < args.length; i += 2) {
      result[args[i].toString()] = args[i + 1].toString();
    }
    
    return result;
  }

  /**
   * Convert HSET arguments from ioredis variadic/object format to valkey-glide format
   * ioredis: HSET key field value [field value ...] OR HSET key {field: value, ...}
   * valkey-glide: hset(key, {field: value, ...})
   */
  static translateHSetArgs(args: any[]): {
    key: string;
    fieldValues: Record<string, string>;
  } {
    if (args.length < 3 && !(args.length === 2 && typeof args[1] === 'object')) {
      throw new Error('HSET requires at least 3 arguments: key, field, value');
    }

    const [key, ...rest] = args;
    
    // Handle object format: HSET key {field: value, ...}
    if (rest.length === 1 && typeof rest[0] === 'object' && !Array.isArray(rest[0])) {
      const fieldValues: Record<string, string> = {};
      for (const [field, value] of Object.entries(rest[0])) {
        fieldValues[field] = String(value);
      }
      return { key: key.toString(), fieldValues };
    }
    
    // Handle variadic format: HSET key field1 value1 field2 value2 ...
    if (rest.length % 2 !== 0) {
      throw new Error('HSET requires an even number of field-value arguments');
    }
    
    const fieldValues: Record<string, string> = {};
    for (let i = 0; i < rest.length; i += 2) {
      fieldValues[rest[i].toString()] = rest[i + 1].toString();
    }
    
    return { key: key.toString(), fieldValues };
  }

  /**
   * Convert HMGET arguments from ioredis variadic/array format to valkey-glide array format
   * ioredis: HMGET key field1 field2 ... OR HMGET key [field1, field2, ...]
   * valkey-glide: hmget(key, [field1, field2, ...])
   */
  static translateHMGetArgs(args: any[]): {
    key: string;
    fields: string[];
  } {
    if (args.length < 2) {
      throw new Error('HMGET requires at least 2 arguments: key and field');
    }

    const [key, ...rest] = args;
    
    // Handle array format: HMGET key [field1, field2, ...]
    if (rest.length === 1 && Array.isArray(rest[0])) {
      return {
        key: key.toString(),
        fields: rest[0].map((field: string) => field.toString()),
      };
    }
    
    // Handle variadic format: HMGET key field1 field2 ...
    return {
      key: key.toString(),
      fields: rest.map((field: string) => field.toString()),
    };
  }

  /**
   * Convert list push arguments from ioredis variadic/array format to valkey-glide array format
   * ioredis: LPUSH key element1 element2 ... OR LPUSH key [element1, element2, ...]
   * valkey-glide: lpush(key, [element1, element2, ...])
   */
  static translateListPushArgs(args: any[]): {
    key: string;
    elements: string[];
  } {
    if (args.length < 2) {
      throw new Error('List push requires at least 2 arguments: key and element');
    }

    const [key, ...rest] = args;
    
    // Handle array format: LPUSH key [element1, element2, ...]
    if (rest.length === 1 && Array.isArray(rest[0])) {
      return {
        key: key.toString(),
        elements: rest[0].map((element: RedisValue) => element.toString()),
      };
    }
    
    // Handle variadic format: LPUSH key element1 element2 ...
    return {
      key: key.toString(),
      elements: rest.map((element: RedisValue) => element.toString()),
    };
  }

  /**
   * Convert DEL arguments from ioredis variadic format to valkey-glide array format
   * ioredis: DEL key1 key2 key3 ...
   * valkey-glide: del([key1, key2, key3, ...])
   */
  static translateDelArgs(args: any[]): string[] {
    if (args.length === 0) {
      throw new Error('DEL requires at least 1 key');
    }
    
    return args.map((key: RedisKey) => key.toString());
  }

  /**
   * Convert EXISTS arguments from ioredis variadic format to valkey-glide array format
   * ioredis: EXISTS key1 key2 key3 ...
   * valkey-glide: exists([key1, key2, key3, ...])
   */
  static translateExistsArgs(args: any[]): string[] {
    if (args.length === 0) {
      throw new Error('EXISTS requires at least 1 key');
    }
    
    return args.map((key: RedisKey) => key.toString());
  }

  /**
   * Convert TimeUnit strings to valkey-glide TimeUnit enum values
   */
  static convertTimeUnit(unit: string): string {
    switch (unit.toUpperCase()) {
      case 'EX':
      case 'SECONDS':
        return 'Seconds';
      case 'PX':
      case 'MILLISECONDS':
        return 'Milliseconds';
      default:
        throw new Error(`Unknown time unit: ${unit}`);
    }
  }

  /**
   * Convert ioredis conditional set options to valkey-glide format
   */
  static convertConditionalSet(condition: string): string {
    switch (condition.toUpperCase()) {
      case 'NX':
        return 'onlyIfDoesNotExist';
      case 'XX':
        return 'onlyIfExists';
      default:
        throw new Error(`Unknown conditional set option: ${condition}`);
    }
  }

  /**
   * Normalize Redis key to string format
   */
  static normalizeKey(key: RedisKey): string {
    return key.toString();
  }

  /**
   * Normalize Redis value to string format
   */
  static normalizeValue(value: RedisValue): string {
    return value.toString();
  }

  /**
   * Convert GlideString to string (for return values)
   */
  static convertGlideString(value: any): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    return value.toString();
  }

  /**
   * Convert GlideString array to string array
   */
  static convertGlideStringArray(values: any[]): (string | null)[] {
    return values.map(value => this.convertGlideString(value));
  }

  /**
   * Convert GlideRecord to plain object
   */
  static convertGlideRecord(record: any): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(record)) {
      result[key] = value?.toString() || '';
    }
    return result;
  }
}