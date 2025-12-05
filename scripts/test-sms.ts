
import { sendSmsMelipayamak } from "../lib/sms";
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
    console.log("Checking Melipayamak configuration...");
    const username = process.env.MELIPAYAMAK_USERNAME;
    const password = process.env.MELIPAYAMAK_API_KEY;
    const sender = process.env.MELIPAYAMAK_SENDER;

    if (!username) console.error("❌ MELIPAYAMAK_USERNAME is missing");
    else console.log("✅ MELIPAYAMAK_USERNAME is set");

    if (!password) console.error("❌ MELIPAYAMAK_API_KEY is missing");
    else console.log("✅ MELIPAYAMAK_API_KEY is set");

    if (!sender) console.error("❌ MELIPAYAMAK_SENDER is missing");
    else console.log("✅ MELIPAYAMAK_SENDER is set");

    if (!username || !password || !sender) {
        console.error("Please set these variables in your .env file.");
        process.exit(1);
    }

    if (phone) {
        console.log(`Attempting to send SMS to ${phone}...`);
        try {
            const res = await sendSmsMelipayamak(phone, "Test SMS from Pishro Debugger");
            console.log("✅ SMS sent successfully:", res);
        } catch (error) {
            console.error("❌ Failed to send SMS:", error);
        }
    } else {
        console.log("No phone number provided. Skipping send test.");
        console.log("Usage: npx tsx scripts/test-sms.ts <phone_number>");
    }
}

main();
