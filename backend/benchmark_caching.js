const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const diff = process.hrtime(start);
        const timeMs = (diff[0] * 1e3 + diff[1] * 1e-6);
        let parsed = null;
        try { parsed = JSON.parse(data); } catch (e) { parsed = data; }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed,
          timeMs: parseFloat(timeMs.toFixed(2))
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    req.end();
  });
}

async function run() {
  console.log('================================================================');
  console.log('PRACTICAL 9: IN-MEMORY CACHING & QUERY OPTIMIZATION BENCHMARK');
  console.log('================================================================\n');

  // 1. Authenticate
  const loginRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'fenilpatel@gmail.com', password: 'password123' });

  const token = loginRes.data.token;
  console.log(`[Auth] Logged in successfully. Token received: ${token.substring(0, 25)}...\n`);

  // 2. Uncached Benchmark (3 samples, flushing cache before each)
  console.log('--- Case 1: UNCACHED (Direct MongoDB Database Reads) ---');
  const uncachedReadings = [];
  for (let i = 1; i <= 3; i++) {
    // Flush to guarantee Cache MISS
    await makeRequest({ hostname: 'localhost', port: 3000, path: '/cache/flush', method: 'POST' });
    
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/tasks',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    uncachedReadings.push(res.timeMs);
    console.log(`Sample ${i}: Response Time = ${res.timeMs} ms | X-Cache = ${res.headers['x-cache']} | Items = ${res.data.length}`);
  }
  const avgUncached = (uncachedReadings.reduce((a, b) => a + b, 0) / uncachedReadings.length).toFixed(2);
  console.log(`>> Average Uncached Response Time: ${avgUncached} ms\n`);

  // 3. Cached Benchmark (3 samples back-to-back hitting node-cache)
  console.log('--- Case 2: CACHED (In-Memory node-cache HITs) ---');
  // First prime the cache
  await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/tasks',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const cachedReadings = [];
  for (let i = 1; i <= 3; i++) {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/tasks',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    cachedReadings.push(res.timeMs);
    console.log(`Sample ${i}: Response Time = ${res.timeMs} ms | X-Cache = ${res.headers['x-cache']} | Items = ${res.data.length}`);
  }
  const avgCached = (cachedReadings.reduce((a, b) => a + b, 0) / cachedReadings.length).toFixed(2);
  console.log(`>> Average Cached Response Time: ${avgCached} ms\n`);

  const speedup = (avgUncached / avgCached).toFixed(1);
  const latencyReduction = (((avgUncached - avgCached) / avgUncached) * 100).toFixed(1);
  console.log(`PERFORMANCE IMPACT:`);
  console.log(`- Speedup: ${speedup}x Faster`);
  console.log(`- Latency Reduction: ${latencyReduction}% drop in response time!\n`);

  // 4. Invalidation Test
  console.log('--- Case 3: CACHE INVALIDATION ON WRITE (POST /tasks) ---');
  const createRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/tasks',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, {
    title: 'Cache Invalidation Verification Task',
    description: 'Ensure cache is cleared upon write so stale data is never served',
    priority: 'high'
  });
  console.log(`Task Created: ID = ${createRes.data._id} | Cache 'all_tasks' automatically invalidated.`);

  // Verify next GET is a MISS
  const verifyRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/tasks',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`Subsequent GET /tasks: X-Cache = ${verifyRes.headers['x-cache']} (Expected: MISS) | Count = ${verifyRes.data.length}\n`);

  // 5. Query /cache/stats
  console.log('--- Case 4: DEBUG ENDPOINT (/cache/stats) ---');
  const statsRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/cache/stats',
    method: 'GET'
  });
  console.log(JSON.stringify(statsRes.data, null, 2));
}

run().catch(console.error);
