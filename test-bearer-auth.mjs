/**
 * Test Bearer Token Authentication
 * Tests if admin APIs now accept Bearer token from pishro-admin-main frontend
 */

import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key";
const API_BASE_URL = "http://localhost:3000/api";

async function getAdminUser() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "pishro",
  });

  try {
    const [admins] = await connection.execute(
      "SELECT id, phone, role FROM `User` WHERE role = 'ADMIN' LIMIT 1"
    );

    if (admins.length === 0) {
      console.error("❌ هیچ ADMIN user پیدا نشد!");
      return null;
    }

    return admins[0];
  } finally {
    await connection.end();
  }
}

function createBearerToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      role: user.role,
    },
    NEXTAUTH_SECRET,
    { expiresIn: "30d" }
  );

  return token;
}

async function testAdminAPI(endpoint, method = "GET", token) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  console.log(`\n📡 تستت: ${method} ${endpoint}`);
  console.log(`🔑 Token: ${token.substring(0, 20)}...`);

  try {
    const response = await fetch(url, {
      method,
      headers,
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ موفق! Status: ${response.status}`);
      console.log(`📦 Response:`, JSON.stringify(data, null, 2).substring(0, 200) + "...");
      return true;
    } else {
      console.log(`❌ خطا! Status: ${response.status}`);
      console.log(`📦 Response:`, JSON.stringify(data, null, 2).substring(0, 200) + "...");
      return false;
    }
  } catch (error) {
    console.error(`❌ درخواست ناموفق:`, error.message);
    return false;
  }
}

async function main() {
  console.log("🧪 تستت Bearer Token Authentication\n");
  console.log("=".repeat(50));

  // 1. Get admin user
  console.log("\n1️⃣ دریافت ADMIN user...");
  const adminUser = await getAdminUser();

  if (!adminUser) {
    console.error("❌ نمی‌تونیم ادیم یوز پیدا کنیم!");
    process.exit(1);
  }

  console.log(`✅ پیدا شد: ${adminUser.phone} (Role: ${adminUser.role})`);

  // 2. Create token
  console.log("\n2️⃣ ساختن Bearer Token...");
  const token = createBearerToken(adminUser);
  console.log(`✅ Token ساخته شد: ${token.substring(0, 30)}...`);

  // 3. Test APIs
  console.log("\n3️⃣ تستت Admin APIs...");

  const endpoints = [
    "/admin/courses",
    "/admin/users",
    "/admin/books",
    "/admin/videos",
  ];

  let successCount = 0;
  for (const endpoint of endpoints) {
    const success = await testAdminAPI(endpoint, "GET", token);
    if (success) successCount++;
    await new Promise((r) => setTimeout(r, 500)); // Rate limiting
  }

  console.log("\n" + "=".repeat(50));
  console.log(`\n📊 نتیجه: ${successCount}/${endpoints.length} APIs موفق بود`);

  if (successCount === endpoints.length) {
    console.log("✅ Bearer Token Authentication درست کار می‌کنه! 🎉");
  } else {
    console.log("⚠️  بعضی از APIs هنوز مشکل دارن");
  }
}

main().catch(console.error);
