/**
 * Test Admin Login Route
 * این script برای تست کردن ADMIN login است
 */

async function testAdminLogin() {
  const BASE_URL = "http://localhost:3000";

  console.log("🧪 تست Admin Login Route\n");

  // شماره‌های تستی
  const testCases = [
    {
      name: "✅ ADMIN User (باید موفق باشد)",
      phone: "09123456789", // باید ADMIN role داشته باشد
      password: "password123",
      shouldSucceed: true,
    },
    {
      name: "❌ Regular User (باید رد شود)",
      phone: "09987654321", // باید USER role داشته باشد
      password: "password123",
      shouldSucceed: false,
    },
  ];

  for (const testCase of testCases) {
    console.log(`\n📌 ${testCase.name}`);
    console.log(`   شماره: ${testCase.phone}`);
    console.log(`   رمز: ${testCase.password}`);
    console.log("-".repeat(60));

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: testCase.phone,
          password: testCase.password,
        }),
      });

      const data = await response.json();

      console.log(`\n📊 پاسخ:`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Success: ${data.status === "success" ? "✅ YES" : "❌ NO"}`);
      console.log(`   Message: ${data.message}`);

      if (data.data) {
        console.log(`   User ID: ${data.data.id}`);
        console.log(`   Role: ${data.data.role}`);
        console.log(`   Name: ${data.data.name || "N/A"}`);
      }

      if (data.errors) {
        console.log(`   Errors:`, data.errors);
      }

      // بررسی انتظار
      const isSuccess = data.status === "success";
      if (isSuccess === testCase.shouldSucceed) {
        console.log(`\n✅ تست: PASSED`);
      } else {
        console.log(`\n❌ تست: FAILED - نتیجه غیرمنتظره`);
      }
    } catch (error) {
      console.error(`\n❌ خطا:`, error.message);
    }

    console.log("\n" + "=".repeat(60));
  }

  console.log("\n✨ تست تمام شد!");
}

// اجرا
testAdminLogin().catch(console.error);
