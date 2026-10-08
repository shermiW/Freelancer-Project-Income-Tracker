const assert = require('assert');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 1. Import Middlewares and Controllers
const { protect } = require('./middleware/authMiddleware');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const {
  registerValidation,
  loginValidation,
  createClientValidation,
  createProjectValidation,
} = require('./middleware/validatorMiddleware');

console.log('--- Starting Unit Verification of Backend Components ---');

// 1. Test Password Hashing with bcryptjs
async function testBcrypt() {
  console.log('\n1. Testing Password Hashing with bcryptjs...');
  const password = 'mySecretPassword123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  assert.notStrictEqual(password, hashedPassword);
  assert(await bcrypt.compare(password, hashedPassword));
  assert(!(await bcrypt.compare('wrongPassword', hashedPassword)));
  console.log('✅ Password hashing & verification with bcryptjs passed.');
}

// 2. Test JWT Signing & Verification
function testJWT() {
  console.log('\n2. Testing JWT Signing & Verification...');
  const secret = 'freelancer_tracker_super_secret_jwt_key_2026_spec';
  const payload = { id: '60d5ecb8b5c9c22b8c8b4567' };
  const token = jwt.sign(payload, secret, { expiresIn: '30d' });

  const decoded = jwt.verify(token, secret);
  assert.strictEqual(decoded.id, payload.id);
  console.log('✅ JWT token issuance & verification passed.');
}

// 3. Test Express Validator Middleware Rules
function testValidationMiddleware() {
  console.log('\n3. Testing Express Validator Rules...');
  assert(Array.isArray(registerValidation));
  assert(Array.isArray(loginValidation));
  assert(Array.isArray(createClientValidation));
  assert(Array.isArray(createProjectValidation));
  console.log('✅ Express validator middleware chains defined successfully.');
}

// 4. Test Error Handler Middleware Output
function testErrorHandler() {
  console.log('\n4. Testing Centralized Error Handler Middleware...');
  let resStatus = null;
  let resJson = null;

  const mockRes = {
    statusCode: 200,
    status(code) {
      resStatus = code;
      return this;
    },
    json(data) {
      resJson = data;
      return this;
    },
  };

  // Test CastError (Invalid ObjectId)
  const castErr = new Error('Cast Error');
  castErr.name = 'CastError';
  castErr.kind = 'ObjectId';

  errorHandler(castErr, {}, mockRes, () => {});
  assert.strictEqual(resStatus, 404);
  assert.strictEqual(resJson.message, 'Resource not found (Invalid ID format)');
  console.log('✅ CastError properly mapped to 404 with formatted message.');

  // Test Duplicate Key Error
  const dupErr = new Error('Duplicate Key');
  dupErr.code = 11000;
  dupErr.keyValue = { email: 'test@example.com' };

  errorHandler(dupErr, {}, mockRes, () => {});
  assert.strictEqual(resStatus, 400);
  assert.strictEqual(resJson.message, 'Duplicate email value entered');
  console.log('✅ Duplicate Key Error (11000) properly mapped to 400.');
}

// Run All Tests
async function runAll() {
  await testBcrypt();
  testJWT();
  testValidationMiddleware();
  testErrorHandler();
  console.log('\n🎉 ALL UNIT & ARCHITECTURAL VERIFICATIONS PASSED SUCCESSFULLY!');
}

runAll().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
