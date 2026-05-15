import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const phone = '09167991896';
const password = 'Test123456';

const hash = await bcrypt.hash(password, 10);
console.log('Phone:', phone);
console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nSQL to insert test user:');
console.log(`INSERT INTO User (id, phone, passwordHash, phoneVerified, role, createdAt, updatedAt) 
VALUES ('${crypto.randomUUID()}', '${phone}', '${hash}', true, 'USER', NOW(), NOW());`);
