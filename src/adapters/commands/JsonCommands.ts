/**
 * ValkeyJSON / RedisJSON Commands
 * 
 * Implements JSON operations compatible with ValkeyJSON module and RedisJSON v2
 * Uses customCommand for full compatibility with Valkey JSON module
 * 
 * API Reference: https://github.com/valkey-io/valkey-json
 * RedisJSON compatibility: v2 API compatible
 */

import { GlideClient, GlideClusterClient } from '@valkey/valkey-glide';
import { RedisKey } from '../../types';

export class JsonCommands {
  /**
   * Set a JSON document
   * JSON.SET key path value [NX|XX]
   */
  static async jsonSet(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path: string,
    value: any,
    options?: 'NX' | 'XX'
  ): Promise<string | null> {
    const normalizedKey = String(key);
    const jsonValue = JSON.stringify(value);
    const args = ['JSON.SET', normalizedKey, path, jsonValue];
    
    if (options) {
      args.push(options);
    }
    
    
    const result = await client.customCommand(args);
    return result === 'OK' ? 'OK' : null;
  }

  /**
   * Get a JSON document or path
   * JSON.GET key [path ...] [INDENT indent] [NEWLINE newline] [SPACE space]
   */
  static async jsonGet(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path?: string | string[],
    options?: {
      indent?: string;
      newline?: string;
      space?: string;
    }
  ): Promise<string | null> {
    const normalizedKey = String(key);
    const args = ['JSON.GET', normalizedKey];
    
    if (path) {
      if (Array.isArray(path)) {
        args.push(...path);
      } else {
        args.push(path);
      }
    }
    
    if (options) {
      if (options.indent !== undefined) {
        args.push('INDENT', options.indent);
      }
      if (options.newline !== undefined) {
        args.push('NEWLINE', options.newline);
      }
      if (options.space !== undefined) {
        args.push('SPACE', options.space);
      }
    }
    
    const result = await client.customCommand(args);
    if (result === null || result === undefined) {
      return null;
    }
    
    const resultStr = String(result);
    
    // Handle JSONPath queries that return arrays - unwrap single element arrays
    if (path && typeof path === 'string' && path.startsWith('$.')) {
      try {
        const parsed = JSON.parse(resultStr);
        // If it's an array with one element, unwrap it for ioredis compatibility
        if (Array.isArray(parsed) && parsed.length === 1) {
          return JSON.stringify(parsed[0]);
        }
        // If it's an empty array, return null for non-existent paths
        if (Array.isArray(parsed) && parsed.length === 0) {
          return null;
        }
      } catch {
        // If parsing fails, return as-is
      }
    }
    
    return resultStr;
  }

  /**
   * Delete a JSON path
   * JSON.DEL key [path]
   */
  static async jsonDel(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path?: string
  ): Promise<number> {
    const normalizedKey = String(key);
    const args = ['JSON.DEL', normalizedKey];
    
    if (path) {
      args.push(path);
    }
    
    const result = await client.customCommand(args);
    return Number(result) || 0;
  }

  /**
   * Clear a JSON path (set to null/empty)
   * JSON.CLEAR key [path]
   */
  static async jsonClear(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path?: string
  ): Promise<number> {
    const normalizedKey = String(key);
    const args = ['JSON.CLEAR', normalizedKey];
    
    if (path) {
      args.push(path);
    }
    
    const result = await client.customCommand(args);
    return Number(result) || 0;
  }

  /**
   * Get the type of a JSON path
   * JSON.TYPE key [path]
   */
  static async jsonType(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path?: string
  ): Promise<string | null> {
    const normalizedKey = String(key);
    const args = ['JSON.TYPE', normalizedKey];
    
    if (path) {
      args.push(path);
    }
    
    const result = await client.customCommand(args);
    
    if (result === null || result === undefined) {
      return null;
    }
    
    // Handle JSONPath queries that return arrays - unwrap single element arrays
    if (path && path.startsWith('$.')) {
      if (Array.isArray(result)) {
        return result.length > 0 ? String(result[0]) : null;
      }
      // Try to parse if it's a JSON string that represents an array
      try {
        const parsed = JSON.parse(String(result));
        if (Array.isArray(parsed)) {
          return parsed.length > 0 ? String(parsed[0]) : null;
        }
      } catch {
        // Not a JSON string, continue
      }
    }
    
    return String(result);
  }

  /**
   * Increment a numeric JSON value
   * JSON.NUMINCRBY key path value
   */
  static async jsonNumIncrBy(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path: string,
    value: number
  ): Promise<string | null> {
    const normalizedKey = String(key);
    const result = await client.customCommand([
      'JSON.NUMINCRBY',
      normalizedKey,
      path,
      value.toString()
    ]);
    
    if (result === null || result === undefined) {
      return null;
    }
    
    // Handle JSONPath queries that return arrays - unwrap single element arrays
    if (path.startsWith('$.') && Array.isArray(result)) {
      return result.length > 0 ? String(result[0]) : null;
    }
    
    return String(result);
  }

  /**
   * Multiply a numeric JSON value
   * JSON.NUMMULTBY key path value
   */
  static async jsonNumMultBy(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path: string,
    value: number
  ): Promise<string | null> {
    const normalizedKey = String(key);
    const result = await client.customCommand([
      'JSON.NUMMULTBY',
      normalizedKey,
      path,
      value.toString()
    ]);
    return result as string | null;
  }

  /**
   * Append to a JSON string
   * JSON.STRAPPEND key [path] value
   */
  static async jsonStrAppend(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path: string,
    value: string
  ): Promise<number> {
    const normalizedKey = String(key);
    const jsonValue = JSON.stringify(value);
    const result = await client.customCommand([
      'JSON.STRAPPEND',
      normalizedKey,
      path,
      jsonValue
    ]);
    return Number(result) || 0;
  }

  /**
   * Get the length of a JSON string
   * JSON.STRLEN key [path]
   */
  static async jsonStrLen(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path?: string
  ): Promise<number | null> {
    const normalizedKey = String(key);
    const args = ['JSON.STRLEN', normalizedKey];
    
    if (path) {
      args.push(path);
    }
    
    const result = await client.customCommand(args);
    return result !== null ? Number(result) : null;
  }

  /**
   * Append values to a JSON array
   * JSON.ARRAPPEND key path value [value ...]
   */
  static async jsonArrAppend(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path: string,
    ...values: any[]
  ): Promise<number> {
    const normalizedKey = String(key);
    
    // Simplified approach - always JSON.stringify everything
    const jsonValues = values.map(v => JSON.stringify(v));
    
    
    const result = await client.customCommand([
      'JSON.ARRAPPEND',
      normalizedKey,
      path,
      ...jsonValues
    ]);
    
    // Handle JSONPath queries that return arrays - unwrap single element arrays
    if (path.startsWith('$.') && Array.isArray(result)) {
      return result.length > 0 ? Number(result[0]) || 0 : 0;
    }
    
    return Number(result) || 0;
  }

  /**
   * Insert values into a JSON array
   * JSON.ARRINSERT key path index value [value ...]
   */
  static async jsonArrInsert(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path: string,
    index: number,
    ...values: any[]
  ): Promise<number> {
    const normalizedKey = String(key);
    const jsonValues = values.map(v => typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v));
    const result = await client.customCommand([
      'JSON.ARRINSERT',
      normalizedKey,
      path,
      index.toString(),
      ...jsonValues
    ]);
    return Number(result) || 0;
  }

  /**
   * Get the length of a JSON array
   * JSON.ARRLEN key [path]
   */
  static async jsonArrLen(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path?: string
  ): Promise<number | null> {
    const normalizedKey = String(key);
    const args = ['JSON.ARRLEN', normalizedKey];
    
    if (path) {
      args.push(path);
    }
    
    try {
      const result = await client.customCommand(args);
      
      if (result === null || result === undefined) {
        return null;
      }
      
      // Handle JSONPath queries that return arrays - unwrap single element arrays
      if (path && path.startsWith('$.') && Array.isArray(result)) {
        // If the array is empty, it means the path doesn't exist or is not an array
        if (result.length === 0) {
          return null;
        }
        const value = result[0];
        return value !== null ? Number(value) : null;
      }
      
      return result !== null ? Number(result) : null;
    } catch (error) {
      // Return null for type mismatches or other errors
      return null;
    }
  }

  /**
   * Remove and return element from JSON array
   * JSON.ARRPOP key [path [index]]
   */
  static async jsonArrPop(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path?: string,
    index?: number
  ): Promise<string | null> {
    const normalizedKey = String(key);
    const args = ['JSON.ARRPOP', normalizedKey];
    
    if (path) {
      args.push(path);
      if (index !== undefined) {
        args.push(index.toString());
      }
    }
    
    const result = await client.customCommand(args);
    return result as string | null;
  }

  /**
   * Trim a JSON array
   * JSON.ARRTRIM key path start stop
   */
  static async jsonArrTrim(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path: string,
    start: number,
    stop: number
  ): Promise<number> {
    const normalizedKey = String(key);
    const result = await client.customCommand([
      'JSON.ARRTRIM',
      normalizedKey,
      path,
      start.toString(),
      stop.toString()
    ]);
    return Number(result) || 0;
  }

  /**
   * Get keys of a JSON object
   * JSON.OBJKEYS key [path]
   */
  static async jsonObjKeys(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path?: string
  ): Promise<string[] | null> {
    const normalizedKey = String(key);
    const args = ['JSON.OBJKEYS', normalizedKey];
    
    if (path) {
      args.push(path);
    }
    
    try {
      const result = await client.customCommand(args);
      
      
      if (result === null || result === undefined) {
        return null;
      }
      
      // Handle JSONPath queries that return arrays - unwrap single element arrays
      if (path && path.startsWith('$.') && Array.isArray(result)) {
        // If the outer array is empty, it means the path doesn't exist or is not an object
        if (result.length === 0) {
          return null;
        }
        // If the first element is an array, return it (unwrap one level)
        if (Array.isArray(result[0])) {
          // If the unwrapped array is empty, it's a type mismatch
          if (result[0].length === 0) {
            return null;
          }
          return result[0] as string[];
        }
        // If the first element is null or empty array, return null for type mismatch
        if (result[0] === null || (Array.isArray(result[0]) && result[0].length === 0)) {
          return null;
        }
        // If it's not an array but an empty result, return null for type mismatch
        return null;
      }
      
      // Handle regular (non-JSONPath) queries
      if (Array.isArray(result)) {
        // If it's an empty array, return null for type mismatch or non-existent key
        if (result.length === 0) {
          return null;
        }
        return result as string[];
      }
      
      return null;
    } catch (error) {
      // Return null for type mismatches or other errors
      return null;
    }
  }

  /**
   * Get the number of keys in a JSON object
   * JSON.OBJLEN key [path]
   */
  static async jsonObjLen(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path?: string
  ): Promise<number | null> {
    const normalizedKey = String(key);
    const args = ['JSON.OBJLEN', normalizedKey];
    
    if (path) {
      args.push(path);
    }
    
    const result = await client.customCommand(args);
    return result !== null ? Number(result) : null;
  }

  /**
   * Toggle a boolean JSON value
   * JSON.TOGGLE key path
   */
  static async jsonToggle(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path: string
  ): Promise<number> {
    const normalizedKey = String(key);
    const result = await client.customCommand([
      'JSON.TOGGLE',
      normalizedKey,
      path
    ]);
    
    // Handle JSONPath queries that return arrays - unwrap single element arrays
    if (path.startsWith('$.') && Array.isArray(result)) {
      return result.length > 0 ? Number(result[0]) || 0 : 0;
    }
    
    return Number(result) || 0;
  }

  /**
   * Get debug information about a JSON document
   * JSON.DEBUG subcommand key [path]
   */
  static async jsonDebug(
    client: GlideClient | GlideClusterClient,
    subcommand: 'MEMORY' | 'DEPTH' | 'FIELDS',
    key: RedisKey,
    path?: string
  ): Promise<any> {
    const normalizedKey = String(key);
    const args = ['JSON.DEBUG', subcommand, normalizedKey];
    
    if (path) {
      args.push(path);
    }
    
    return await client.customCommand(args);
  }

  /**
   * Alias for JSON.DEL (RedisJSON v1 compatibility)
   * JSON.FORGET key [path]
   */
  static async jsonForget(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path?: string
  ): Promise<number> {
    return JsonCommands.jsonDel(client, key, path);
  }

  /**
   * Convert JSON to RESP format
   * JSON.RESP key [path]
   */
  static async jsonResp(
    client: GlideClient | GlideClusterClient,
    key: RedisKey,
    path?: string
  ): Promise<any> {
    const normalizedKey = String(key);
    const args = ['JSON.RESP', normalizedKey];
    
    if (path) {
      args.push(path);
    }
    
    return await client.customCommand(args);
  }
}