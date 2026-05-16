/**
 * Test Admin Login with Correct Password
 */

async function testAdminLogin() {
  const BASE_URL = "http://localhost:3000";

  console.log("🧪 تست Admin Login Route with Correct Password\n");
  console.log("=".repeat(70));

  const testCases = [
    {
      name: "✅ ADMIN User Login",
      phone: "09123456789",
      password: "Admin@123",
      shouldSucceed: true,
    },
    {
      name: "❌ Regular User Attempt (should fail with role check)",
      phone: "09987654321",
      password: "Admin@123",
      shouldSucceed: false,
    },
  ];

  for (const testCase of testCases) {
    console.log(`\n📌 ${testCase.name}`);
    console.log(`   شماره: ${testCase.phone}`);
    console.log(`   رمز: ${testCase.password}`);
    console.log("-".repeat(70));

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
      const isSuccess = data.status === "success";

      console.log(`\n📊 پاسخ:`);
      console.log(`   Status Code: ${response.status}`);
      console.log(`   Success: ${isSuccess ? "✅ YES" : "❌ NO"}`);
      console.log(`   Message: ${data.message}`);

      if (data.data) {
        console.log(`\n   👤 کاربر:`);
        console.log(`      ID: ${data.data.id}`);
        console.log(`      نام: ${data.data.name || "N/A"}`);
        console.log(`      Role: ${data.data.role}`);
        console.log(`      شماره: ${data.data.phone}`);
        console.log(`      ایمیل: ${data.data.email || "N/A"}`);
        console.log(`      تایید شماره: ${data.data.phoneVerified ? "✅" : "❌"}`);
      }

      if (data.errors) {
        console.log(`   خطاها:`, JSON.stringify(data.errors, null, 2));
      }

      // بررسی نتیجه
      const testPassed = isSuccess === testCase.shouldSucceed;
      console.log(`\n📍 نتیجه تست: ${testPassed ? "✅ PASSED" : "❌ FAILED"}`);

      if (testPassed && isSuccess) {
        console.log(`\n✨ تست موفقیت‌آمیز!`);
        console.log(`   ADMIN user می‌تواند با موفقیت لاگین کند`);
        console.log(`   Role checking درست کار می‌کند! 🎉`);
      } else if (testPassed && !isSuccess) {
        console.log(`\n✨ تست موفقیت‌آمیز!`);
        console.log(`   Regular user به درستی رد شد`);
        console.log(`   Role checking درست کار می‌کند! 🎉`);
      }
    } catch (error) {
      console.error(`\n❌ خطا:`, error.message);
    }

    console.log("\n" + "=".repeat(70));
  }

  console.log("\n✨ تست تمام شد!");
}

testAdminLogin().catch(console.error);
