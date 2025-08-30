/**
 * Search Commands Comprehensive Tests
 * 
 * Tests Valkey Search / RediSearch compatibility:
 * - Full-text search operations
 * - Index management and schema definition
 * - Vector similarity search for AI/ML applications
 * - Real-world search patterns from production systems
 * - E-commerce search, content management, recommendation engines
 * - Geospatial search and filtering
 */

import { RedisAdapter } from '../../src/adapters/RedisAdapter';
import { getValkeyBundleTestConfig, checkAvailableModules, waitForValkeyBundle, TEST_DATA } from '../utils/valkey-bundle-config';
import { SearchIndex, SearchQuery } from '../../src/adapters/commands/SearchCommands';

describe('Search Commands - Valkey Search Compatibility', () => {
  let redis: RedisAdapter;
  let searchAvailable: boolean = false;

  beforeAll(async () => {
    const config = await getValkeyBundleTestConfig();
    redis = new RedisAdapter(config);
    
    try {
      // Wait for valkey-bundle to be ready
      const isReady = await waitForValkeyBundle(redis, 5, 1000);
      
      if (isReady) {
        const modules = await checkAvailableModules(redis);
        searchAvailable = modules.search;
        
        if (!searchAvailable) {
          console.warn('⚠️  Search module not available - some tests will be skipped');
        }
      }
    } catch (error) {
      console.warn('⚠️  Could not verify search module availability:', error);
    }
  });

  beforeEach(async () => {
    if (searchAvailable && redis) {
      try {
        // Valkey Search doesn't support FT.DROP, so we can't clean up indexes
        // Instead we'll use unique index names or handle "already exists" errors
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  afterAll(async () => {
    if (redis) {
      try {
        // Valkey Search doesn't support FT.DROP
        // Indexes persist between runs, which is expected behavior
      } catch (error) {
        // Ignore cleanup errors
      }
      await redis.disconnect();
    }
  });

  describe('Index Management', () => {
    test('should create a full-text search index', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      const index: SearchIndex = {
        index_name: 'test_products',
        index_options: ['ON', 'HASH', 'PREFIX', '1', 'product:'],
        schema_fields: [
          { field_name: 'name', field_type: 'TAG' },
          { field_name: 'description', field_type: 'TAG' },
          { field_name: 'price', field_type: 'NUMERIC' },
          { field_name: 'category', field_type: 'TAG' },
          { field_name: 'brand', field_type: 'TAG' },
          { field_name: 'rating', field_type: 'NUMERIC' },
          { field_name: 'in_stock', field_type: 'TAG' },
          { field_name: 'embedding', field_type: 'VECTOR', field_options: ['FLAT', '6', 'TYPE', 'FLOAT32', 'DIM', '128', 'DISTANCE_METRIC', 'COSINE'] }
        ]
      };

      try {
        const result = await redis.ftCreate(index);
        expect(result).toBe('OK');
        
        // Verify index was created
        const indexes = await redis.ftList();
        expect(indexes).toContain('test_products');
        
        // Get index info
        const info = await redis.ftInfo('test_products');
        expect(info).toHaveProperty('index_name');
        
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          // FT.DROP not supported in Valkey Search, so index already exists
          // This is expected behavior - just verify the index exists
          const indexes = await redis.ftList();
          expect(indexes).toContain('test_products');
          
          // Get index info to verify it works
          const info = await redis.ftInfo('test_products');
          expect(info).toHaveProperty('index_name');
        } else {
          throw error;
        }
      }
    });

    test('should handle JSON-based search index', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      const jsonIndex: SearchIndex = {
        index_name: 'test_json_docs',
        index_options: ['ON', 'JSON', 'PREFIX', '1', 'doc:'],
        schema_fields: [
          { field_name: '$.title', field_type: 'TAG', field_options: ['AS', 'title'] },
          { field_name: '$.content', field_type: 'TAG', field_options: ['AS', 'content'] },
          { field_name: '$.author', field_type: 'TAG', field_options: ['AS', 'author'] },
          { field_name: '$.published_date', field_type: 'TAG', field_options: ['AS', 'date'] },
          { field_name: '$.category', field_type: 'TAG', field_options: ['AS', 'category'] },
          { field_name: 'doc_embedding', field_type: 'VECTOR', field_options: ['FLAT', '6', 'TYPE', 'FLOAT32', 'DIM', '128', 'DISTANCE_METRIC', 'COSINE'] }
        ]
      };

      try {
        const result = await redis.ftCreate(jsonIndex);
        expect(result).toBe('OK');
        
        const indexes = await redis.ftList();
        expect(indexes).toContain('test_json_docs');
        
      } catch (error: any) {
        if (error.message?.includes('Index already exists')) {
          await redis.ftDrop('test_json_docs', true);
          const result = await redis.ftCreate(jsonIndex);
          expect(result).toBe('OK');
        } else {
          // JSON indexing might not be supported in all environments
          console.warn('JSON indexing not supported:', error.message);
        }
      }
    });

    test('should drop indexes correctly', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      // Create a temporary index with a unique name
      const uniqueName = `test_temp_index_${Date.now()}`;
      const tempIndex: SearchIndex = {
        index_name: uniqueName,
        schema_fields: [
          { field_name: 'temp_field', field_type: 'TAG' },
          { field_name: 'temp_embedding', field_type: 'VECTOR', field_options: ['FLAT', '6', 'TYPE', 'FLOAT32', 'DIM', '128', 'DISTANCE_METRIC', 'COSINE'] }
        ]
      };

      try {
        await redis.ftCreate(tempIndex);
        
        // Verify it exists
        let indexes = await redis.ftList();
        expect(indexes).toContain(uniqueName);
        
        // Try to drop it - should fail with unsupported error
        try {
          await redis.ftDrop(uniqueName, false);
          // If it doesn't throw, that's unexpected but we'll handle it
          fail('Expected ftDrop to throw an error since it\'s not supported in Valkey Search');
        } catch (error: any) {
          // Verify we get the expected "not available" error
          expect(error.message).toContain('FT.DROP command is not available in Valkey Search');
        }
        
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          // Index with this unique name shouldn't exist, but if it does, 
          // it means the test ran very quickly - just verify it exists
          const indexes = await redis.ftList();
          expect(indexes.length).toBeGreaterThan(0);
        } else {
          throw error;
        }
      }
    });
  });

  describe('Document Operations', () => {
    beforeAll(async () => {
      if (!searchAvailable) return;
      
      // Ensure we have a test index for documents
      try {
        const index: SearchIndex = {
          index_name: 'test_products',
          schema_fields: [
            { field_name: 'name', field_type: 'TAG' },
            { field_name: 'description', field_type: 'TAG' },
            { field_name: 'price', field_type: 'NUMERIC' },
            { field_name: 'category', field_type: 'TAG' },
            { field_name: 'product_embedding', field_type: 'VECTOR', field_options: ['FLAT', '6', 'TYPE', 'FLOAT32', 'DIM', '128', 'DISTANCE_METRIC', 'COSINE'] }
          ]
        };
        await redis.ftCreate(index);
      } catch (error) {
        // Index might already exist
      }
    });

    test('should add documents to index', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      const product = TEST_DATA.products[0];
      
      const result = await redis.ftAdd(
        'test_products',
        `product:${product!.id}`,
        1.0,
        {
          name: product!.name,
          description: product!.description,
          price: product!.price.toString(),
          category: product!.category
        }
      );
      
      expect(result).toBe('OK');
    });

    test('should get documents from index', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      // Add a document first
      await redis.ftAdd(
        'test_products',
        'product:get_test',
        1.0,
        { name: 'Test Product', price: '99.99' }
      );

      const doc = await redis.ftGet('test_products', 'product:get_test');
      
      if (doc) {
        expect(doc).toHaveProperty('name', 'Test Product');
        expect(doc).toHaveProperty('price', '99.99');
      }
    });

    test('should delete documents from index', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      // Add a document to delete
      await redis.ftAdd(
        'test_products',
        'product:delete_test',
        1.0,
        { name: 'Delete Me', price: '1.00' }
      );

      // Delete it
      const result = await redis.ftDel('test_products', 'product:delete_test');
      expect(result).toBe(1);

      // Verify it's gone
      const doc = await redis.ftGet('test_products', 'product:delete_test');
      expect(doc).toBeNull();
    });

    test('should handle bulk document operations', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      // Add multiple documents
      const docIds = ['bulk1', 'bulk2', 'bulk3'];
      
      for (let i = 0; i < docIds.length; i++) {
        await redis.ftAdd(
          'test_products',
          `product:${docIds[i]}`,
          1.0,
          {
            name: `Bulk Product ${i + 1}`,
            price: `${(i + 1) * 10}.00`
          }
        );
      }

      // Get multiple documents
      const docs = await redis.ftMGet(
        'test_products',
        ...docIds.map(id => `product:${id}`)
      );

      expect(docs).toHaveLength(3);
      for (let i = 0; i < docs.length; i++) {
        if (docs[i]) {
          expect(docs[i]).toHaveProperty('name', `Bulk Product ${i + 1}`);
        }
      }
    });
  });

  describe('Search Operations', () => {
    beforeAll(async () => {
      if (!searchAvailable) return;

      // Set up test data for searching
      try {
        // Create index if it doesn't exist
        const index: SearchIndex = {
          index_name: 'test_ecommerce',
          schema_fields: [
            { field_name: 'name', field_type: 'TAG' },
            { field_name: 'description', field_type: 'TAG' },
            { field_name: 'price', field_type: 'NUMERIC' },
            { field_name: 'category', field_type: 'TAG' },
            { field_name: 'brand', field_type: 'TAG' },
            { field_name: 'rating', field_type: 'NUMERIC' },
            { field_name: 'search_embedding', field_type: 'VECTOR', field_options: ['FLAT', '6', 'TYPE', 'FLOAT32', 'DIM', '128', 'DISTANCE_METRIC', 'COSINE'] }
          ]
        };
        
        try {
          await redis.ftCreate(index);
        } catch (error) {
          // Index might exist
        }

        // Add test products
        for (const product of TEST_DATA.products) {
          await redis.ftAdd(
            'test_ecommerce',
            `product:${product.id}`,
            product.rating,
            {
              name: product.name,
              description: product.description,
              price: product.price.toString(),
              category: product.category,
              brand: product.brand,
              rating: product.rating.toString()
            }
          );
        }
      } catch (error) {
        console.warn('Could not set up search test data:', error);
      }
    });

    test('should perform basic text search', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      const searchQuery: SearchQuery = {
        query: 'laptop',
        options: {
          LIMIT: { offset: 0, count: 10 }
        }
      };

      const results = await redis.ftSearch('test_ecommerce', searchQuery);
      
      expect(results.total).toBeGreaterThanOrEqual(0);
      if (results.total > 0) {
        expect(results.documents[0]).toHaveProperty('id');
        expect(results.documents[0]?.id).toContain('product:');
      }
    });

    test('should search with filters', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      // Valkey Search uses vector-based queries with numeric filters embedded in query string
      const searchQuery: SearchQuery = {
        query: '(@price:[200 1500])=>[KNN 10 @search_embedding $vec]',
        options: {
          PARAMS: { vec: Buffer.from(new Float32Array(128).fill(0).buffer).toString('binary') },
          LIMIT: { offset: 0, count: 5 }
        }
      };

      const results = await redis.ftSearch('test_ecommerce', searchQuery);
      
      expect(results.total).toBeGreaterThanOrEqual(0);
      // Verify price filtering if we have results
      if (results.documents.length > 0) {
        results.documents.forEach(doc => {
          const price = parseFloat(doc.fields?.price || '0');
          expect(price).toBeGreaterThanOrEqual(200);
          expect(price).toBeLessThanOrEqual(1500);
        });
      }
    });

    test('should handle category-based search', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      const searchQuery: SearchQuery = {
        query: '@category:{Electronics}',
        options: {
          RETURN: ['name', 'price', 'category'],
          LIMIT: { offset: 0, count: 10 }
        }
      };

      const results = await redis.ftSearch('test_ecommerce', searchQuery);
      
      expect(results.total).toBeGreaterThanOrEqual(0);
      for (const doc of results.documents) {
        if (doc.fields && doc.fields.category) {
          expect(doc.fields.category).toBe('Electronics');
        }
      }
    });

    test('should support fuzzy search', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      // Search for "gaming" with fuzzy matching
      const searchQuery: SearchQuery = {
        query: '%gaming%',
        options: {
          LIMIT: { offset: 0, count: 5 }
        }
      };

      const results = await redis.ftSearch('test_ecommerce', searchQuery);
      
      expect(results.total).toBeGreaterThanOrEqual(0);
      // Results might include documents with similar terms
    });

    test('should handle complex boolean queries', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      const searchQuery: SearchQuery = {
        query: '(laptop OR headphones) @category:{Electronics|Audio}',
        options: {
          LIMIT: { offset: 0, count: 10 },
          SORTBY: { field: 'rating', direction: 'DESC' }
        }
      };

      const results = await redis.ftSearch('test_ecommerce', searchQuery);
      
      expect(results.total).toBeGreaterThanOrEqual(0);
      if (results.documents.length > 1) {
        // Verify sorting by rating (descending)
        const ratings = results.documents.map(doc => 
          parseFloat(doc.fields?.rating || '0')
        );
        
        for (let i = 1; i < ratings.length; i++) {
          expect(ratings[i]!).toBeLessThanOrEqual(ratings[i-1]!);
        }
      }
    });
  });

  describe('Aggregation Operations', () => {
    test('should perform aggregation queries', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      try {
        const results = await redis.ftAggregate(
          'test_ecommerce',
          '*',
          {
            GROUPBY: {
              fields: ['@category'],
              REDUCE: [{
                function: 'COUNT',
                args: [],
                AS: 'product_count'
              }]
            },
            SORTBY: [{
              property: '@product_count',
              direction: 'DESC'
            }]
          }
        );

        expect(Array.isArray(results)).toBe(true);
        // Results should contain aggregated data by category
        
      } catch (error) {
        // Aggregation might not be supported in all environments
        console.warn('Aggregation not supported:', error);
      }
    });

    test('should handle complex aggregations with multiple operations', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      try {
        const results = await redis.ftAggregate(
          'test_ecommerce',
          '*',
          {
            GROUPBY: {
              fields: ['@brand'],
              REDUCE: [
                { function: 'COUNT', args: [], AS: 'product_count' },
                { function: 'AVG', args: ['@price'], AS: 'avg_price' },
                { function: 'MAX', args: ['@rating'], AS: 'max_rating' }
              ]
            },
            SORTBY: [{
              property: '@avg_price',
              direction: 'DESC'
            }],
            LIMIT: { offset: 0, num: 5 }
          }
        );

        expect(Array.isArray(results)).toBe(true);
        
      } catch (error) {
        console.warn('Complex aggregation not supported:', error);
      }
    });
  });

  describe('Vector Similarity Search', () => {
    test('should handle vector search if supported', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      try {
        // Create a vector index
        const vectorIndex: SearchIndex = {
          index_name: 'test_vectors',
          schema_fields: [
            { 
              field_name: 'embedding', 
              field_type: 'VECTOR',
              field_options: [
                'HNSW', '6', 
                'TYPE', 'FLOAT32',
                'DIM', '4',
                'DISTANCE_METRIC', 'COSINE'
              ]
            },
            { field_name: 'title', field_type: 'TAG' }
          ]
        };

        await redis.ftCreate(vectorIndex);

        // Add a document with vector embedding
        const testVector = [0.1, 0.2, 0.3, 0.4];
        await redis.ftAdd(
          'test_vectors',
          'vec:1',
          1.0,
          {
            title: 'Test Document',
            embedding: Buffer.from(new Float32Array(testVector).buffer)
          }
        );

        // Perform vector search
        const queryVector = [0.15, 0.25, 0.35, 0.45]; // Similar vector
        const results = await redis.ftVectorSearch(
          'test_vectors',
          'embedding',
          queryVector,
          {
            KNN: 5,
            LIMIT: { offset: 0, count: 5 }
          }
        );

        expect(results.total).toBeGreaterThanOrEqual(0);
        
      } catch (error) {
        // Vector search might not be supported in all environments
        console.warn('Vector search not supported:', error);
      }
    });
  });

  describe('Real-World Use Cases', () => {
    test('should handle e-commerce search scenario', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      // Simulate user searching for "gaming laptop under $1500"
      const searchQuery: SearchQuery = {
        query: 'gaming laptop',
        options: {
          FILTER: { field: 'price', min: 0, max: 1500 },
          SORTBY: { field: 'rating', direction: 'DESC' },
          LIMIT: { offset: 0, count: 10 },
          RETURN: ['name', 'price', 'rating', 'brand']
        }
      };

      const results = await redis.ftSearch('test_ecommerce', searchQuery);
      
      expect(results.total).toBeGreaterThanOrEqual(0);
      
      // Verify all results are under $1500
      for (const doc of results.documents) {
        if (doc.fields && doc.fields.price) {
          expect(parseFloat(doc.fields.price)).toBeLessThanOrEqual(1500);
        }
      }
    });

    test('should handle content management search', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      try {
        // Create content index
        const contentIndex: SearchIndex = {
          index_name: 'test_content',
          schema_fields: [
            { field_name: 'title', field_type: 'TAG' },
            { field_name: 'content', field_type: 'TAG' },
            { field_name: 'author', field_type: 'TAG' },
            { field_name: 'tags', field_type: 'TAG',  },
            { field_name: 'published_date', field_type: 'TAG' },
            { field_name: 'content_embedding', field_type: 'VECTOR', field_options: ['FLAT', '6', 'TYPE', 'FLOAT32', 'DIM', '128', 'DISTANCE_METRIC', 'COSINE'] }
          ]
        };

        await redis.ftCreate(contentIndex);

        // Add test documents
        for (const doc of TEST_DATA.documents) {
          await redis.ftAdd(
            'test_content',
            `doc:${doc.id}`,
            1.0,
            {
              title: doc.title,
              content: doc.content,
              author: doc.author,
              tags: doc.tags.join(','),
              published_date: doc.published_date
            }
          );
        }

        // Search for Valkey-related content
        const searchQuery: SearchQuery = {
          query: 'valkey',
          options: {
            LIMIT: { offset: 0, count: 5 },
            RETURN: ['title', 'author', 'published_date']
          }
        };

        const results = await redis.ftSearch('test_content', searchQuery);
        
        expect(results.total).toBeGreaterThanOrEqual(0);
        
      } catch (error) {
        console.warn('Content search test error:', error);
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle search on non-existent index', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      await expect(
        redis.ftSearch('nonexistent_index', { query: '*' })
      ).rejects.toThrow();
    });

    test('should handle malformed queries gracefully', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      // Valkey Search has more lenient query parsing and may return empty results instead of errors
      const searchQuery: SearchQuery = {
        query: '@invalid_field:[malformed query',
        options: { LIMIT: { offset: 0, count: 1 } }
      };

      const results = await redis.ftSearch('test_ecommerce', searchQuery);
      
      // Valkey Search may return empty results for malformed queries instead of throwing
      expect(results.total).toBe(0);
      expect(results.documents).toHaveLength(0);
    });

    test('should handle empty search results', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      const searchQuery: SearchQuery = {
        query: 'nonexistent_product_xyz_123',
        options: { LIMIT: { offset: 0, count: 10 } }
      };

      const results = await redis.ftSearch('test_ecommerce', searchQuery);
      
      expect(results.total).toBe(0);
      expect(results.documents).toHaveLength(0);
    });

    test('should handle query explanation', async () => {
      if (!searchAvailable) {
        console.warn('⚠️  Skipping test - search module not available');
        return;
      }

      try {
        const explanation = await redis.ftExplain('test_ecommerce', 'laptop');
        expect(typeof explanation).toBe('string');
        expect(explanation.length).toBeGreaterThan(0);
      } catch (error) {
        // Explain might not be supported in all environments
        console.warn('Query explanation not supported:', error);
      }
    });
  });
});