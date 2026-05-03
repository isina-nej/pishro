// @/scripts/video-processor-worker.ts
/**
 * Video Processing Worker
 * این اسکریپت به صورت دوره‌ای ویدیوهایی که آماده پردازش هستند را پیدا کرده و به HLS تبدیل می‌کند
 *
 * استفاده:
 * node scripts/video-processor-worker.js
 *
 * یا با cron (هر 5 دقیقه):
 * * /5 * * * * node /path/to/video-processor-worker.js
 */

import { getVideosReadyForProcessing } from "../lib/services/video-service";
import {
  processVideoToHLS,
  checkFFmpegAvailability,
} from "../lib/services/hls-transcoding-service";

const BATCH_SIZE = 3; // تعداد ویدیوهایی که هم‌زمان پردازش شوند
const RETRY_LIMIT = 3; // تعداد دفعات تلاش مجدد در صورت خطا

async function main() {
  console.log(`[${new Date().toISOString()}] Video Processor Worker started`);

  try {
    // بررسی وجود FFmpeg
    const { ffmpeg, ffprobe } = await checkFFmpegAvailability();

    if (!ffmpeg || !ffprobe) {
      console.error("❌ FFmpeg or FFprobe not found!");
      console.error("ffmpeg:", ffmpeg ? "✓" : "✗");
      console.error("ffprobe:", ffprobe ? "✓" : "✗");
      process.exit(1);
    }

    console.log("✓ FFmpeg is available");

    // دریافت ویدیوهای آماده پردازش
    const videos = await getVideosReadyForProcessing();

    if (videos.length === 0) {
      console.log("No videos to process");
      process.exit(0);
    }

    console.log(`Found ${videos.length} videos ready for processing`);

    // پردازش ویدیوها به صورت batch
    const batches = [];
    for (let i = 0; i < videos.length; i += BATCH_SIZE) {
      batches.push(videos.slice(i, i + BATCH_SIZE));
    }

    for (const [batchIndex, batch] of batches.entries()) {
      console.log(
        `\nProcessing batch ${batchIndex + 1}/${batches.length} (${batch.length} videos)`
      );

      // پردازش هم‌زمان ویدیوهای یک batch
      await Promise.allSettled(
        batch.map(async (video) => {
          try {
            console.log(`\n► Processing video: ${video.title} (${video.videoId})`);

            await processVideoToHLS(video.videoId, video.originalPath, {
              qualities: ["360p", "720p"],
              segmentDuration: 6,
              generateThumbnail: true,
            });

            console.log(`✓ Successfully processed: ${video.title}`);
          } catch (error) {
            console.error(`✗ Failed to process ${video.title}:`, error);
            // خطا لاگ می‌شود اما worker متوقف نمی‌شود
          }
        })
      );
    }

    console.log(`\n[${new Date().toISOString()}] Worker finished successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Worker error:", error);
    process.exit(1);
  }
}

// اجرای worker
main();
