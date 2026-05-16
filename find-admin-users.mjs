/**
 * Find Admin Users in Database
 */

import mysql from "mysql2/promise";

async function findAdminUsers() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "pishro",
  });

  try {
    console.log("🔍 جستجو برای ADMIN users...\n");

    const [admins] = await connection.execute(
      "SELECT id, phone, firstName, lastName, email, role, phoneVerified FROM `User` WHERE role = 'ADMIN' LIMIT 10"
    );

    if (admins.length === 0) {
      console.log("❌ هیچ ADMIN user پیدا نشد!\n");
      return;
    }

    console.log(`✅ یافت شد ${admins.length} ADMIN user:\n`);
    console.log("ID | Phone | Name | Email | Verified");
    console.log("-".repeat(70));

    admins.forEach((user) => {
      const name = user.firstName
        ? `${user.firstName} ${user.lastName || ""}`
        : "N/A";
      console.log(
        `${user.id} | ${user.phone} | ${name} | ${user.email || "N/A"} | ${user.phoneVerified ? "✅" : "❌"}`
      );
    });

    console.log("\n💡 برای تست از یکی از شماره‌های بالا استفاده کنید:");
    console.log(
      `   - شماره: ${admins[0].phone}`
    );
    console.log(`   - رمز: (شماره + رمز صحیح بسازید)`);
  } finally {
    await connection.end();
  }
}

findAdminUsers().catch(console.error);
