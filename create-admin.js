import bcrypt from 'bcryptjs';
import pkg from 'mongodb';
const { MongoClient } = pkg;

async function createAdmin() {
  const mongoUrl = process.env.DATABASE_URL || 'mongodb://admin:admin123456@localhost:27017/pishro?authSource=admin';
  const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });

  try {
    console.log('🔐 Creating admin user via MongoDB...');
    await client.connect();

    const db = client.db('pishro');
    const usersCollection = db.collection('User');

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const phone = '09123456789';
    const email = 'admin@pishro.com';

    // Check if admin exists
    let admin = await usersCollection.findOne({ phone });

    if (admin) {
      console.log('👤 Admin user found, updating password...');
      const result = await usersCollection.updateOne(
        { phone },
        {
          $set: {
            passwordHash: adminPassword,
            phoneVerified: true,
            role: 'ADMIN',
            updatedAt: new Date(),
          },
        }
      );
      console.log('Updated:', result.modifiedCount);
    } else {
      console.log('➕ Creating new admin user...');
      const result = await usersCollection.insertOne({
        phone,
        passwordHash: adminPassword,
        phoneVerified: true,
        role: 'ADMIN',
        firstName: 'مدیر',
        lastName: 'سیستم',
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      admin = await usersCollection.findOne({ _id: result.insertedId });
    }

    console.log('');
    console.log('✅ Admin user created/updated successfully!');
    console.log('─────────────────────────────────');
    console.log('📧 Email:     ' + admin.email);
    console.log('📱 Phone:     ' + admin.phone);
    console.log('🔐 Password:  Admin@123');
    console.log('👤 Role:      ' + admin.role);
    console.log('─────────────────────────────────');
    console.log('');
    console.log('🎯 You can now login to:');
    console.log('   https://admin.pishrosarmaye.com/auth/login');
    console.log('   OR');
    console.log('   https://pishro-admin.vercel.app/auth/login');
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

createAdmin();
