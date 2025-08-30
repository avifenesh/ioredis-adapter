/**
 * ZSet Commands Comprehensive Tests
 * Real-world patterns: Leaderboards, rankings, time-series data, priority queues
 */

import { RedisAdapter } from '../../src/adapters/RedisAdapter';
import { getRedisTestConfig } from '../utils/redis-config';

describe('ZSet Commands - Real-World Patterns', () => {
  let redis: RedisAdapter;

  beforeEach(async () => {
    const config = await getRedisTestConfig();
    redis = new RedisAdapter(config);
  });

  afterEach(async () => {
    await redis.disconnect();
  });

  describe('Gaming Leaderboard Pattern', () => {
    test('should handle game score updates with ZADD', async () => {
      const key = 'test:zadd:' + Math.random();
      
      // Add initial players
      const result1 = await redis.zadd(key, 1000, 'player1');
      expect(result1).toBe(1);

      const result2 = await redis.zadd(key, 750, 'player2', 1200, 'player3');
      expect(result2).toBe(2);

      // Update existing player score
      const result3 = await redis.zadd(key, 1100, 'player1');
      expect(result3).toBe(0); // No new members added

      // Verify final scores
      const players = await redis.zrange(key, 0, -1);
      expect(players).toEqual(['player2', 'player1', 'player3']);
      
      // Check individual scores
      const player1Score = await redis.zscore(key, 'player1');
      expect(player1Score).toBe('1100');
    });

    test('should increment player scores with ZINCRBY', async () => {
      const key = 'test:zincrby:' + Math.random();
      
      await redis.zadd(key, 1000, 'player1');
      
      // Player scores 50 points
      const newScore = await redis.zincrby(key, 50, 'player1');
      expect(newScore).toBe('1050');

      // New player gets their first score
      const firstScore = await redis.zincrby(key, 100, 'newPlayer');
      expect(firstScore).toBe('100');
    });

    test('should get top players with ZREVRANGE', async () => {
      const key = 'test:zrevrange:' + Math.random();
      
      // Setup leaderboard
      await redis.zadd(key, 
        1000, 'alice', 
        850, 'bob', 
        1200, 'charlie', 
        950, 'diana',
        1100, 'eve'
      );

      // Get top 3 players (names only for now)
      const top3Names = await redis.zrevrange(key, 0, 2);
      expect(top3Names).toEqual(['charlie', 'eve', 'alice']);

      // Verify their scores individually
      const charlieScore = await redis.zscore(key, 'charlie');
      const eveScore = await redis.zscore(key, 'eve');
      const aliceScore = await redis.zscore(key, 'alice');
      
      expect(charlieScore).toBe('1200');
      expect(eveScore).toBe('1100'); 
      expect(aliceScore).toBe('1000');
    });

    test('should find player rank with ZREVRANK and ZSCORE', async () => {
      const key = 'test:zrevrank:' + Math.random();
      
      await redis.zadd(key, 
        1000, 'alice', 
        850, 'bob', 
        1200, 'charlie', 
        950, 'diana'
      );

      const rank = await redis.zrevrank(key, 'alice');
      expect(rank).toBe(1); // 2nd place (0-indexed, after charlie 1200, before diana 950)

      const score = await redis.zscore(key, 'alice');
      expect(score).toBe('1000');

      const noRank = await redis.zrevrank(key, 'nonexistent');
      expect(noRank).toBeNull();
    });

    test('should handle score range queries with ZRANGEBYSCORE', async () => {
      const key = 'test:zrangebyscore:' + Math.random();
      
      await redis.zadd(key, 
        500, 'bronze1',
        600, 'bronze2', 
        800, 'silver1',
        900, 'silver2',
        1100, 'gold1',
        1200, 'gold2'
      );

      // Get silver tier players (750-999 points)
      const silverPlayers = await redis.zrangebyscore(key, 750, 999);
      expect(silverPlayers).toEqual(['silver1', 'silver2']);

      // Get gold+ players (1000+)
      const goldPlayers = await redis.zrangebyscore(key, 1000, '+inf');
      expect(goldPlayers).toEqual(['gold1', 'gold2']);

      // Get bottom 2 players with LIMIT
      const bottomPlayers = await redis.zrangebyscore(key, '-inf', '+inf', 'LIMIT', '0', '2');
      expect(bottomPlayers).toEqual(['bronze1', 'bronze2']);
    });
  });

  describe('Time-based Activity Feed Pattern', () => {
    test('should manage activity timestamps with ZADD', async () => {
      const key = 'test:activity:' + Math.random();
      const now = Date.now();
      
      // Add activities with timestamps as scores
      await redis.zadd(key,
        now - 3600000, 'login',        // 1 hour ago
        now - 1800000, 'post_created', // 30 min ago  
        now - 900000, 'comment_added', // 15 min ago
        now, 'profile_updated'         // now
      );

      // Get recent activities (last 45 minutes)
      const recentActivities = await redis.zrangebyscore(
        key, 
        now - 2700000, // 45 min ago
        now
      );
      
      expect(recentActivities.length).toBe(3);
      expect(recentActivities).toContain('post_created');
      expect(recentActivities).toContain('comment_added');
      expect(recentActivities).toContain('profile_updated');
    });

    test('should cleanup old activities with ZREMRANGEBYSCORE', async () => {
      const key = 'test:cleanup:' + Math.random();
      const now = Date.now();
      const oneDayAgo = now - 86400000;
      
      await redis.zadd(key,
        oneDayAgo - 3600000, 'old_activity1',
        oneDayAgo - 1800000, 'old_activity2',
        now - 3600000, 'recent_activity1',
        now, 'recent_activity2'
      );

      // Remove activities older than 1 day
      const removed = await redis.zremrangebyscore(key, '-inf', oneDayAgo);
      expect(removed).toBe(2);

      const remainingCount = await redis.zcard(key);
      expect(remainingCount).toBe(2);
    });
  });

  describe('Priority Queue Pattern', () => {
    test('should implement priority task queue', async () => {
      const key = 'test:priority:' + Math.random();
      
      // Add tasks with priority scores (higher = more important)
      await redis.zadd(key,
        1, 'low_priority_cleanup',
        5, 'medium_priority_email',
        10, 'high_priority_payment',
        15, 'critical_security_alert'
      );

      // Process highest priority task
      const highestPriority = await redis.zpopmax(key);
      expect(highestPriority).toEqual(['critical_security_alert', '15']);

      // Process next highest
      const nextHighest = await redis.zpopmax(key);
      expect(nextHighest).toEqual(['high_priority_payment', '10']);

      // Check remaining count
      const remaining = await redis.zcard(key);
      expect(remaining).toBe(2);
    });

    test('should handle empty queue operations', async () => {
      const key = 'test:empty:' + Math.random();
      
      const emptyResult = await redis.zpopmax(key);
      expect(emptyResult).toEqual([]);

      const emptyCount = await redis.zcard(key);
      expect(emptyCount).toBe(0);
    });
  });

  describe('Complex Scoring Scenarios', () => {
    test('should handle score updates correctly', async () => {
      const key = 'test:complex:' + Math.random();
      
      // Add initial score
      const result1 = await redis.zadd(key, 100, 'player1');
      expect(result1).toBe(1);

      // Update existing player score  
      const result2 = await redis.zadd(key, 200, 'player1');
      expect(result2).toBe(0); // No new members, but score updated

      const finalScore = await redis.zscore(key, 'player1');
      expect(finalScore).toBe('200');
    });

    test('should handle large datasets efficiently', async () => {
      const key = 'test:large:' + Math.random();
      
      // Add many members
      const members = [];
      for (let i = 0; i < 100; i++) {
        members.push(i, `member${i}`);
      }
      await redis.zadd(key, ...members);

      // Verify count
      const count = await redis.zcard(key);
      expect(count).toBe(100);

      // Get specific ranges
      const firstTen = await redis.zrange(key, 0, 9);
      expect(firstTen).toHaveLength(10);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle invalid operations gracefully', async () => {
      const key = 'test:nonexistent:' + Math.random();
      
      // Operations on non-existent keys
      const rank = await redis.zrank(key, 'member');
      expect(rank).toBeNull();

      const score = await redis.zscore(key, 'member');
      expect(score).toBeNull();

      const range = await redis.zrange(key, 0, -1);
      expect(range).toEqual([]);
    });

    test('should handle type errors for wrong data types', async () => {
      const key = 'test:string:' + Math.random();
      
      // Set a string value first
      await redis.set(key, 'not-a-zset');

      // ZSet operations on string should throw
      await expect(redis.zadd(key, 1, 'member')).rejects.toThrow();
      await expect(redis.zrange(key, 0, -1)).rejects.toThrow();
    });

    test('should handle floating point scores correctly', async () => {
      const key = 'test:float:' + Math.random();
      
      await redis.zadd(key, 
        1.5, 'member1',
        2.7, 'member2', 
        1.5000001, 'member3' // Very close to member1
      );

      // Get members in order
      const range = await redis.zrange(key, 0, -1);
      expect(range).toEqual(['member1', 'member3', 'member2']);

      // Check individual scores
      const score1 = await redis.zscore(key, 'member1');
      const score2 = await redis.zscore(key, 'member2');
      const score3 = await redis.zscore(key, 'member3');
      
      expect(parseFloat(score1!)).toBeCloseTo(1.5, 10);
      expect(parseFloat(score2!)).toBeCloseTo(2.7, 10);
      expect(parseFloat(score3!)).toBeCloseTo(1.5000001, 10);

      // Test increment with float
      const newScore = await redis.zincrby(key, 0.3, 'member1');
      expect(parseFloat(newScore)).toBeCloseTo(1.8, 10);
    });
  });
});