/**
 * Valkey Bundle Test Configuration
 * 
 * This configuration is specifically for testing JSON and Search modules
 * using the official valkey-bundle Docker container which includes:
 * - Valkey JSON (API-compatible with RedisJSON v2)
 * - Valkey Search (API-compatible with RediSearch) 
 * - Valkey Bloom (for probabilistic data structures)
 * - Valkey LDAP (for authentication)
 */

import { RedisOptions } from '../../src/types';

export interface ValkeyBundleTestConfig extends RedisOptions {
  modules?: {
    json?: boolean;
    search?: boolean;
    bloom?: boolean;
    ldap?: boolean;
  };
}

/**
 * Get configuration for valkey-bundle testing
 * Falls back to regular Redis if valkey-bundle is not available
 */
export async function getValkeyBundleTestConfig(): Promise<ValkeyBundleTestConfig> {
  // Default configuration for valkey-bundle container
  const config: ValkeyBundleTestConfig = {
    host: process.env.VALKEY_BUNDLE_HOST || 'localhost',
    port: parseInt(process.env.VALKEY_BUNDLE_PORT || '6380', 10),
    connectTimeout: 5000,
    modules: {
      json: true,
      search: true,
      bloom: true,
      ldap: false // Usually not needed for testing
    }
  };

  return config;
}

/**
 * Check if valkey-bundle modules are available
 * Returns which modules are actually loaded
 */
export async function checkAvailableModules(redis: any): Promise<{
  json: boolean;
  search: boolean;
  bloom: boolean;
  ldap: boolean;
}> {
  try {
    // Try to get module info
    const info = await redis.info('modules');
    
    return {
      json: info.includes('json') || info.includes('JSON'),
      search: info.includes('search') || info.includes('SEARCH') || info.includes('ft'),
      bloom: info.includes('bloom') || info.includes('BLOOM') || info.includes('bf'),
      ldap: info.includes('ldap') || info.includes('LDAP')
    };
  } catch (error) {
    // If we can't check modules, assume they're not available
    return {
      json: false,
      search: false, 
      bloom: false,
      ldap: false
    };
  }
}

/**
 * Skip test if required modules are not available
 */
export function skipIfModuleUnavailable(moduleName: keyof ReturnType<typeof checkAvailableModules>) {
  return (_target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      // This would be set by the test setup
      const modules = (this as any).availableModules;
      
      if (!modules || !modules[moduleName]) {
        console.warn(`⚠️  Skipping test "${String(propertyKey)}" - ${String(moduleName)} module not available`);
        return;
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

/**
 * Docker Compose configuration for valkey-bundle testing
 * Create this as docker-compose.valkey-bundle.yml for local testing
 */
export const VALKEY_BUNDLE_DOCKER_COMPOSE = `
version: '3.8'
services:
  valkey-bundle:
    image: valkey/valkey-bundle:latest
    container_name: valkey-bundle-test
    ports:
      - "6379:6379"
    command: >
      valkey-server 
      --bind 0.0.0.0 
      --port 6379
      --loadmodule /opt/valkey-stack/lib/valkey-json.so
      --loadmodule /opt/valkey-stack/lib/valkey-search.so  
      --loadmodule /opt/valkey-stack/lib/valkey-bloom.so
    healthcheck:
      test: ["CMD", "valkey-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    environment:
      - VALKEY_ARGS=--appendonly yes --appendfsync everysec
`;

/**
 * Test helper to wait for valkey-bundle to be ready
 */
export async function waitForValkeyBundle(
  redis: any, 
  maxRetries: number = 10, 
  retryDelay: number = 1000
): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await redis.ping();
      
      // Check if modules are loaded
      const modules = await checkAvailableModules(redis);
      
      if (modules.json || modules.search) {
        console.log('✅ Valkey-bundle is ready with modules:', modules);
        return true;
      }
      
      console.log(`⏳ Waiting for valkey-bundle modules... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      
    } catch (error) {
      console.log(`⏳ Waiting for valkey-bundle connection... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  console.warn('⚠️  Could not connect to valkey-bundle or modules not available');
  return false;
}

/**
 * Common test data for JSON and Search testing
 */
export const TEST_DATA = {
  // E-commerce product catalog for JSON testing
  products: [
    {
      id: 'prod_001',
      name: 'Gaming Laptop',
      description: 'High-performance laptop for gaming and content creation',
      price: 1299.99,
      category: 'Electronics',
      brand: 'TechCorp',
      specs: {
        cpu: 'Intel i7-12700H',
        gpu: 'NVIDIA RTX 3070',
        ram: '16GB DDR4',
        storage: '1TB SSD'
      },
      tags: ['gaming', 'laptop', 'high-performance', 'nvidia'],
      in_stock: true,
      stock_count: 25,
      rating: 4.5,
      reviews_count: 128
    },
    {
      id: 'prod_002', 
      name: 'Wireless Headphones',
      description: 'Premium noise-canceling wireless headphones',
      price: 299.99,
      category: 'Audio',
      brand: 'SoundTech',
      specs: {
        battery_life: '30 hours',
        connectivity: 'Bluetooth 5.2',
        noise_canceling: true,
        weight: '250g'
      },
      tags: ['audio', 'wireless', 'noise-canceling', 'premium'],
      in_stock: true,
      stock_count: 50,
      rating: 4.7,
      reviews_count: 89
    }
  ],
  
  // User profiles for testing JSON operations
  users: [
    {
      id: 'user_001',
      username: 'tech_enthusiast',
      email: 'tech@example.com',
      profile: {
        name: 'Alex Johnson',
        age: 28,
        location: 'San Francisco, CA',
        interests: ['technology', 'gaming', 'photography']
      },
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
      },
      activity: {
        last_login: '2024-01-15T10:30:00Z',
        page_views: 0,
        purchases: []
      }
    }
  ],
  
  // Search test documents
  documents: [
    {
      id: 'doc_001',
      title: 'Getting Started with Valkey',
      content: 'Valkey is a high-performance key-value store that is compatible with Redis',
      author: 'Valkey Team',
      tags: ['valkey', 'redis', 'database', 'tutorial'],
      published_date: '2024-01-01',
      category: 'Documentation'
    },
    {
      id: 'doc_002',
      title: 'JSON Operations in Valkey',
      content: 'Learn how to store and query JSON documents using Valkey JSON module',
      author: 'Tech Writer',
      tags: ['json', 'valkey', 'database', 'tutorial'],
      published_date: '2024-01-15',
      category: 'Tutorial'
    }
  ]
};