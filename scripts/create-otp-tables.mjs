import mysql from 'mysql2/promise';

async function createTables() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
      database: 'pishro'
    });

    console.log('Connected to database');

    // Create Otp table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`Otp\` (
        \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
        \`phone\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
        \`code\` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
        \`expiresAt\` datetime NOT NULL,
        \`createdAt\` datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Otp table created');

    // Create TempUser table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`TempUser\` (
        \`id\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
        \`phone\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
        \`passwordHash\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
        \`createdAt\` datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ TempUser table created');

    // Show tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 All tables:', tables);

    await connection.end();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTables();
