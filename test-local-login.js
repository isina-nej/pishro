const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Test credentials
const phone = '09167991896';
const password = 'Test123456';

// Hash password
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Phone:', phone);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nSQL to insert test user:');
  console.log(`INSERT INTO User (id, phone, passwordHash, phoneVerified, role, createdAt, updatedAt) 
VALUES ('${crypto.randomUUID()}', '${phone}', '${hash}', true, 'USER', NOW(), NOW());`);
});
