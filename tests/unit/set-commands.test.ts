/**
 * Set Commands Comprehensive Tests
 * Real-world patterns: Social networks, tagging, analytics, permissions, A/B testing
 * Based on Twitter, Instagram, Discord, LinkedIn production usage patterns
 */

import { RedisAdapter } from '../../src/adapters/RedisAdapter';
import { getRedisTestConfig } from '../utils/redis-config';

describe('Set Commands - Social Network & Analytics Patterns', () => {
  let redis: RedisAdapter;

  beforeEach(async () => {
    const config = await getRedisTestConfig();
    redis = new RedisAdapter(config);
  });

  afterEach(async () => {
    await redis.disconnect();
  });

  describe('Twitter-Style Follower/Following System', () => {
    test('should manage follower relationships with SADD/SREM', async () => {
      const userId = 'user_' + Math.random();
      const followersKey = `followers:${userId}`;
      const followingKey = `following:${userId}`;
      
      // User gets new followers
      const result1 = await redis.sadd(followersKey, 'follower1', 'follower2', 'follower3');
      expect(result1).toBe(3);
      
      // User follows others
      const result2 = await redis.sadd(followingKey, 'following1', 'following2');
      expect(result2).toBe(2);
      
      // Check follower count
      const followerCount = await redis.scard(followersKey);
      expect(followerCount).toBe(3);
      
      // Check if specific user is following
      const isFollowing = await redis.sismember(followingKey, 'following1');
      expect(isFollowing).toBe(1);
      
      // Unfollow someone
      const removed = await redis.srem(followingKey, 'following2');
      expect(removed).toBe(1);
      
      const finalFollowingCount = await redis.scard(followingKey);
      expect(finalFollowingCount).toBe(1);
    });

    test('should find mutual followers using SINTER', async () => {
      const user1 = 'user1_' + Math.random();
      const user2 = 'user2_' + Math.random();
      const followers1Key = `followers:${user1}`;
      const followers2Key = `followers:${user2}`;
      
      // Set up follower lists
      await redis.sadd(followers1Key, 'alice', 'bob', 'charlie', 'david');
      await redis.sadd(followers2Key, 'bob', 'charlie', 'eve', 'frank');
      
      // Find mutual followers
      const mutualFollowers = await redis.sinter(followers1Key, followers2Key);
      expect(mutualFollowers.sort()).toEqual(['bob', 'charlie']);
      
      // Store mutual followers for caching
      const mutualKey = `mutual:${user1}:${user2}`;
      const stored = await redis.sinterstore(mutualKey, followers1Key, followers2Key);
      expect(stored).toBe(2);
      
      const cachedMutual = await redis.smembers(mutualKey);
      expect(cachedMutual.sort()).toEqual(['bob', 'charlie']);
    });

    test('should suggest friends using SDIFF for "people you may know"', async () => {
      const userId = 'user_' + Math.random();
      const friendId = 'friend_' + Math.random();
      const userFollowingKey = `following:${userId}`;
      const friendFollowingKey = `following:${friendId}`;
      
      // User follows some people
      await redis.sadd(userFollowingKey, 'alice', 'bob', 'charlie');
      
      // Friend follows overlapping + different people
      await redis.sadd(friendFollowingKey, 'alice', 'bob', 'david', 'eve', 'frank');
      
      // Find people friend follows that user doesn't (suggestions)
      const suggestions = await redis.sdiff(friendFollowingKey, userFollowingKey);
      expect(suggestions.sort()).toEqual(['david', 'eve', 'frank']);
      
      // Store suggestions for later processing
      const suggestionsKey = `suggestions:${userId}:${friendId}`;
      const suggestionCount = await redis.sdiffstore(suggestionsKey, friendFollowingKey, userFollowingKey);
      expect(suggestionCount).toBe(3);
    });

    test('should aggregate social reach using SUNION', async () => {
      const campaignId = 'campaign_' + Math.random();
      const influencer1Followers = `followers:influencer1_${campaignId}`;
      const influencer2Followers = `followers:influencer2_${campaignId}`;
      const influencer3Followers = `followers:influencer3_${campaignId}`;
      
      // Set up influencer follower bases
      await redis.sadd(influencer1Followers, 'user1', 'user2', 'user3', 'user4');
      await redis.sadd(influencer2Followers, 'user3', 'user4', 'user5', 'user6');
      await redis.sadd(influencer3Followers, 'user5', 'user6', 'user7', 'user8');
      
      // Calculate total unique reach
      const totalReach = await redis.sunion(influencer1Followers, influencer2Followers, influencer3Followers);
      expect(totalReach).toHaveLength(8); // All unique users
      
      // Store campaign reach for analytics
      const reachKey = `campaign_reach:${campaignId}`;
      const reachCount = await redis.sunionstore(reachKey, influencer1Followers, influencer2Followers, influencer3Followers);
      expect(reachCount).toBe(8);
    });
  });

  describe('Instagram-Style Content Tagging System', () => {
    test('should manage post tags and find trending topics', async () => {
      const sessionId = Math.random();
      
      // Posts with their tags
      const postTags = [
        { post: `post1_${sessionId}`, tags: ['photography', 'nature', 'landscape'] },
        { post: `post2_${sessionId}`, tags: ['photography', 'portrait', 'art'] },
        { post: `post3_${sessionId}`, tags: ['nature', 'wildlife', 'photography'] },
        { post: `post4_${sessionId}`, tags: ['art', 'digital', 'design'] }
      ];
      
      // Store tags for each post
      for (const { post, tags } of postTags) {
        await redis.sadd(`post_tags:${post}`, ...tags);
      }
      
      // Find posts tagged with 'photography'
      const photographyPosts: string[] = [];
      for (const { post, tags } of postTags) {
        if (tags.includes('photography')) {
          photographyPosts.push(post);
        }
      }
      
      // Verify by checking membership
      for (const postData of postTags) {
        const hasPhotography = await redis.sismember(`post_tags:${postData.post}`, 'photography');
        const expected = postData.tags.includes('photography') ? 1 : 0;
        expect(hasPhotography).toBe(expected);
      }
      
      // Find posts with both 'photography' and 'nature'
      const photoNaturePosts = await redis.sinter(
        `post_tags:post1_${sessionId}`, 
        `post_tags:post3_${sessionId}`
      );
      expect(photoNaturePosts.sort()).toEqual(['nature', 'photography']);
    });

    test('should implement hashtag recommendation system', async () => {
      const userId = 'user_' + Math.random();
      const userTagsKey = `user_tags:${userId}`;
      const trendingTagsKey = `trending_tags:${Date.now()}`;
      
      // User's historically used tags
      await redis.sadd(userTagsKey, 'photography', 'travel', 'food', 'nature');
      
      // Currently trending tags
      await redis.sadd(trendingTagsKey, 'photography', 'sunset', 'ocean', 'adventure', 'foodie');
      
      // Find trending tags user hasn't used much (recommendations)
      const recommendations = await redis.sdiff(trendingTagsKey, userTagsKey);
      expect(recommendations).toContain('sunset');
      expect(recommendations).toContain('ocean');
      expect(recommendations).toContain('adventure');
      
      // Find user's tags that are also trending (engagement boost)
      const trendingUserTags = await redis.sinter(userTagsKey, trendingTagsKey);
      expect(trendingUserTags).toContain('photography');
    });
  });

  describe('Discord-Style Permission & Role System', () => {
    test('should manage user roles and permissions', async () => {
      const serverId = 'server_' + Math.random();
      const userId = 'user_' + Math.random();
      const userRolesKey = `user_roles:${serverId}:${userId}`;
      
      // Assign roles to user
      const rolesAdded = await redis.sadd(userRolesKey, 'member', 'moderator', 'verified');
      expect(rolesAdded).toBe(3);
      
      // Check if user has specific role
      const isModerator = await redis.sismember(userRolesKey, 'moderator');
      expect(isModerator).toBe(1);
      
      const isAdmin = await redis.sismember(userRolesKey, 'admin');
      expect(isAdmin).toBe(0);
      
      // Remove a role
      const rolesRemoved = await redis.srem(userRolesKey, 'verified');
      expect(rolesRemoved).toBe(1);
      
      // Get all user roles
      const allRoles = await redis.smembers(userRolesKey);
      expect(allRoles.sort()).toEqual(['member', 'moderator']);
    });

    test('should implement channel access control', async () => {
      const channelId = 'channel_' + Math.random();
      const allowedRolesKey = `channel_access:${channelId}`;
      const userId = 'user_' + Math.random();
      const userRolesKey = `user_roles:${userId}`;
      
      // Set channel access requirements
      await redis.sadd(allowedRolesKey, 'admin', 'moderator', 'vip');
      
      // User has some roles
      await redis.sadd(userRolesKey, 'member', 'verified');
      
      // Check if user can access channel
      const hasAccess = await redis.sinter(userRolesKey, allowedRolesKey);
      expect(hasAccess).toHaveLength(0); // No access
      
      // Give user moderator role
      await redis.sadd(userRolesKey, 'moderator');
      
      // Check access again
      const hasAccessNow = await redis.sinter(userRolesKey, allowedRolesKey);
      expect(hasAccessNow).toContain('moderator');
      expect(hasAccessNow).toHaveLength(1);
    });
  });

  describe('LinkedIn-Style Professional Network', () => {
    test('should manage professional connections and recommendations', async () => {
      const userId = 'professional_' + Math.random();
      const connectionsKey = `connections:${userId}`;
      const skillsKey = `skills:${userId}`;
      
      // User's professional connections
      await redis.sadd(connectionsKey, 'colleague1', 'colleague2', 'client1', 'mentor1');
      
      // User's skills
      await redis.sadd(skillsKey, 'javascript', 'redis', 'nodejs', 'react');
      
      // Find connection's skills for recommendations
      const colleague1Skills = `skills:colleague1_${Math.random()}`;
      await redis.sadd(colleague1Skills, 'redis', 'python', 'kubernetes', 'docker');
      
      // Find skill overlap for collaboration opportunities
      const sharedSkills = await redis.sinter(skillsKey, colleague1Skills);
      expect(sharedSkills).toContain('redis');
      
      // Find skills to learn from connections
      const skillsToLearn = await redis.sdiff(colleague1Skills, skillsKey);
      expect(skillsToLearn).toContain('python');
      expect(skillsToLearn).toContain('kubernetes');
    });

    test('should implement company employee network', async () => {
      const companyId = 'company_' + Math.random();
      const engineersKey = `employees:${companyId}:engineering`;
      const marketingKey = `employees:${companyId}:marketing`;
      const managementKey = `employees:${companyId}:management`;
      
      // Department employees
      await redis.sadd(engineersKey, 'alice', 'bob', 'charlie');
      await redis.sadd(marketingKey, 'david', 'eve', 'frank');
      await redis.sadd(managementKey, 'alice', 'david'); // Cross-functional
      
      // Find cross-functional employees
      const crossFunctional = await redis.sinter(engineersKey, managementKey);
      expect(crossFunctional).toContain('alice');
      
      // All company employees
      const allEmployees = await redis.sunion(engineersKey, marketingKey, managementKey);
      expect(allEmployees).toHaveLength(6); // All individual employees
      
      // Non-management engineers
      const nonMgmtEngineers = await redis.sdiff(engineersKey, managementKey);
      expect(nonMgmtEngineers.sort()).toEqual(['bob', 'charlie']);
    });
  });

  describe('Real-Time Analytics & A/B Testing', () => {
    test('should track unique visitors and sessions', async () => {
      const date = new Date().toISOString().split('T')[0];
      const uniqueVisitorsKey = `visitors:${date}`;
      const mobileVisitorsKey = `visitors:mobile:${date}`;
      const desktopVisitorsKey = `visitors:desktop:${date}`;
      
      // Track unique visitors by device
      await redis.sadd(uniqueVisitorsKey, 'user1', 'user2', 'user3', 'user4', 'user5');
      await redis.sadd(mobileVisitorsKey, 'user1', 'user3', 'user5');
      await redis.sadd(desktopVisitorsKey, 'user2', 'user4', 'user5'); // user5 uses both
      
      // Get analytics
      const totalUnique = await redis.scard(uniqueVisitorsKey);
      expect(totalUnique).toBe(5);
      
      const mobileCount = await redis.scard(mobileVisitorsKey);
      expect(mobileCount).toBe(3);
      
      // Find users who use both mobile and desktop
      const crossPlatformUsers = await redis.sinter(mobileVisitorsKey, desktopVisitorsKey);
      expect(crossPlatformUsers).toContain('user5');
      
      // Find mobile-only users
      const mobileOnly = await redis.sdiff(mobileVisitorsKey, desktopVisitorsKey);
      expect(mobileOnly.sort()).toEqual(['user1', 'user3']);
    });

    test('should implement A/B testing cohorts', async () => {
      const experimentId = 'experiment_' + Math.random();
      const controlGroupKey = `experiment:${experimentId}:control`;
      const variantAKey = `experiment:${experimentId}:variant_a`;
      const variantBKey = `experiment:${experimentId}:variant_b`;
      
      // Assign users to test groups
      await redis.sadd(controlGroupKey, 'user1', 'user2', 'user3');
      await redis.sadd(variantAKey, 'user4', 'user5', 'user6');
      await redis.sadd(variantBKey, 'user7', 'user8', 'user9');
      
      // Track conversions
      const controlConvertsKey = `experiment:${experimentId}:control:converts`;
      const variantAConvertsKey = `experiment:${experimentId}:variant_a:converts`;
      
      await redis.sadd(controlConvertsKey, 'user1'); // 1/3 = 33%
      await redis.sadd(variantAConvertsKey, 'user4', 'user5'); // 2/3 = 67%
      
      // Calculate conversion rates
      const controlSize = await redis.scard(controlGroupKey);
      const controlConverts = await redis.scard(controlConvertsKey);
      const controlRate = controlConverts / controlSize;
      
      const variantASize = await redis.scard(variantAKey);
      const variantAConverts = await redis.scard(variantAConvertsKey);
      const variantARate = variantAConverts / variantASize;
      
      expect(controlRate).toBeCloseTo(0.33, 2);
      expect(variantARate).toBeCloseTo(0.67, 2);
      
      // Find users who converted in variant A
      const variantAConverters = await redis.sinter(variantAKey, variantAConvertsKey);
      expect(variantAConverters.sort()).toEqual(['user4', 'user5']);
    });

    test('should track feature usage patterns', async () => {
      const featureId = 'feature_' + Math.random();
      const betaUsersKey = `beta_users:${featureId}`;
      const activeUsersKey = `active_users:${featureId}`;
      const feedbackUsersKey = `feedback_users:${featureId}`;
      
      // Beta user cohort
      await redis.sadd(betaUsersKey, 'beta1', 'beta2', 'beta3', 'beta4', 'beta5');
      
      // Active users of the feature
      await redis.sadd(activeUsersKey, 'beta1', 'beta3', 'beta5', 'user1', 'user2');
      
      // Users who provided feedback
      await redis.sadd(feedbackUsersKey, 'beta1', 'beta2', 'user1');
      
      // Beta users actively using the feature
      const activeBetaUsers = await redis.sinter(betaUsersKey, activeUsersKey);
      expect(activeBetaUsers.sort()).toEqual(['beta1', 'beta3', 'beta5']);
      
      // Non-beta users using the feature (general rollout)
      const generalUsers = await redis.sdiff(activeUsersKey, betaUsersKey);
      expect(generalUsers.sort()).toEqual(['user1', 'user2']);
      
      // Beta users who haven't provided feedback yet
      const betaNoFeedback = await redis.sdiff(betaUsersKey, feedbackUsersKey);
      expect(betaNoFeedback.sort()).toEqual(['beta3', 'beta4', 'beta5']);
    });
  });

  describe('E-commerce & Content Filtering', () => {
    test('should implement product recommendation engine', async () => {
      const userId = 'customer_' + Math.random();
      const userInterestsKey = `interests:${userId}`;
      const userPurchasesKey = `purchases:${userId}`;
      
      // User's interests and purchase history
      await redis.sadd(userInterestsKey, 'electronics', 'gaming', 'books', 'music');
      await redis.sadd(userPurchasesKey, 'laptop', 'headphones', 'novel');
      
      // Product categories
      const electronicsKey = `category:electronics:${Math.random()}`;
      const gamingKey = `category:gaming:${Math.random()}`;
      
      await redis.sadd(electronicsKey, 'smartphone', 'tablet', 'headphones', 'laptop');
      await redis.sadd(gamingKey, 'console', 'controller', 'game1', 'headphones');
      
      // Find products user might like but hasn't bought
      const electronicsNotPurchased = await redis.sdiff(electronicsKey, userPurchasesKey);
      expect(electronicsNotPurchased).toContain('smartphone');
      expect(electronicsNotPurchased).toContain('tablet');
      
      // Cross-category recommendations (products in multiple interested categories)
      const crossCategoryProducts = await redis.sinter(electronicsKey, gamingKey);
      expect(crossCategoryProducts).toContain('headphones');
    });

    test('should implement content moderation system', async () => {
      const postId = 'post_' + Math.random();
      const reportedByKey = `reported:${postId}`;
      const moderatorsKey = `moderators:${Math.random()}`;
      const reviewedByKey = `reviewed:${postId}`;
      
      // Users who reported the content
      await redis.sadd(reportedByKey, 'user1', 'user2', 'user3');
      
      // Available moderators
      await redis.sadd(moderatorsKey, 'mod1', 'mod2', 'mod3');
      
      // Moderators who reviewed
      await redis.sadd(reviewedByKey, 'mod1', 'mod2');
      
      // Check report count
      const reportCount = await redis.scard(reportedByKey);
      expect(reportCount).toBe(3);
      
      // Find moderators who haven't reviewed yet
      const pendingModerators = await redis.sdiff(moderatorsKey, reviewedByKey);
      expect(pendingModerators).toContain('mod3');
      
      // Check if enough moderators reviewed (consensus)
      const reviewCount = await redis.scard(reviewedByKey);
      const consensusReached = reviewCount >= 2;
      expect(consensusReached).toBe(true);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle operations on non-existent sets', async () => {
      const nonExistentKey = 'nonexistent:set:' + Math.random();
      
      // Operations on non-existent set
      const members = await redis.smembers(nonExistentKey);
      expect(members).toEqual([]);
      
      const cardinality = await redis.scard(nonExistentKey);
      expect(cardinality).toBe(0);
      
      const isMember = await redis.sismember(nonExistentKey, 'member');
      expect(isMember).toBe(0);
      
      const popped = await redis.spop(nonExistentKey);
      expect(popped).toBeNull();
      
      const random = await redis.srandmember(nonExistentKey);
      expect(random).toBeNull();
    });

    test('should handle type conflicts gracefully', async () => {
      const stringKey = 'string:conflict:' + Math.random();
      
      // Set as string first
      await redis.set(stringKey, 'not-a-set');
      
      // Set operations should fail
      await expect(redis.sadd(stringKey, 'member')).rejects.toThrow();
      await expect(redis.smembers(stringKey)).rejects.toThrow();
    });

    test('should handle large sets efficiently', async () => {
      const largeSetKey = 'large:set:' + Math.random();
      
      // Add many members
      const members = Array.from({ length: 1000 }, (_, i) => `member${i}`);
      const added = await redis.sadd(largeSetKey, ...members);
      expect(added).toBe(1000);
      
      // Verify count
      const count = await redis.scard(largeSetKey);
      expect(count).toBe(1000);
      
      // Random sampling
      const samples = await redis.srandmember(largeSetKey, 10);
      expect(samples).toHaveLength(10);
      
      // Pop some members
      const popped = await redis.spop(largeSetKey, 5);
      expect(popped).toHaveLength(5);
      
      const remainingCount = await redis.scard(largeSetKey);
      expect(remainingCount).toBe(995);
    });

    test('should handle set operations with mixed data types', async () => {
      const mixedSetKey = 'mixed:set:' + Math.random();
      
      // Add different types of data
      await redis.sadd(mixedSetKey, '123', 'string', 'user:456', 'tag:789');
      
      const allMembers = await redis.smembers(mixedSetKey);
      expect(allMembers).toHaveLength(4);
      
      // Check membership
      expect(await redis.sismember(mixedSetKey, '123')).toBe(1);
      expect(await redis.sismember(mixedSetKey, 'string')).toBe(1);
      expect(await redis.sismember(mixedSetKey, 'user:456')).toBe(1);
      
      // Remove specific types
      const removed = await redis.srem(mixedSetKey, 'user:456', 'tag:789');
      expect(removed).toBe(2);
      
      const remaining = await redis.smembers(mixedSetKey);
      expect(remaining.sort()).toEqual(['123', 'string']);
    });
  });
});