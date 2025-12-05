import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';

// Load .env manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            let val = value.trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            process.env[key.trim()] = val;
        }
    });
}

const s3Config = {
    region: process.env.S3_REGION || "default",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true,
};

const s3Client = new S3Client(s3Config);
const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

async function listFiles() {
    console.log("Checking S3 bucket:", BUCKET_NAME);

    try {
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
        });

        const response = await s3Client.send(command);

        if (response.Contents) {
            console.log("Files found:");
            const extensions = ['.pdf', '.mp4', '.webm', '.mkv', '.mov', '.mp3'];
            response.Contents.forEach((file) => {
                const ext = path.extname(file.Key || '').toLowerCase();
                if (extensions.includes(ext)) {
                    console.log(`- ${file.Key} (Size: ${file.Size})`);
                }
            });
        } else {
            console.log("No files found in the bucket.");
        }
    } catch (error) {
        console.error("Error listing files:", error);
    }
}

listFiles();
