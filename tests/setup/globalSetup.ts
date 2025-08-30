import { PortDiscovery } from '../utils/port-discovery';
import { execSync } from 'child_process';
import * as net from 'net';

function isPortOpen(port: number, host = '127.0.0.1', timeout = 500): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const onError = () => { try { socket.destroy(); } catch {} resolve(false); };
    socket.setTimeout(timeout);
    socket.once('error', onError);
    socket.once('timeout', onError);
    socket.connect(port, host, () => { socket.end(); resolve(true); });
  });
}

async function ensureValkeyCluster(): Promise<void> {
  const ports = [7000,7001,7002,7003,7004,7005];
  const checks = await Promise.all(ports.map((p) => isPortOpen(p)));
  const allUp = checks.every(Boolean);
  if (allUp) return;
  
  // Use our script instead of Docker Compose, but only if it exists and Docker is available
  try {
    // Check if Docker is available
    execSync('docker --version', { stdio: 'ignore' });
    console.log('Starting test servers using script...');
    execSync('./scripts/start-test-servers.sh --force', { stdio: 'inherit', timeout: 30000 });
  } catch (e) {
    console.warn('Docker not available or script failed, cluster tests may not work. Using fallback configuration.');
    return;
  }
  
  const start = Date.now();
  while (Date.now() - start < 30000) { // Reduced timeout
    const ready = (await Promise.all(ports.map((p) => isPortOpen(p)))).every(Boolean);
    if (ready) break;
    await new Promise(r => setTimeout(r, 1000));
  }
}

module.exports = async () => {
  // If already provided via env, keep them (support both Redis and Valkey env vars for compatibility)
  if ((process.env.REDIS_HOST && process.env.REDIS_PORT) || (process.env.VALKEY_HOST && process.env.VALKEY_PORT)) {
    // Set both for backward compatibility
    process.env.REDIS_HOST = process.env.REDIS_HOST || process.env.VALKEY_HOST;
    process.env.REDIS_PORT = process.env.REDIS_PORT || process.env.VALKEY_PORT;
    process.env.VALKEY_HOST = process.env.VALKEY_HOST || process.env.REDIS_HOST;
    process.env.VALKEY_PORT = process.env.VALKEY_PORT || process.env.REDIS_PORT;
    return;
  }

  // Discover responsive server, prioritizing standalone over cluster
  try {
    await ensureValkeyCluster();
    const servers = await PortDiscovery.discoverRedisServers();
    
    // Filter out cluster ports to prioritize standalone servers for VALKEY_HOST/VALKEY_PORT
    const clusterPorts = [7000, 7001, 7002, 7003, 7004, 7005];
    const standaloneServers = servers.filter(s => s.responsive && !clusterPorts.includes(s.port));
    
    // Prefer standalone servers, but fall back to cluster if none available
    const preferredServer = standaloneServers.length > 0 ? 
      (standaloneServers.find(s => s.port === 6379) || standaloneServers[0]) : 
      servers.find(s => s.responsive);
    
    if (preferredServer) {
      // Set both Redis and Valkey environment variables for compatibility
      process.env.REDIS_HOST = preferredServer.host;
      process.env.REDIS_PORT = String(preferredServer.port);
      process.env.VALKEY_HOST = preferredServer.host;
      process.env.VALKEY_PORT = String(preferredServer.port);
      
      // Expose cluster ports for tests that need them
      process.env.VALKEY_CLUSTER_PORT_1 = '7000';
      process.env.VALKEY_CLUSTER_PORT_2 = '7001';
      process.env.VALKEY_CLUSTER_PORT_3 = '7002';
      process.env.VALKEY_CLUSTER_PORT_4 = '7003';
      process.env.VALKEY_CLUSTER_PORT_5 = '7004';
      process.env.VALKEY_CLUSTER_PORT_6 = '7005';
      return;
    }
  } catch {}

  // Fallback to defaults (set both for compatibility)
  process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
  process.env.REDIS_PORT = process.env.REDIS_PORT || '6379';
  process.env.VALKEY_HOST = process.env.VALKEY_HOST || 'localhost';
  process.env.VALKEY_PORT = process.env.VALKEY_PORT || '6379';
  process.env.VALKEY_CLUSTER_PORT_1 = process.env.VALKEY_CLUSTER_PORT_1 || '7000';
  process.env.VALKEY_CLUSTER_PORT_2 = process.env.VALKEY_CLUSTER_PORT_2 || '7001';
  process.env.VALKEY_CLUSTER_PORT_3 = process.env.VALKEY_CLUSTER_PORT_3 || '7002';
  process.env.VALKEY_CLUSTER_PORT_4 = process.env.VALKEY_CLUSTER_PORT_4 || '7003';
  process.env.VALKEY_CLUSTER_PORT_5 = process.env.VALKEY_CLUSTER_PORT_5 || '7004';
  process.env.VALKEY_CLUSTER_PORT_6 = process.env.VALKEY_CLUSTER_PORT_6 || '7005';
};
