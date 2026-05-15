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

async function verifyPassword() {
  const connection = await pool.getConnection();
  try {
    const phone = "09167991896";
    const testPassword = "sinasina";

    // Get the stored hash
    const [rows] = await connection.query(
      "SELECT id, phone, passwordHash, phoneVerified, role FROM `User` WHERE phone = ?",
      [phone]
    );

    if (rows.length === 0) {
      console.log("❌ User not found");
      return;
    }

    const user = rows[0];
    console.log("✅ User found:");
    console.log(`  ID: ${user.id}`);
    console.log(`  Phone: ${user.phone}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Phone Verified: ${user.phoneVerified}`);
    console.log(`  Stored Hash: ${user.passwordHash}`);

    // Test password
    const isValid = await bcrypt.compare(testPassword, user.passwordHash);
    console.log(`\n🔐 Testing password "${testPassword}": ${isValid ? "✅ VALID" : "❌ INVALID"}`);

    // If password is invalid, generate the correct hash and show it
    if (!isValid) {
      console.log("\n⚠️  Password doesn't match. Generating correct hash for this password:");
      const correctHash = await bcrypt.hash(testPassword, 10);
      console.log(`\nCorrect hash should be: ${correctHash}`);
      console.log("\nTo fix this, run:");
      console.log(`UPDATE \`User\` SET passwordHash = '${correctHash}' WHERE phone = '${phone}';`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

verifyPassword();
