import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from 'path';

// Load .env manually
const loadEnv = (filePath: string) => {
    if (fs.existsSync(filePath)) {
        const envConfig = fs.readFileSync(filePath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, ...rest] = line.split('=');
            const value = rest.join('=');
            if (key && value) {
                let val = value.trim();
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.slice(1, -1);
                }
                process.env[key.trim()] = val;
            }
        });
    }
};

loadEnv(path.resolve(process.cwd(), '.env'));
loadEnv(path.resolve(process.cwd(), '.env.local'));

const prisma = new PrismaClient();

const S3_ENDPOINT = process.env.S3_ENDPOINT || "https://s3.ir-thr-at1.arvanstorage.ir";
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "videos";

const REAL_PDF_PATH = "books/file/8dc06c28-8710-40b7-86be-215f6d00d03b/____________-fa.pdf";
const REAL_AUDIO_PATH = "books/audio/b8a526b4-69b6-4fdc-8ab6-a407749a296e/Flip_Grater_-_Oh_My_Word.mp3";

const pdfUrl = `${S3_ENDPOINT}/${S3_BUCKET_NAME}/${REAL_PDF_PATH}`;
const audioUrl = `${S3_ENDPOINT}/${S3_BUCKET_NAME}/${REAL_AUDIO_PATH}`;

async function updateBooks() {
    console.log("در حال آپدیت کتاب‌ها با URL های واقعی S3...");
    console.log("PDF URL:", pdfUrl);
    console.log("Audio URL:", audioUrl);

    try {
        const result = await prisma.digitalBook.updateMany({
            data: {
                fileUrl: pdfUrl,
                audioUrl: audioUrl,
            },
        });

        console.log(`✅ تعداد ${result.count} کتاب با موفقیت آپدیت شد.`);
    } catch (error) {
        console.error("❌ خطا در آپدیت کتاب‌ها:", error);
    } finally {
        await prisma.$disconnect();
    }
}

updateBooks();
