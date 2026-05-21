import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "pishro",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function checkPassword() {
  const connection = await pool.getConnection();
  try {
    const adminPhone = "09123456789";
    const testPassword = "Admin@123";

    // Get the stored hash
    const [rows] = await connection.query(
      "SELECT id, phone, passwordHash, role FROM `User` WHERE phone = ?",
      [adminPhone]
    );

    if (rows.length === 0) {
      console.log("❌ User not found");
      return;
    }

    const user = rows[0];
    console.log("✅ User found:");
    console.log(`  Phone: ${user.phone}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Hash: ${user.passwordHash}`);

    // Test password
    const isValid = await bcrypt.compare(testPassword, user.passwordHash);
    console.log(`\n🔐 Password check: ${isValid ? "✅ VALID" : "❌ INVALID"}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

checkPassword();
