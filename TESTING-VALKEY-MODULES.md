# Testing Valkey JSON and Search Modules

This document explains how to test the JSON and Search functionality using **valkey-bundle** instead of Redis Stack.

## 🚀 Quick Start with Valkey Bundle

### 1. Start Valkey Bundle Container

```bash
# Start valkey-bundle with all modules loaded
docker-compose -f docker-compose.valkey-bundle.yml up -d

# Check if it's ready
docker-compose -f docker-compose.valkey-bundle.yml ps
```

### 2. Run JSON Tests

```bash
# Test JSON operations (ValkeyJSON / RedisJSON v2 compatible)
npm test tests/unit/json-commands.test.ts

# Or run with verbose output
npm test tests/unit/json-commands.test.ts -- --verbose
```

### 3. Run Search Tests

```bash
# Test Search operations (Valkey Search / RediSearch compatible)
npm test tests/unit/search-commands.test.ts

# Or run with coverage
npm run test:coverage tests/unit/search-commands.test.ts
```

### 4. Clean Up

```bash
# Stop and remove containers
docker-compose -f docker-compose.valkey-bundle.yml down

# Remove volumes (optional)
docker-compose -f docker-compose.valkey-bundle.yml down -v
```

## 📋 What's Included

### Valkey Bundle Modules

The `valkey/valkey-bundle` container includes:

- **📄 Valkey JSON**: Native JSON document storage and querying
- **🔍 Valkey Search**: Full-text search and vector similarity search
- **🎯 Valkey Bloom**: Probabilistic data structures (Bloom filters)
- **🔐 Valkey LDAP**: Authentication against LDAP providers

### Test Coverage

#### JSON Commands (18 Methods)
- ✅ `jsonSet()` - Store JSON documents
- ✅ `jsonGet()` - Retrieve with JSONPath queries  
- ✅ `jsonDel()` - Delete paths from documents
- ✅ `jsonType()` - Get data types
- ✅ `jsonNumIncrBy()` / `jsonNumMultBy()` - Numeric operations
- ✅ `jsonStrAppend()` / `jsonStrLen()` - String operations
- ✅ `jsonArrAppend()` / `jsonArrInsert()` / `jsonArrLen()` - Array operations
- ✅ `jsonObjKeys()` / `jsonObjLen()` - Object operations
- ✅ `jsonToggle()` / `jsonClear()` - Advanced operations

#### Search Commands (12 Methods)
- ✅ `ftCreate()` - Create search indexes
- ✅ `ftSearch()` - Full-text search with filters
- ✅ `ftAggregate()` - Aggregation queries
- ✅ `ftVectorSearch()` - Vector similarity search
- ✅ `ftAdd()` / `ftGet()` / `ftDel()` - Document management
- ✅ `ftInfo()` / `ftList()` / `ftExplain()` - Index management

## 🔧 Configuration

### Environment Variables

```bash
# Valkey Bundle connection
export VALKEY_BUNDLE_HOST=localhost
export VALKEY_BUNDLE_PORT=6379

# Enable specific modules (optional)
export VALKEY_MODULES=json,search,bloom
```

### Test Configuration

The tests automatically detect available modules:

```typescript
// Test will skip if modules not available
const modules = await checkAvailableModules(redis);
if (!modules.json) {
  console.warn('⚠️  JSON module not available - skipping tests');
  return;
}
```

## 📊 Real-World Test Scenarios

### E-commerce Product Catalog (JSON)

```typescript
// Store product with complex nested structure
await redis.jsonSet('product:123', '$', {
  name: 'Gaming Laptop',
  specs: {
    cpu: 'Intel i7',
    gpu: 'NVIDIA RTX 3070',
    ram: '16GB'
  },
  tags: ['gaming', 'laptop', 'high-performance'],
  reviews: [
    { user: 'user1', rating: 5, comment: 'Excellent!' },
    { user: 'user2', rating: 4, comment: 'Great performance' }
  ]
});

// Query specific paths
const cpu = await redis.jsonGet('product:123', '$.specs.cpu');
const reviews = await redis.jsonGet('product:123', '$.reviews[*].rating');
```

### Full-Text Search Index (Search)

```typescript
// Create product search index
const index: SearchIndex = {
  index_name: 'products',
  index_options: ['ON', 'HASH', 'PREFIX', '1', 'product:'],
  schema_fields: [
    { field_name: 'name', field_type: 'TEXT', field_options: ['WEIGHT', '2.0'] },
    { field_name: 'description', field_type: 'TEXT' },
    { field_name: 'price', field_type: 'NUMERIC', field_options: ['SORTABLE'] },
    { field_name: 'category', field_type: 'TAG' }
  ]
};

await redis.ftCreate(index);

// Search with filters and sorting
const results = await redis.ftSearch('products', {
  query: 'gaming laptop',
  options: {
    FILTER: { field: 'price', min: 500, max: 2000 },
    SORTBY: { field: 'price', direction: 'ASC' },
    LIMIT: { offset: 0, count: 10 }
  }
});
```

### Vector Similarity Search (AI/ML)

```typescript
// Create vector index for embeddings
const vectorIndex: SearchIndex = {
  index_name: 'embeddings',
  schema_fields: [
    {
      field_name: 'embedding',
      field_type: 'VECTOR',
      field_options: [
        'HNSW', '6',
        'TYPE', 'FLOAT32', 
        'DIM', '768',
        'DISTANCE_METRIC', 'COSINE'
      ]
    }
  ]
};

// Search similar vectors
const results = await redis.ftVectorSearch(
  'embeddings',
  'embedding', 
  queryVector,
  { KNN: 10 }
);
```

## 🚨 Troubleshooting

### Module Not Available

If tests show "module not available":

```bash
# Check if valkey-bundle is running
docker ps | grep valkey-bundle

# Check logs for module loading
docker logs valkey-bundle-test

# Verify modules are loaded
docker exec valkey-bundle-test valkey-cli MODULE LIST
```

### Connection Issues

```bash
# Test direct connection
docker exec valkey-bundle-test valkey-cli ping

# Check port binding
netstat -tulpn | grep 6379
```

### Test Failures

```bash
# Run with debug output
DEBUG=* npm test tests/unit/json-commands.test.ts

# Run specific test
npm test -- --testNamePattern="should set and get simple JSON documents"
```

## 📚 Additional Resources

- [Valkey Bundle Documentation](https://valkey.io/topics/valkey-bundle/)
- [Valkey JSON Commands](https://github.com/valkey-io/valkey-json)
- [Valkey Search Commands](https://github.com/valkey-io/valkey-search)
- [ValkeyJSON API Reference](https://github.com/valkey-io/valkey-rfc/blob/main/ValkeyJSON.md)

## 🎯 Integration Examples

### Bull Job Queue with JSON

```typescript
// Store complex job data as JSON
await redis.jsonSet('job:123', '$', {
  id: 123,
  type: 'video_processing',
  data: { 
    input_file: 'video.mp4',
    output_formats: ['720p', '1080p', '4K'],
    filters: ['denoise', 'sharpen'] 
  },
  progress: 0,
  created_at: new Date().toISOString()
});

// Update job progress
await redis.jsonNumIncrBy('job:123', '$.progress', 10);
```

### Session Store with JSON

```typescript
// Store user session as JSON document
await redis.jsonSet('session:abc123', '$', {
  user_id: 'user456',
  login_time: new Date().toISOString(),
  permissions: ['read', 'write', 'admin'],
  preferences: {
    theme: 'dark',
    language: 'en'
  }
});

// Update preferences without replacing entire session
await redis.jsonSet('session:abc123', '$.preferences.theme', 'light');
```

This approach gives you **Redis Stack functionality** using open-source Valkey modules, perfect for development and testing!