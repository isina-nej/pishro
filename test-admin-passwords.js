/**
 * Test Admin Login with Correct Password
 */

async function testAdminLogin() {
  const BASE_URL = "http://localhost:3000";

  const testCases = [
    {
      name: "ADMIN Login - Common Passwords",
      phone: "09123456789",
      passwords: [
        "admin123456",
        "Admin@12345",
        "123456789",
        "adminforfun",
        "pishroAdmin123",
        "12345678",
      ],
    },
  ];

  console.log("🔐 تست رمزهای مختلف برای ADMIN (09123456789)\n");
  console.log("=".repeat(70));

  for (const testCase of testCases) {
    for (const password of testCase.passwords) {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: testCase.phone,
            password: password,
          }),
        });

        const data = await response.json();
        const isSuccess = data.status === "success";

        if (isSuccess) {
          console.log(`\n✅ SUCCESS! رمز صحیح پیدا شد!\n`);
          console.log(`   شماره: ${testCase.phone}`);
          console.log(`   رمز: ${password}`);
          console.log(`   نام: ${data.data?.name || "N/A"}`);
          console.log(`   Role: ${data.data?.role}`);
          console.log(`   ID: ${data.data?.id}`);
          return;
        } else {
          console.log(
            `❌ ${password.padEnd(15)} | ${data.message}`
          );
        }
      } catch (error) {
        console.log(`⚠️  ${password.padEnd(15)} | خطا: ${error.message}`);
      }
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("\n💡 اگر هیچ رمزی جواب نداد:");
  console.log("   1. پنل ادمین را تست کنید");
  console.log("   2. یا seed database را دوباره اجرا کنید");
}

testAdminLogin().catch(console.error);
