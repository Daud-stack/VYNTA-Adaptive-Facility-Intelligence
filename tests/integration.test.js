const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}/api`;

const endpointsToTest = [
  { path: '/attendance', method: 'GET' },
  { path: '/billing', method: 'GET' },
  { path: '/bookings', method: 'GET' },
  { path: '/cafeteria', method: 'GET' },
  { path: '/energy', method: 'GET' },
  { path: '/hr', method: 'GET' },
  { path: '/mailroom', method: 'GET' },
  { path: '/payroll', method: 'GET' },
  { path: '/projects', method: 'GET' },
  { path: '/sensors', method: 'GET' },
  { path: '/spaces', method: 'GET' },
  { path: '/tenant-requests', method: 'GET' },
  { path: '/tickets', method: 'GET' },
  { path: '/travel', method: 'GET' },
  { path: '/visitors', method: 'GET' },
  { path: '/assets', method: 'GET' },
  { path: '/auth/login', method: 'POST', body: { email: 'admin@vynta.ai', password: 'password123' } }
];

async function runTests() {
  console.log(`🚀 Starting Deep Module Tests against ${BASE_URL}...\n`);
  let passed = 0;
  let failed = 0;
  const results = [];

  for (const endpoint of endpointsToTest) {
    const url = `${BASE_URL}${endpoint.path}`;
    const start = Date.now();
    try {
      const options = {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }

      const res = await fetch(url, options);
      const data = await res.json().catch(() => ({}));
      const duration = Date.now() - start;

      if (res.ok) {
        console.log(`✅ [PASS] ${endpoint.method} ${endpoint.path} (${res.status}) - ${duration}ms`);
        passed++;
        results.push({ endpoint: endpoint.path, status: 'PASS', code: res.status, duration, error: null });
      } else {
        console.error(`❌ [FAIL] ${endpoint.method} ${endpoint.path} (${res.status}) - ${duration}ms`);
        console.error(`   Error Response:`, data);
        failed++;
        results.push({ endpoint: endpoint.path, status: 'FAIL', code: res.status, duration, error: data });
      }
    } catch (e) {
      const duration = Date.now() - start;
      console.error(`❌ [ERROR] ${endpoint.method} ${endpoint.path} - ${duration}ms`);
      console.error(`   Network/Fetch Error: ${e.message}`);
      failed++;
      results.push({ endpoint: endpoint.path, status: 'ERROR', code: 500, duration, error: e.message });
    }
  }

  console.log(`\n📊 Test Summary:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Total Modules Tested: ${passed + failed}`);

  const reportPath = path.join(__dirname, '../api-health-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report saved to ${reportPath}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
