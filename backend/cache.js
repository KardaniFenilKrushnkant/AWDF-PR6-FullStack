const NodeCache = require('node-cache');

// Initialize NodeCache with standard TTL of 60 seconds
const nodeCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Supplementary Problem 2: Cache-hit and cache-miss counters
let hits = 0;
let misses = 0;

const cacheService = {
  raw: nodeCache,

  get(key) {
    const value = nodeCache.get(key);
    if (value !== undefined) {
      hits++;
      return value;
    }
    misses++;
    return undefined;
  },

  set(key, value, ttl = 60) {
    return nodeCache.set(key, value, ttl);
  },

  del(key) {
    return nodeCache.del(key);
  },

  flush() {
    return nodeCache.flushAll();
  },

  getStats() {
    const total = hits + misses;
    const hitRate = total > 0 ? ((hits / total) * 100).toFixed(2) + '%' : '0%';
    return {
      hits,
      misses,
      totalRequests: total,
      hitRate,
      activeKeysCount: nodeCache.keys().length,
      cachedKeys: nodeCache.keys(),
      ttlDefaultSeconds: 60,
      internalStats: nodeCache.getStats()
    };
  },

  resetStats() {
    hits = 0;
    misses = 0;
  }
};

module.exports = cacheService;
