import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Load .env and .env.local manually
const files = [".env", ".env.local"];

files.forEach(file => {
    const envPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(envPath)) {
        console.log(`Loading ${file}...`);
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split(/\r?\n/).forEach(line => {
            const parts = line.split('=');
            if (parts.length > 1) {
                const key = parts.shift()?.trim();
                const value = parts.join('=').trim();
                if (key && value && !key.startsWith("#")) {
                    const cleanValue = value.replace(/^["'](.*)["']$/, '$1');
                    process.env[key] = cleanValue;
                }
            }
        });
    } else {
        console.log(`${file} not found.`);
    }
});

console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
    console.log("Checking InvestmentPlans table...");
    const count = await prisma.investmentPlans.count();
    console.log(`Total records: ${count}`);

    if (count > 0) {
        const first = await prisma.investmentPlans.findFirst();
        console.log("First record:", JSON.stringify(first, null, 2));

        // Check published status specifically
        const publishedCount = await prisma.investmentPlans.count({
            where: { published: true }
        });
        console.log(`Published records: ${publishedCount}`);

    } else {
        console.log("Table is empty!");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
