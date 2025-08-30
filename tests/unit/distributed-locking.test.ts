/**
 * Distributed Locking Pattern Tests  
 * Real-world patterns: Redlock algorithm, mutex, critical sections, resource coordination
 */

import { RedisAdapter } from '../../src/adapters/RedisAdapter';
import { getRedisTestConfig } from '../utils/redis-config';

describe('Distributed Locking Patterns', () => {
  let redis: RedisAdapter;

  beforeEach(async () => {
    const config = await getRedisTestConfig();
    redis = new RedisAdapter(config);
  });

  afterEach(async () => {
    await redis.disconnect();
  });

  describe('Basic Lock Operations', () => {
    test('should acquire and release simple lock', async () => {
      const lockKey = 'lock:resource:' + Math.random();
      const lockValue = 'client_' + Math.random();
      
      // Acquire lock
      const acquired = await redis.setnx(lockKey, lockValue);
      expect(acquired).toBe(1);
      
      // Set expiration to prevent deadlocks
      await redis.expire(lockKey, 30);
      
      // Verify lock exists
      const currentLock = await redis.get(lockKey);
      expect(currentLock).toBe(lockValue);
      
      // Release lock (atomic operation)
      const releaseScript = `
        if redis.call("GET", KEYS[1]) == ARGV[1] then
          return redis.call("DEL", KEYS[1])
        else
          return 0
        end
      `;
      
      const released = await redis.eval(releaseScript, 1, lockKey, lockValue);
      expect(released).toBe(1);
      
      // Verify lock is gone
      const afterRelease = await redis.get(lockKey);
      expect(afterRelease).toBeNull();
    });

    test('should prevent duplicate lock acquisition', async () => {
      const lockKey = 'lock:duplicate:' + Math.random();
      const client1Id = 'client1_' + Math.random();
      const client2Id = 'client2_' + Math.random();
      
      // Client 1 acquires lock
      const acquired1 = await redis.setnx(lockKey, client1Id);
      expect(acquired1).toBe(1);
      await redis.expire(lockKey, 30);
      
      // Client 2 tries to acquire same lock
      const acquired2 = await redis.setnx(lockKey, client2Id);
      expect(acquired2).toBe(0); // Should fail
      
      // Verify original lock holder
      const currentLock = await redis.get(lockKey);
      expect(currentLock).toBe(client1Id);
      
      // Clean up
      await redis.del(lockKey);
    });

    test('should handle lock expiration', async () => {
      const lockKey = 'lock:expiring:' + Math.random();
      const lockValue = 'expiring_client';
      
      // Acquire lock with short TTL
      await redis.setex(lockKey, 1, lockValue);
      
      // Verify lock exists
      const beforeExpiry = await redis.get(lockKey);
      expect(beforeExpiry).toBe(lockValue);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      // Verify lock expired
      const afterExpiry = await redis.get(lockKey);
      expect(afterExpiry).toBeNull();
      
      // Should be able to acquire expired lock
      const newAcquisition = await redis.setnx(lockKey, 'new_client');
      expect(newAcquisition).toBe(1);
      
      await redis.del(lockKey);
    });
  });

  describe('Critical Section Protection', () => {
    test('should protect shared counter increment', async () => {
      const counterKey = 'counter:protected:' + Math.random();
      const lockKey = `${counterKey}:lock`;
      
      // Initialize counter
      await redis.set(counterKey, '0');
      
      // Simulate critical section with lock
      const protectedIncrement = async (clientId: string) => {
        const lockAcquired = await redis.setnx(lockKey, clientId);
        
        if (lockAcquired) {
          try {
            await redis.expire(lockKey, 10);
            
            // Critical section - read, increment, write
            const current = await redis.get(counterKey);
            const newValue = parseInt(current || '0') + 1;
            
            // Simulate some processing time
            await new Promise(resolve => setTimeout(resolve, 10));
            
            await redis.set(counterKey, newValue.toString());
            
            return newValue;
          } finally {
            // Release lock
            const releaseScript = `
              if redis.call("GET", KEYS[1]) == ARGV[1] then
                return redis.call("DEL", KEYS[1])
              else
                return 0
              end
            `;
            await redis.eval(releaseScript, 1, lockKey, clientId);
          }
        }
        return null; // Could not acquire lock
      };
      
      const result = await protectedIncrement('client1');
      expect(result).toBe(1);
      
      const finalValue = await redis.get(counterKey);
      expect(finalValue).toBe('1');
    });

    test('should coordinate resource access between multiple clients', async () => {
      const resourceKey = 'resource:shared:' + Math.random();
      const lockKey = `${resourceKey}:access_lock`;
      
      // Initialize shared resource
      await redis.set(resourceKey, JSON.stringify({ 
        value: 0, 
        lastModifier: null, 
        timestamp: Date.now() 
      }));
      
      const accessResource = async (clientId: string, operation: 'read' | 'write', newValue?: number) => {
        // Try to acquire lock with timeout
        const lockValue = `${clientId}_${Date.now()}`;
        const lockAcquired = await redis.setnx(lockKey, lockValue);
        
        if (!lockAcquired) {
          return { success: false, reason: 'lock_unavailable' };
        }
        
        try {
          await redis.expire(lockKey, 5);
          
          // Access resource
          const currentData = await redis.get(resourceKey);
          const resource = JSON.parse(currentData || '{}');
          
          if (operation === 'read') {
            return { success: true, data: resource };
          } else {
            // Write operation
            resource.value = newValue;
            resource.lastModifier = clientId;
            resource.timestamp = Date.now();
            
            await redis.set(resourceKey, JSON.stringify(resource));
            return { success: true, data: resource };
          }
        } finally {
          // Always release lock
          const releaseScript = `
            if redis.call("GET", KEYS[1]) == ARGV[1] then
              return redis.call("DEL", KEYS[1])
            else
              return 0
            end
          `;
          await redis.eval(releaseScript, 1, lockKey, lockValue);
        }
      };
      
      // Client 1 writes
      const writeResult = await accessResource('client1', 'write', 42);
      expect(writeResult.success).toBe(true);
      expect(writeResult.data?.value).toBe(42);
      
      // Client 2 reads
      const readResult = await accessResource('client2', 'read');
      expect(readResult.success).toBe(true);
      expect(readResult.data?.value).toBe(42);
      expect(readResult.data?.lastModifier).toBe('client1');
    });
  });

  describe('Job Processing with Locks', () => {
    test('should ensure single job processor', async () => {
      const jobId = 'job_' + Math.random();
      const processingLockKey = `job:${jobId}:processing`;
      
      const jobData = {
        id: jobId,
        type: 'image_processing',
        status: 'pending',
        data: { imageUrl: 'https://example.com/image.jpg' }
      };
      
      const processJob = async (workerId: string) => {
        const lockValue = `worker_${workerId}_${Date.now()}`;
        const lockAcquired = await redis.setnx(processingLockKey, lockValue);
        
        if (!lockAcquired) {
          return { success: false, reason: 'job_already_processing' };
        }
        
        try {
          // Set reasonable processing timeout
          await redis.expire(processingLockKey, 300); // 5 minutes
          
          // Simulate job processing
          jobData.status = 'processing';
          const jobKey = `job:${jobId}:data`;
          await redis.set(jobKey, JSON.stringify(jobData));
          
          // Simulate work
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Complete job
          jobData.status = 'completed';
          await redis.set(jobKey, JSON.stringify(jobData));
          
          return { success: true, jobData };
        } finally {
          // Release processing lock
          const releaseScript = `
            if redis.call("GET", KEYS[1]) == ARGV[1] then
              return redis.call("DEL", KEYS[1])
            else
              return 0
            end
          `;
          await redis.eval(releaseScript, 1, processingLockKey, lockValue);
        }
      };
      
      const result = await processJob('worker1');
      expect(result.success).toBe(true);
      expect(result.jobData?.status).toBe('completed');
      
      // Verify lock is released
      const lockAfterProcess = await redis.get(processingLockKey);
      expect(lockAfterProcess).toBeNull();
    });

    test('should handle job queue with exclusive processing', async () => {
      const queueKey = 'job_queue:' + Math.random();
      const processingSetKey = `${queueKey}:processing`;
      
      // Add jobs to queue
      const jobs = ['job1', 'job2', 'job3'];
      await redis.rpush(queueKey, ...jobs);
      
      const processNextJob = async (workerId: string) => {
        // Atomic job dequeue with processing marker
        const dequeueScript = `
          local job = redis.call("LPOP", KEYS[1])
          if job then
            redis.call("SADD", KEYS[2], job)
            redis.call("EXPIRE", KEYS[2], 300)
            return job
          end
          return nil
        `;
        
        const job = await redis.eval(dequeueScript, 2, queueKey, processingSetKey);
        
        if (job) {
          try {
            // Process job
            await new Promise(resolve => setTimeout(resolve, 20));
            
            // Mark as completed
            await redis.srem(processingSetKey, job);
            
            return { success: true, job, workerId };
          } catch (error) {
            // On error, return job to queue
            await redis.lpush(queueKey, job);
            await redis.srem(processingSetKey, job);
            throw error;
          }
        }
        
        return { success: false, reason: 'no_jobs_available' };
      };
      
      const result1 = await processNextJob('worker1');
      expect(result1.success).toBe(true);
      expect(result1.job).toBe('job1');
      
      const result2 = await processNextJob('worker2');
      expect(result2.success).toBe(true);
      expect(result2.job).toBe('job2');
      
      // Check remaining queue
      const remaining = await redis.llen(queueKey);
      expect(remaining).toBe(1);
    });
  });

  describe('Advanced Locking Patterns', () => {
    test('should implement reentrant lock', async () => {
      const lockKey = 'lock:reentrant:' + Math.random();
      const clientId = 'client_' + Math.random();
      
      const acquireReentrantLock = async (clientId: string, lockKey: string) => {
        const lockData = await redis.get(lockKey);
        
        if (!lockData) {
          // No lock exists, acquire it
          const lockInfo = { owner: clientId, count: 1 };
          const acquired = await redis.setnx(lockKey, JSON.stringify(lockInfo));
          if (acquired) {
            await redis.expire(lockKey, 30);
            return true;
          }
          return false;
        }
        
        // Lock exists, check if we own it
        const lockInfo = JSON.parse(lockData);
        if (lockInfo.owner === clientId) {
          // Reentrant acquisition
          lockInfo.count++;
          await redis.set(lockKey, JSON.stringify(lockInfo));
          await redis.expire(lockKey, 30); // Extend expiry
          return true;
        }
        
        return false; // Owned by different client
      };
      
      const releaseReentrantLock = async (clientId: string, lockKey: string) => {
        const lockData = await redis.get(lockKey);
        if (!lockData) return false;
        
        const lockInfo = JSON.parse(lockData);
        if (lockInfo.owner !== clientId) return false;
        
        lockInfo.count--;
        if (lockInfo.count <= 0) {
          await redis.del(lockKey);
        } else {
          await redis.set(lockKey, JSON.stringify(lockInfo));
        }
        
        return true;
      };
      
      // Acquire lock twice
      const acquired1 = await acquireReentrantLock(clientId, lockKey);
      expect(acquired1).toBe(true);
      
      const acquired2 = await acquireReentrantLock(clientId, lockKey);
      expect(acquired2).toBe(true);
      
      // Check lock count
      const lockData = await redis.get(lockKey);
      const lockInfo = JSON.parse(lockData!);
      expect(lockInfo.count).toBe(2);
      
      // Release once (should still be locked)
      await releaseReentrantLock(clientId, lockKey);
      const stillLocked = await redis.get(lockKey);
      expect(stillLocked).toBeTruthy();
      
      // Release again (should be unlocked)
      await releaseReentrantLock(clientId, lockKey);
      const unlocked = await redis.get(lockKey);
      expect(unlocked).toBeNull();
    });

    test('should implement fair queuing with locks', async () => {
      const lockKey = 'lock:fair:' + Math.random();
      const queueKey = `${lockKey}:queue`;
      
      const requestLock = async (clientId: string) => {
        // Add client to queue
        await redis.rpush(queueKey, clientId);
        
        // Try to acquire lock if we're first in queue
        while (true) {
          const firstInQueue = await redis.lindex(queueKey, 0);
          
          if (firstInQueue === clientId) {
            const acquired = await redis.setnx(lockKey, clientId);
            if (acquired) {
              await redis.expire(lockKey, 30);
              await redis.lpop(queueKey); // Remove from queue
              return true;
            }
          }
          
          // Wait a bit and check again
          await new Promise(resolve => setTimeout(resolve, 10));
          
          // Timeout check (prevent infinite loop in tests)
          const queueLength = await redis.llen(queueKey);
          if (queueLength === 0) break;
        }
        
        return false;
      };
      
      const releaseLock = async (clientId: string) => {
        const releaseScript = `
          if redis.call("GET", KEYS[1]) == ARGV[1] then
            return redis.call("DEL", KEYS[1])
          else
            return 0
          end
        `;
        
        return await redis.eval(releaseScript, 1, lockKey, clientId);
      };
      
      // Client requests lock
      const client1 = 'client1';
      const acquired = await requestLock(client1);
      expect(acquired).toBe(true);
      
      // Verify lock is held
      const lockHolder = await redis.get(lockKey);
      expect(lockHolder).toBe(client1);
      
      // Release lock
      const released = await releaseLock(client1);
      expect(released).toBe(1);
    });

    test('should implement distributed semaphore', async () => {
      const semaphoreKey = 'semaphore:' + Math.random();
      const maxPermits = 3;
      
      const acquirePermit = async (clientId: string) => {
        const permitKey = `${semaphoreKey}:permits`;
        const holderKey = `${semaphoreKey}:holders`;
        
        const acquireScript = `
          local current = redis.call("GET", KEYS[1])
          if not current then
            current = 0
          else
            current = tonumber(current)
          end
          
          if current < tonumber(ARGV[1]) then
            redis.call("INCR", KEYS[1])
            redis.call("SADD", KEYS[2], ARGV[2])
            redis.call("EXPIRE", KEYS[1], 300)
            redis.call("EXPIRE", KEYS[2], 300)
            return 1
          else
            return 0
          end
        `;
        
        const acquired = await redis.eval(acquireScript, 2, permitKey, holderKey, maxPermits.toString(), clientId);
        return acquired === 1;
      };
      
      const releasePermit = async (clientId: string) => {
        const permitKey = `${semaphoreKey}:permits`;
        const holderKey = `${semaphoreKey}:holders`;
        
        const releaseScript = `
          local removed = redis.call("SREM", KEYS[2], ARGV[1])
          if removed == 1 then
            redis.call("DECR", KEYS[1])
            return 1
          else
            return 0
          end
        `;
        
        const released = await redis.eval(releaseScript, 2, permitKey, holderKey, clientId);
        return released === 1;
      };
      
      // Acquire permits up to limit
      const clients = ['client1', 'client2', 'client3', 'client4'];
      const acquisitionResults = [];
      
      for (const client of clients) {
        const acquired = await acquirePermit(client);
        acquisitionResults.push(acquired);
      }
      
      // First 3 should succeed, 4th should fail
      expect(acquisitionResults).toEqual([true, true, true, false]);
      
      // Check current permit count
      const permitCount = await redis.get(`${semaphoreKey}:permits`);
      expect(parseInt(permitCount!)).toBe(3);
      
      // Release one permit
      const released = await releasePermit('client1');
      expect(released).toBe(true);
      
      // Now 4th client should be able to acquire
      const fourthAcquire = await acquirePermit('client4');
      expect(fourthAcquire).toBe(true);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle lock timeout and recovery', async () => {
      const lockKey = 'lock:timeout:' + Math.random();
      const clientId = 'timeout_client';
      
      // Acquire lock with short timeout
      await redis.setex(lockKey, 1, clientId);
      
      // Verify lock exists
      const beforeTimeout = await redis.get(lockKey);
      expect(beforeTimeout).toBe(clientId);
      
      // Wait for timeout
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      // Lock should be expired
      const afterTimeout = await redis.get(lockKey);
      expect(afterTimeout).toBeNull();
      
      // New client can acquire
      const newClient = 'recovery_client';
      const newAcquisition = await redis.setnx(lockKey, newClient);
      expect(newAcquisition).toBe(1);
      
      await redis.del(lockKey);
    });

    test('should handle failed lock release gracefully', async () => {
      const lockKey = 'lock:fail_release:' + Math.random();
      const rightClient = 'right_client';
      const wrongClient = 'wrong_client';
      
      // Client 1 acquires lock
      await redis.setnx(lockKey, rightClient);
      
      // Client 2 tries to release lock they don't own
      const releaseScript = `
        if redis.call("GET", KEYS[1]) == ARGV[1] then
          return redis.call("DEL", KEYS[1])
        else
          return 0
        end
      `;
      
      const wrongRelease = await redis.eval(releaseScript, 1, lockKey, wrongClient);
      expect(wrongRelease).toBe(0); // Should fail
      
      // Lock should still exist
      const stillLocked = await redis.get(lockKey);
      expect(stillLocked).toBe(rightClient);
      
      // Right client can release
      const rightRelease = await redis.eval(releaseScript, 1, lockKey, rightClient);
      expect(rightRelease).toBe(1);
      
      // Lock should be gone
      const afterRelease = await redis.get(lockKey);
      expect(afterRelease).toBeNull();
    });

    test('should handle concurrent lock acquisition attempts', async () => {
      const lockKey = 'lock:concurrent:' + Math.random();
      
      const attemptLock = async (clientId: string) => {
        try {
          const acquired = await redis.setnx(lockKey, clientId);
          if (acquired) {
            await redis.expire(lockKey, 30);
            return { success: true, clientId };
          }
          return { success: false, clientId };
        } catch (error) {
          return { success: false, clientId, error: (error as Error).message };
        }
      };
      
      // Simulate concurrent attempts
      const clients = ['client_a', 'client_b', 'client_c'];
      const attempts = clients.map(client => attemptLock(client));
      
      const results = await Promise.all(attempts);
      
      // Only one should succeed
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      
      expect(successful).toHaveLength(1);
      expect(failed).toHaveLength(2);
      
      // Clean up
      await redis.del(lockKey);
    });
  });
});