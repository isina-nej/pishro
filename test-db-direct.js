import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "pishro",
});

async function checkUser() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT id, phone, role, phoneVerified FROM `User` WHERE phone = ?",
      ["09123456789"]
    );

    if (rows.length === 0) {
      console.log("❌ User not found in database");
      return;
    }

    console.log("✅ User found in database:");
    console.log(JSON.stringify(rows[0], null, 2));
    
    // List all users
    const [allUsers] = await connection.query("SELECT id, phone, role FROM `User` LIMIT 5");
    console.log("\n📋 All users in database:");
    console.log(JSON.stringify(allUsers, null, 2));
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

checkUser();
