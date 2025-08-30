/**
 * String Commands - Redis string operations
 */

import { GlideClient, TimeUnit } from '@valkey/valkey-glide';
import { RedisKey, RedisValue } from '../../types';
import { ParameterTranslator } from '../../utils/ParameterTranslator';

export class StringCommands {
  constructor(private getClient: () => Promise<GlideClient>) {}

  async set(key: RedisKey, value: RedisValue, ...args: any[]): Promise<string | null> {
    // Validate key is not empty (ioredis compatibility)
    if (key === '' || key === null || key === undefined) {
      throw new Error('ERR wrong number of arguments for \'set\' command');
    }
    
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedValue = ParameterTranslator.normalizeValue(value);
    
    // Handle additional arguments (EX, PX, NX, XX, etc.)
    const options: any = {};
    for (let i = 0; i < args.length; i += 2) {
      const option = args[i]?.toString().toUpperCase();
      const optionValue = args[i + 1];
      if (option === 'EX') options.expiry = { type: TimeUnit.Seconds, count: Number(optionValue) };
      else if (option === 'PX') options.expiry = { type: TimeUnit.Milliseconds, count: Number(optionValue) };
      else if (option === 'NX') options.conditionalSet = 'onlyIfDoesNotExist';
      else if (option === 'XX') options.conditionalSet = 'onlyIfExists';
    }
    
    const result = await client.set(normalizedKey, normalizedValue, options);
    return result === 'OK' ? 'OK' : null;
  }

  async get(key: RedisKey): Promise<string | null> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.get(normalizedKey);
    return ParameterTranslator.convertGlideString(result);
  }

  async mget(...keysOrArray: any[]): Promise<(string | null)[]> {
    const client = await this.getClient();
    const keys = Array.isArray(keysOrArray[0]) ? keysOrArray[0] : keysOrArray;
    const normalizedKeys = keys.map(ParameterTranslator.normalizeKey);
    const results = await client.mget(normalizedKeys);
    return results.map(ParameterTranslator.convertGlideString);
  }

  async mset(...argsOrHash: any[]): Promise<string> {
    const client = await this.getClient();
    
    // Parse key-value pairs
    const keyValuePairs: Record<string, string> = {};
    if (argsOrHash.length === 1 && typeof argsOrHash[0] === 'object' && !Array.isArray(argsOrHash[0])) {
      // Object format: mset({ key1: value1, key2: value2 })
      const obj = argsOrHash[0];
      for (const [key, value] of Object.entries(obj)) {
        keyValuePairs[ParameterTranslator.normalizeKey(key)] = ParameterTranslator.normalizeValue(value as any);
      }
    } else {
      // Array format: mset(key1, value1, key2, value2, ...)
      for (let i = 0; i < argsOrHash.length; i += 2) {
        const key = ParameterTranslator.normalizeKey(argsOrHash[i]);
        const value = ParameterTranslator.normalizeValue(argsOrHash[i + 1]);
        keyValuePairs[key] = value;
      }
    }
    
    await client.mset(keyValuePairs);
    return 'OK';
  }

  async incr(key: RedisKey): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.incr(normalizedKey);
  }

  async decr(key: RedisKey): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.decr(normalizedKey);
  }

  async incrby(key: RedisKey, increment: number): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.incrBy(normalizedKey, increment);
  }

  async decrby(key: RedisKey, decrement: number): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.decrBy(normalizedKey, decrement);
  }

  async incrbyfloat(key: RedisKey, increment: number): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.incrByFloat(normalizedKey, increment);
    return parseFloat(result.toString());
  }

  async append(key: RedisKey, value: RedisValue): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedValue = ParameterTranslator.normalizeValue(value);
    return await client.append(normalizedKey, normalizedValue);
  }

  async strlen(key: RedisKey): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    return await client.strlen(normalizedKey);
  }

  async getrange(key: RedisKey, start: number, end: number): Promise<string> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const result = await client.getrange(normalizedKey, start, end);
    return ParameterTranslator.convertGlideString(result) || '';
  }

  async setrange(key: RedisKey, offset: number, value: RedisValue): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedValue = ParameterTranslator.normalizeValue(value);
    return await client.setrange(normalizedKey, offset, normalizedValue);
  }

  async setex(key: RedisKey, seconds: number, value: RedisValue): Promise<string> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedValue = ParameterTranslator.normalizeValue(value);
    await client.set(normalizedKey, normalizedValue, { expiry: { type: TimeUnit.Seconds, count: seconds } });
    return 'OK';
  }

  async setnx(key: RedisKey, value: RedisValue): Promise<number> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedValue = ParameterTranslator.normalizeValue(value);
    const result = await client.set(normalizedKey, normalizedValue, { conditionalSet: 'onlyIfDoesNotExist' });
    return result === 'OK' ? 1 : 0;
  }

  async psetex(key: RedisKey, milliseconds: number, value: RedisValue): Promise<string> {
    const client = await this.getClient();
    const normalizedKey = ParameterTranslator.normalizeKey(key);
    const normalizedValue = ParameterTranslator.normalizeValue(value);
    await client.set(normalizedKey, normalizedValue, { expiry: { type: TimeUnit.Milliseconds, count: milliseconds } });
    return 'OK';
  }
}
