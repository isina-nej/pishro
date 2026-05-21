import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "pishro",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function seedAdmin() {
  const connection = await pool.getConnection();
  try {
    const adminId = randomUUID();
    const adminPhone = "09123456789";
    const testPassword = "Admin@123";
    
    // Hash the password
    const adminPassword = await bcrypt.hash(testPassword, 10);
    console.log("Generated hash:", adminPassword);
    
    // Delete existing user
    await connection.query("DELETE FROM `User` WHERE phone = ?", [adminPhone]);
    console.log("✅ Deleted existing user");

    // Insert new admin user
    await connection.query(
      `INSERT INTO \`User\` (id, phone, passwordHash, phoneVerified, role, firstName, lastName, email, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [adminId, adminPhone, adminPassword, true, "ADMIN", "مدیر", "سیستم", "admin@pishro.com"]
    );

    console.log("✅ Admin user seeded successfully!");
    console.log(`Phone: ${adminPhone}`);
    console.log(`Password: ${testPassword}`);
    
    // Verify it works
    const [rows] = await connection.query(
      "SELECT passwordHash FROM `User` WHERE phone = ?",
      [adminPhone]
    );
    
    const isValid = await bcrypt.compare(testPassword, rows[0].passwordHash);
    console.log(`\n🔐 Password verification: ${isValid ? "✅ VALID" : "❌ INVALID"}`);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedAdmin();
