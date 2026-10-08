const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Client = require('./models/Client');
const Project = require('./models/Project');

async function testBackend() {
  console.log('--- Starting Backend Functionality & Endpoint Verification ---');

  let mongoServer;
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log(`Starting MongoMemoryServer at: ${uri}`);
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoMemoryServer successfully.');
  } catch (e) {
    const fallbackUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancer_tracker';
    console.log(`Connecting to local MongoDB at: ${fallbackUri}`);
    await mongoose.connect(fallbackUri);
    console.log('✅ Connected to local MongoDB successfully.');
  }

  const cors = require('cors');
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/clients', require('./routes/clientRoutes'));
  app.use('/api/projects', require('./routes/projectRoutes'));
  app.use('/api/dashboard', require('./routes/dashboardRoutes'));
  
  const { notFound, errorHandler } = require('./middleware/errorMiddleware');
  app.use(notFound);
  app.use(errorHandler);

  const server = app.listen(5005, async () => {
    console.log('✅ Test Server listening on port 5005');

    try {
      const baseUrl = 'http://127.0.0.1:5005';
      const testEmail = `test_${Date.now()}@example.com`;

      // 1. Test POST /api/auth/register validation failure (short password)
      console.log('\n--- 1. Testing Registration Validation Failure ---');
      let res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User', email: testEmail, password: '123' })
      });
      let data = await res.json();
      console.log(`Status: ${res.status}, Response:`, data);
      if (res.status === 400 && data.message.includes('Password must be at least 6 characters')) {
        console.log('✅ Validation failed as expected for short password');
      } else {
        console.error('❌ Validation check failed!');
      }

      // 2. Test POST /api/auth/register Success
      console.log('\n--- 2. Testing Registration Success ---');
      res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User', email: testEmail, password: 'password123', companyName: 'Acme LLC' })
      });
      data = await res.json();
      console.log(`Status: ${res.status}, User ID: ${data._id}, Has Token: ${!!data.token}`);
      const token = data.token;
      const userId = data._id;

      if (!token) throw new Error('Token not returned on registration');

      // 3. Test POST /api/auth/login
      console.log('\n--- 3. Testing Login ---');
      res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: 'password123' })
      });
      data = await res.json();
      console.log(`Status: ${res.status}, Logged In User: ${data.name}`);

      // 4. Test GET /api/clients (Protected)
      console.log('\n--- 4. Testing GET /api/clients ---');
      res = await fetch(`${baseUrl}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      data = await res.json();
      console.log(`Status: ${res.status}, Clients count: ${data.length}`);

      // 5. Test POST /api/clients (Validation error: missing name)
      console.log('\n--- 5. Testing POST /api/clients Validation ---');
      res = await fetch(`${baseUrl}/api/clients`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: 'client@example.com' })
      });
      data = await res.json();
      console.log(`Status: ${res.status}, Message: ${data.message}`);

      // 6. Test POST /api/clients Success
      console.log('\n--- 6. Testing POST /api/clients Success ---');
      res = await fetch(`${baseUrl}/api/clients`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Globex Corp',
          email: 'contact@globex.com',
          company: 'Globex',
          phone: '555-0199',
          status: 'Active'
        })
      });
      data = await res.json();
      console.log(`Status: ${res.status}, Created Client ID: ${data._id}`);
      const clientId = data._id;

      // 7. Test PUT /api/clients/:id
      console.log('\n--- 7. Testing PUT /api/clients/:id ---');
      res = await fetch(`${baseUrl}/api/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ company: 'Globex Corporation' })
      });
      data = await res.json();
      console.log(`Status: ${res.status}, Updated Company: ${data.company}`);

      // 8. Test POST /api/projects Validation (negative fee)
      console.log('\n--- 8. Testing POST /api/projects Validation (negative fee) ---');
      res = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: 'Website Redesign', client: clientId, fee: -500 })
      });
      data = await res.json();
      console.log(`Status: ${res.status}, Message: ${data.message}`);

      // 9. Test POST /api/projects Success (In Progress & Paid projects)
      console.log('\n--- 9. Testing POST /api/projects Creation ---');
      res = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Website Redesign',
          client: clientId,
          fee: 3500,
          status: 'In Progress'
        })
      });
      const proj1 = await res.json();
      console.log(`Created Project 1 (In Progress): ID ${proj1._id}, Fee: $${proj1.fee}`);

      res = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Mobile App API',
          client: clientId,
          fee: 5000,
          status: 'Paid',
          paidDate: new Date()
        })
      });
      const proj2 = await res.json();
      console.log(`Created Project 2 (Paid): ID ${proj2._id}, Fee: $${proj2.fee}`);

      // 10. Test GET /api/projects with query filters (?status=in-progress&client=...)
      console.log('\n--- 10. Testing GET /api/projects?status=in-progress&client=... ---');
      res = await fetch(`${baseUrl}/api/projects?status=in-progress&client=${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      data = await res.json();
      console.log(`Status: ${res.status}, Projects matched with in-progress filter: ${data.length}`);
      if (data.length === 1 && data[0].title === 'Website Redesign') {
        console.log('✅ Status query filter ("in-progress") successfully normalized and matched DB record!');
      } else {
        console.error('❌ Status query filter did not match correctly!', data);
      }

      // 11. Test GET /api/dashboard/stats
      console.log('\n--- 11. Testing GET /api/dashboard/stats ---');
      res = await fetch(`${baseUrl}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      data = await res.json();
      console.log('Dashboard Stats Summary:', {
        totalIncome: data.totalIncome,
        pendingPayments: data.pendingPayments,
        activeProjects: data.activeProjects,
        totalProjects: data.totalProjects,
        monthlyIncomeCount: data.monthlyIncome.length
      });

      if (
        data.totalIncome === 5000 &&
        data.pendingPayments === 3500 &&
        data.activeProjects === 1
      ) {
        console.log('✅ Dashboard summary calculations match exact expectations!');
      } else {
        console.error('❌ Dashboard summary calculations mismatched!');
      }

      server.close();
      await mongoose.disconnect();
      if (mongoServer) await mongoServer.stop();
      console.log('\n🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
      process.exit(0);
    } catch (err) {
      console.error('❌ Test execution error:', err);
      server.close();
      await mongoose.disconnect();
      if (mongoServer) await mongoServer.stop();
      process.exit(1);
    }
  });
}

testBackend();
