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

async function fixPassword() {
  const connection = await pool.getConnection();
  try {
    const phone = "09167991896";
    const newPassword = "sinasina";

    // Generate correct bcrypt hash
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("🔐 Generated hash:", hashedPassword);

    // Update password with prepared statement (safe from SQL injection)
    const result = await connection.query(
      "UPDATE `User` SET passwordHash = ? WHERE phone = ?",
      [hashedPassword, phone]
    );

    console.log("✅ Password updated successfully!");

    // Verify update
    const [rows] = await connection.query(
      "SELECT phone, passwordHash FROM `User` WHERE phone = ?",
      [phone]
    );

    if (rows.length > 0) {
      console.log("\n✅ Verification:");
      console.log(`  Phone: ${rows[0].phone}`);
      console.log(`  New Hash: ${rows[0].passwordHash}`);

      // Test password
      const isValid = await bcrypt.compare(newPassword, rows[0].passwordHash);
      console.log(`  Password Test: ${isValid ? "✅ VALID" : "❌ INVALID"}`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

fixPassword();
