const test = require('node:test');
const assert = require('node:assert/strict');
const User = require('../src/models/User');

test('User model hashes passwords and validates them', async () => {
  const user = new User({
    name: 'Alice',
    email: 'alice@example.com',
    password: 'StrongPass123!'
  });

  await user.save();

  assert.notEqual(user.password, 'StrongPass123!');
  const isValid = await user.comparePassword('StrongPass123!');
  assert.equal(isValid, true);
});
