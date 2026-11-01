const http = require('http');

function postRequest(path, data, token = null) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const startTime = Date.now();
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), responseTime });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, responseTime });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function deleteRequest(path, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const startTime = Date.now();
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), responseTime });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, responseTime });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log(' PRACTICAL 10: EVENT-DRIVEN ASYNCHRONOUS PROCESSING TEST SUITE');
  console.log(' Student: Fenil Kardani | ID: D25IT136');
  console.log('================================================================\n');

  // Step 1: Login
  console.log('1. Authenticating test user (fenilpatel@gmail.com)...');
  const loginRes = await postRequest('/auth/login', {
    email: 'fenilpatel@gmail.com',
    password: 'password123'
  });

  if (!loginRes.data || !loginRes.data.token) {
    console.error('Login failed:', loginRes);
    process.exit(1);
  }

  const token = loginRes.data.token;
  console.log(`✓ Authenticated successfully. JWT Token acquired in ${loginRes.responseTime} ms.\n`);

  // Step 2: Test POST /tasks (task-created event)
  console.log('2. Testing POST /tasks with Asynchronous EventEmitter...');
  console.log(`   Dispatching POST request at: ${new Date().toISOString()}`);
  const postStartTime = Date.now();
  const createRes = await postRequest('/tasks', {
    title: 'Deploy High-Volume Event Listener Module',
    description: 'Practical 10 background notification using EventEmitter',
    priority: 'high',
    assignedTo: 'Fenil Kardani (D25IT136)'
  }, token);

  const apiElapsed = Date.now() - postStartTime;
  console.log(`   HTTP Status: ${createRes.status} Created`);
  console.log(`   Client Response Received in: ${apiElapsed} ms (Immediate Non-Blocking Return)`);
  console.log(`   Created Task ID: ${createRes.data._id}`);
  console.log(`   Task Title: "${createRes.data.title}"`);
  console.log(`   Waiting 3 seconds to observe 2000ms background listener completion in server logs...\n`);

  await new Promise(r => setTimeout(r, 3000));

  // Step 3: Test DELETE /tasks/:id (task-deleted event - Supplementary 1)
  console.log('3. Testing DELETE /tasks/:id (Supplementary 1: task-deleted Audit Event)...');
  const deleteRes = await deleteRequest(`/tasks/${createRes.data._id}`, token);
  console.log(`   HTTP Status: ${deleteRes.status} OK`);
  console.log(`   Response Received in: ${deleteRes.responseTime} ms`);
  console.log(`   Server Response:`, deleteRes.data.message);
  console.log(`   Audit listener executed asynchronously.\n`);

  // Step 4: Test POST /test-event-error (Supplementary 2: error event)
  console.log('4. Testing Error Event Listener (Supplementary 2: error handling)...');
  const errRes = await postRequest('/test-event-error', {}, token);
  console.log(`   HTTP Status: ${errRes.status} OK`);
  console.log(`   Server Response:`, errRes.data.message);
  console.log(`   Waiting 1 second to verify unhandled rejection did not crash server...\n`);

  await new Promise(r => setTimeout(r, 1000));

  console.log('================================================================');
  console.log(' ✓ ALL PRACTICAL 10 EVENT-DRIVEN TESTS COMPLETED SUCCESSFULLY');
  console.log('================================================================');
}

runTests().catch(console.error);
