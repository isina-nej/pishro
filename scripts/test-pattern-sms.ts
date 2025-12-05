import { sendOtpWithPattern } from "../lib/sms";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Try to load .env file manually if dotenv doesn't do it automatically
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath, override: true });
}

const phone = process.argv[2];

async function main() {
    console.log("🔍 بررسی تنظیمات Pattern-based SMS...");
    const username = process.env.MELIPAYAMAK_USERNAME;
    const password = process.env.MELIPAYAMAK_API_KEY;
    const sender = process.env.MELIPAYAMAK_SENDER;
    const patternCode = process.env.MELIPAYAMAK_PATTERN_CODE;

    if (!username) console.error("❌ MELIPAYAMAK_USERNAME وجود ندارد");
    else console.log("✅ MELIPAYAMAK_USERNAME تنظیم شده");

    if (!password) console.error("❌ MELIPAYAMAK_API_KEY وجود ندارد");
    else console.log("✅ MELIPAYAMAK_API_KEY تنظیم شده");

    if (!sender) console.error("❌ MELIPAYAMAK_SENDER وجود ندارد");
    else console.log("✅ MELIPAYAMAK_SENDER تنظیم شده");

    if (!patternCode) console.error("❌ MELIPAYAMAK_PATTERN_CODE وجود ندارد");
    else console.log("✅ MELIPAYAMAK_PATTERN_CODE تنظیم شده");

    if (!username || !password || !sender || !patternCode) {
        console.error("\n⚠️  لطفاً متغیرهای بالا را در فایل .env خود تنظیم کنید.");
        console.error("\n📝 برای دریافت Pattern Code:");
        console.error("   1. وارد پنل شوید: https://portal.melipayamak.com");
        console.error("   2. از منو 'پیامک الگویی' را انتخاب کنید");
        console.error("   3. الگوی جدید بسازید با متن:");
        console.error("      کد تایید شما: %code%");
        console.error("      این کد تا %expire% معتبر است.");
        console.error("   4. کد الگو را در .env اضافه کنید");
        process.exit(1);
    }

    if (phone) {
        console.log(`\n📤 در حال ارسال کد تایید به ${phone}...`);
        try {
            const testCode = Math.floor(1000 + Math.random() * 9000).toString();
            const res = await sendOtpWithPattern(phone, testCode);
            console.log("✅ پیامک با موفقیت ارسال شد!");
            console.log("📋 پاسخ API:", res);
            console.log(`\n💬 کد تایید ارسال شده: ${testCode}`);
        } catch (error) {
            console.error("❌ خطا در ارسال پیامک:", error);
        }
    } else {
        console.log("\n⚠️  شماره تلفن وارد نشده است.");
        console.log("📞 استفاده: npx tsx scripts/test-pattern-sms.ts <شماره_تلفن>");
    }
}

main();
