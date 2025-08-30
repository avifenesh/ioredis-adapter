/**
 * Sorted Set Commands - Redis sorted set operations
 */

import { GlideClient, RangeByScore, Boundary } from '@valkey/valkey-glide';
import { RedisKey, RedisValue } from '../../types';
import { ParameterTranslator } from '../../utils/ParameterTranslator';

export class ZSetCommands {
  constructor(private getClient: () => Promise<GlideClient>) {}

  async zadd(key: RedisKey, ...args: any[]): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    // Parse score-member pairs
    const scoreMemberPairs: Record<string, number> = {};
    for (let i = 0; i < args.length; i += 2) {
      const score = Number(args[i]);
      const member = ParameterTranslator.normalizeValue(args[i + 1]);
      scoreMemberPairs[member] = score;
    }
    
    return await client.zadd(normalizedKey, scoreMemberPairs);
  }

  async zrem(key: RedisKey, ...members: RedisValue[]): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedMembers = members.map(ParameterTranslator.normalizeValue);
    return await client.zrem(normalizedKey, normalizedMembers);
  }

  async zcard(key: RedisKey): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.zcard(normalizedKey);
  }

  async zscore(key: RedisKey, member: RedisValue): Promise<string | null> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedMember = ParameterTranslator.normalizeValue(member);
    const result = await client.zscore(normalizedKey, normalizedMember);
    if (result === null) return null;
    
    const scoreStr = result.toString();
    // Normalize infinity values to match ioredis format
    if (scoreStr === '-Infinity') return '-inf';
    if (scoreStr === 'Infinity') return 'inf';
    return scoreStr;
  }

  async zrank(key: RedisKey, member: RedisValue): Promise<number | null> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedMember = ParameterTranslator.normalizeValue(member);
    return await client.zrank(normalizedKey, normalizedMember);
  }

  async zrevrank(key: RedisKey, member: RedisValue): Promise<number | null> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedMember = ParameterTranslator.normalizeValue(member);
    return await client.zrevrank(normalizedKey, normalizedMember);
  }

  async zrange(key: RedisKey, start: number, stop: number, withScores?: boolean): Promise<string[]> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    const rangeQuery = {
      type: "byIndex" as const,
      start,
      end: stop
    };
    
    let result;
    if (withScores) {
      result = await client.zrangeWithScores(normalizedKey, rangeQuery);
    } else {
      result = await client.zrange(normalizedKey, rangeQuery);
    }
    
    return result.map(item => ParameterTranslator.convertGlideString(item) || '');
  }

  async zrevrange(key: RedisKey, start: number, stop: number, withScores?: boolean): Promise<string[]> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    const rangeQuery = {
      type: "byIndex" as const,
      start,
      end: stop
    };
    
    let result;
    if (withScores) {
      result = await client.zrangeWithScores(normalizedKey, rangeQuery, { reverse: true });
    } else {
      result = await client.zrange(normalizedKey, rangeQuery, { reverse: true });
    }
    
    return result.map(item => ParameterTranslator.convertGlideString(item) || '');
  }

  async zrangebyscore(
    key: RedisKey,
    min: string | number,
    max: string | number,
    ...args: string[]
  ): Promise<string[]> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    try {
      // Parse min/max boundaries for native GLIDE zrange
      const minBoundary: Boundary<number> = typeof min === 'string' && min.startsWith('(') 
        ? { value: parseFloat(min.slice(1)), isInclusive: false }
        : { value: typeof min === 'number' ? min : parseFloat(min.toString()), isInclusive: true };
      
      const maxBoundary: Boundary<number> = typeof max === 'string' && max.startsWith('(')
        ? { value: parseFloat(max.slice(1)), isInclusive: false }
        : { value: typeof max === 'number' ? max : parseFloat(max.toString()), isInclusive: true };
      
      const rangeQuery: RangeByScore = {
        type: "byScore",
        start: minBoundary,
        end: maxBoundary
      };
      
      // Handle LIMIT arguments
      for (let i = 0; i < args.length; i++) {
        const currentArg = args[i];
        if (currentArg && currentArg.toString().toUpperCase() === 'LIMIT' && i + 2 < args.length) {
          const offsetArg = args[i + 1];
          const countArg = args[i + 2];
          if (offsetArg !== undefined && countArg !== undefined) {
            rangeQuery.limit = {
              offset: parseInt(offsetArg.toString()),
              count: parseInt(countArg.toString())
            };
            break;
          }
        }
      }
      
      // Check if WITHSCORES is requested
      const withScores = args.some(arg => arg.toUpperCase() === 'WITHSCORES');
      
      // Use native GLIDE zrange method
      const result = withScores 
        ? await client.zrangeWithScores(normalizedKey, rangeQuery)
        : await client.zrange(normalizedKey, rangeQuery);
      
      if (!Array.isArray(result)) {
        return [];
      }
      
      return result.map(item => ParameterTranslator.convertGlideString(item) || '');
    } catch (error) {
      console.warn('zrangebyscore error:', error);
      return [];
    }
  }

  async zrevrangebyscore(
    key: RedisKey,
    max: string | number,
    min: string | number,
    ...args: string[]
  ): Promise<string[]> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    try {
      // Parse max/min boundaries for native GLIDE zrange (note: max/min order is swapped for reverse)
      const minBoundary: Boundary<number> = typeof min === 'string' && min.startsWith('(') 
        ? { value: parseFloat(min.slice(1)), isInclusive: false }
        : { value: typeof min === 'number' ? min : parseFloat(min.toString()), isInclusive: true };
      
      const maxBoundary: Boundary<number> = typeof max === 'string' && max.startsWith('(')
        ? { value: parseFloat(max.slice(1)), isInclusive: false }
        : { value: typeof max === 'number' ? max : parseFloat(max.toString()), isInclusive: true };
      
      const rangeQuery: RangeByScore = {
        type: "byScore",
        start: minBoundary,
        end: maxBoundary
      };
      
      // Handle LIMIT arguments
      for (let i = 0; i < args.length; i++) {
        const currentArg = args[i];
        if (currentArg && currentArg.toString().toUpperCase() === 'LIMIT' && i + 2 < args.length) {
          const offsetArg = args[i + 1];
          const countArg = args[i + 2];
          if (offsetArg !== undefined && countArg !== undefined) {
            rangeQuery.limit = {
              offset: parseInt(offsetArg.toString()),
              count: parseInt(countArg.toString())
            };
            break;
          }
        }
      }
      
      // Check if WITHSCORES is requested
      const withScores = args.some(arg => arg.toUpperCase() === 'WITHSCORES');
      
      // Use native GLIDE zrange method with reverse option
      const result = withScores 
        ? await client.zrangeWithScores(normalizedKey, rangeQuery, { reverse: true })
        : await client.zrange(normalizedKey, rangeQuery, { reverse: true });
      
      if (!Array.isArray(result)) {
        return [];
      }
      
      return result.map(item => ParameterTranslator.convertGlideString(item) || '');
    } catch (error) {
      console.warn('zrevrangebyscore error:', error);
      return [];
    }
  }

  async zpopmin(key: RedisKey, count?: number): Promise<string[]> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    try {
      const options = count !== undefined ? { count } : undefined;
      const result = await client.zpopmin(normalizedKey, options);
      
      if (!Array.isArray(result)) {
        return [];
      }
      
      return result.map(item => ParameterTranslator.convertGlideString(item) || '');
    } catch (error) {
      console.warn('zpopmin error:', error);
      return [];
    }
  }

  async zpopmax(key: RedisKey, count?: number): Promise<string[]> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    try {
      const options = count !== undefined ? { count } : undefined;
      const result = await client.zpopmax(normalizedKey, options);
      
      if (!Array.isArray(result)) {
        return [];
      }
      
      return result.map(item => ParameterTranslator.convertGlideString(item) || '');
    } catch (error) {
      console.warn('zpopmax error:', error);
      return [];
    }
  }

  // BullMQ-critical blocking commands
  async bzpopmin(...args: any[]): Promise<[string, string, string] | null> {
    const client = await this.getClient();
    
    let keys: RedisKey[];
    let timeout: number;
    
    // Handle parameter order: keys first, timeout last
    if (typeof args[args.length - 1] === 'number') {
      timeout = args[args.length - 1];
      keys = args.slice(0, -1);
    } else {
      throw new Error('Invalid bzpopmin arguments: timeout must be provided');
    }
    
    const normalizedKeys = keys.map(ParameterTranslator.normalizeKey);
    
    // Use native GLIDE method instead of customCommand
    const result = await client.bzpopmin(normalizedKeys, timeout);
    
    if (Array.isArray(result) && result.length === 3) {
      return [
        ParameterTranslator.convertGlideString(result[0]) || '',
        ParameterTranslator.convertGlideString(result[1]) || '',
        result[2].toString() // Convert score number to string for ioredis compatibility
      ];
    }
    
    return null;
  }

  async bzpopmax(...args: any[]): Promise<[string, string, string] | null> {
    const client = await this.getClient();
    
    let keys: RedisKey[];
    let timeout: number;
    
    // Handle parameter order: keys first, timeout last
    if (typeof args[args.length - 1] === 'number') {
      timeout = args[args.length - 1];
      keys = args.slice(0, -1);
    } else {
      throw new Error('Invalid bzpopmax arguments: timeout must be provided');
    }
    
    const normalizedKeys = keys.map(ParameterTranslator.normalizeKey);
    
    // Use native GLIDE method instead of customCommand
    const result = await client.bzpopmax(normalizedKeys, timeout);
    
    if (Array.isArray(result) && result.length === 3) {
      return [
        ParameterTranslator.convertGlideString(result[0]) || '',
        ParameterTranslator.convertGlideString(result[1]) || '',
        result[2].toString() // Convert score number to string for ioredis compatibility
      ];
    }
    
    return null;
  }

  async zremrangebyscore(key: RedisKey, min: string | number, max: string | number): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    
    // Parse boundaries
    const minBoundary: Boundary<number> = typeof min === 'string' && min.startsWith('(') 
      ? { value: parseFloat(min.slice(1)), isInclusive: false }
      : { value: typeof min === 'number' ? min : parseFloat(min.toString()), isInclusive: true };
    
    const maxBoundary: Boundary<number> = typeof max === 'string' && max.startsWith('(')
      ? { value: parseFloat(max.slice(1)), isInclusive: false }
      : { value: typeof max === 'number' ? max : parseFloat(max.toString()), isInclusive: true };
    
    return await client.zremRangeByScore(normalizedKey, minBoundary, maxBoundary);
  }
}
