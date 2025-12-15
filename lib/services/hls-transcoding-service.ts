// @/lib/services/hls-transcoding-service.ts
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import {
  downloadFileFromStorage,
  uploadFileToStorage,
  getHLSStoragePath,
} from "./object-storage-service";
import {
  updateVideoProcessingStatus,
  updateVideoHLS,
} from "./video-service";
import type { HLSProcessingOptions } from "@/types/video";

/**
 * مسیر موقت برای ذخیره فایل‌ها در حین پردازش
 */
const TEMP_DIR = process.env.TEMP_DIR || "/tmp/video-processing";

/**
 * تنظیمات پیش‌فرض HLS
 */
const DEFAULT_HLS_OPTIONS: Required<HLSProcessingOptions> = {
  qualities: ["360p", "720p"],
  segmentDuration: 6, // 6 ثانیه
  generateThumbnail: true,
};

/**
 * تنظیمات quality برای هر سطح
 */
const _QUALITY_SETTINGS = {
  "360p": { width: 640, height: 360, bitrate: "800k" },
  "480p": { width: 854, height: 480, bitrate: "1400k" },
  "720p": { width: 1280, height: 720, bitrate: "2800k" },
  "1080p": { width: 1920, height: 1080, bitrate: "5000k" },
};

/**
 * ایجاد دایرکتوری موقت
 */
async function ensureTempDir(videoId: string): Promise<string> {
  const videoTempDir = path.join(TEMP_DIR, videoId);
  await fs.mkdir(videoTempDir, { recursive: true });
  return videoTempDir;
}

/**
 * پاکسازی دایرکتوری موقت
 */
async function cleanupTempDir(videoId: string): Promise<void> {
  const videoTempDir = path.join(TEMP_DIR, videoId);
  try {
    await fs.rm(videoTempDir, { recursive: true, force: true });
  } catch (error) {
    console.error("Error cleaning up temp dir:", error);
  }
}

/**
 * دانلود ویدیو از storage به temp directory
 */
async function downloadVideoToTemp(
  videoId: string,
  originalPath: string
): Promise<string> {
  try {
    const tempDir = await ensureTempDir(videoId);
    const localPath = path.join(tempDir, "input.mp4");

    const fileBuffer = await downloadFileFromStorage(originalPath);
    await fs.writeFile(localPath, fileBuffer);

    return localPath;
  } catch (error) {
    console.error("Error downloading video to temp:", error);
    throw new Error("خطا در دانلود ویدیو");
  }
}

/**
 * تبدیل ویدیو به HLS با FFmpeg
 */
async function transcodeToHLS(
  inputPath: string,
  outputDir: string,
  options: HLSProcessingOptions
): Promise<{
  playlistPath: string;
  segmentsDir: string;
}> {
  return new Promise((resolve, reject) => {
    const mergedOptions = { ...DEFAULT_HLS_OPTIONS, ...options };
    const { qualities: _qualities, segmentDuration } = mergedOptions;

    const outputPlaylist = path.join(outputDir, "index.m3u8");

    // ساخت آرگومنت‌های FFmpeg برای multi-quality HLS
    const ffmpegArgs: string[] = [
      "-i",
      inputPath,
      "-c:v",
      "libx264", // کدک ویدیو
      "-c:a",
      "aac", // کدک صدا
      "-hls_time",
      segmentDuration.toString(),
      "-hls_playlist_type",
      "vod",
      "-hls_segment_filename",
      path.join(outputDir, "segment_%03d.ts"),
      "-f",
      "hls",
      outputPlaylist,
    ];

    // اجرای FFmpeg
    const ffmpeg = spawn("ffmpeg", ffmpegArgs);

    let errorOutput = "";

    ffmpeg.stderr.on("data", (data) => {
      errorOutput += data.toString();
      // می‌توانید progress را از stderr استخراج کنید
      console.log("FFmpeg:", data.toString());
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve({
          playlistPath: outputPlaylist,
          segmentsDir: outputDir,
        });
      } else {
        reject(
          new Error(`FFmpeg exited with code ${code}: ${errorOutput}`)
        );
      }
    });

    ffmpeg.on("error", (err) => {
      reject(new Error(`FFmpeg error: ${err.message}`));
    });
  });
}

/**
 * تولید thumbnail از ویدیو
 */
async function generateThumbnail(
  inputPath: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpegArgs = [
      "-i",
      inputPath,
      "-ss",
      "00:00:01", // ثانیه اول
      "-vframes",
      "1",
      "-vf",
      "scale=1280:-1", // عرض 1280، ارتفاع خودکار
      outputPath,
    ];

    const ffmpeg = spawn("ffmpeg", ffmpegArgs);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg thumbnail generation failed with code ${code}`));
      }
    });

    ffmpeg.on("error", (err) => {
      reject(new Error(`FFmpeg thumbnail error: ${err.message}`));
    });
  });
}

/**
 * آپلود فایل‌های HLS به storage
 */
async function uploadHLSFiles(
  videoId: string,
  localDir: string
): Promise<{
  playlistPath: string;
  segmentsPath: string;
}> {
  try {
    const files = await fs.readdir(localDir);
    const hlsBasePath = getHLSStoragePath(videoId);

    // آپلود همه فایل‌ها
    await Promise.all(
      files.map(async (file) => {
        const localPath = path.join(localDir, file);
        const storagePath = `${hlsBasePath}/${file}`;

        const fileBuffer = await fs.readFile(localPath);

        const contentType = file.endsWith(".m3u8")
          ? "application/vnd.apple.mpegurl"
          : "video/MP2T";

        await uploadFileToStorage(storagePath, fileBuffer, contentType);
      })
    );

    return {
      playlistPath: `${hlsBasePath}/index.m3u8`,
      segmentsPath: hlsBasePath,
    };
  } catch (error) {
    console.error("Error uploading HLS files:", error);
    throw new Error("خطا در آپلود فایل‌های HLS");
  }
}

/**
 * آپلود thumbnail به storage
 */
async function uploadThumbnail(
  videoId: string,
  localPath: string
): Promise<string> {
  try {
    const fileName = `thumbnail_${Date.now()}.jpg`;
    const storagePath = `thumbnails/${videoId}/${fileName}`;

    const fileBuffer = await fs.readFile(localPath);
    await uploadFileToStorage(storagePath, fileBuffer, "image/jpeg");

    return storagePath;
  } catch (error) {
    console.error("Error uploading thumbnail:", error);
    throw new Error("خطا در آپلود thumbnail");
  }
}

/**
 * استخراج metadata از ویدیو با ffprobe
 */
export async function extractVideoMetadata(filePath: string): Promise<{
  duration: string;
  width: number;
  height: number;
  bitrate: number;
  codec: string;
  frameRate: number;
}> {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v",
      "quiet",
      "-print_format",
      "json",
      "-show_format",
      "-show_streams",
      filePath,
    ]);

    let output = "";

    ffprobe.stdout.on("data", (data) => {
      output += data.toString();
    });

    ffprobe.on("close", (code) => {
      if (code === 0) {
        try {
          const data = JSON.parse(output);
          const videoStream = data.streams.find(
            (s: { codec_type: string }) => s.codec_type === "video"
          );

          if (!videoStream) {
            reject(new Error("No video stream found"));
            return;
          }

          // محاسبه duration به فرمت HH:MM:SS
          const durationSeconds = parseFloat(data.format.duration || 0);
          const hours = Math.floor(durationSeconds / 3600);
          const minutes = Math.floor((durationSeconds % 3600) / 60);
          const seconds = Math.floor(durationSeconds % 60);
          const duration = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

          // محاسبه frame rate
          const frameRateParts = videoStream.r_frame_rate.split("/");
          const frameRate =
            parseInt(frameRateParts[0]) / parseInt(frameRateParts[1]);

          resolve({
            duration,
            width: videoStream.width,
            height: videoStream.height,
            bitrate: parseInt(data.format.bit_rate || 0),
            codec: videoStream.codec_name,
            frameRate,
          });
        } catch {
          reject(new Error("Failed to parse ffprobe output"));
        }
      } else {
        reject(new Error(`ffprobe failed with code ${code}`));
      }
    });

    ffprobe.on("error", (err) => {
      reject(new Error(`ffprobe error: ${err.message}`));
    });
  });
}

/**
 * پردازش کامل ویدیو: دانلود، تبدیل به HLS، آپلود
 * این تابع به صورت async اجرا می‌شود و نتیجه را در دیتابیس update می‌کند
 */
export async function processVideoToHLS(
  videoId: string,
  originalPath: string,
  options: HLSProcessingOptions = {}
): Promise<void> {
  try {
    console.log(`Starting HLS processing for video ${videoId}`);

    // تغییر وضعیت به PROCESSING
    await updateVideoProcessingStatus(videoId, "PROCESSING");

    // دانلود ویدیو به temp
    const localInputPath = await downloadVideoToTemp(videoId, originalPath);

    // ایجاد output directory
    const tempDir = path.join(TEMP_DIR, videoId);
    const hlsOutputDir = path.join(tempDir, "hls");
    await fs.mkdir(hlsOutputDir, { recursive: true });

    // تبدیل به HLS
    const { playlistPath: _playlistPath, segmentsDir: _segmentsDir } = await transcodeToHLS(
      localInputPath,
      hlsOutputDir,
      options
    );

    console.log(`HLS transcoding completed for video ${videoId}`);

    // تولید thumbnail اگر فعال باشد
    let thumbnailPath: string | undefined;
    if (options.generateThumbnail !== false) {
      const thumbnailLocalPath = path.join(tempDir, "thumbnail.jpg");
      await generateThumbnail(localInputPath, thumbnailLocalPath);
      thumbnailPath = await uploadThumbnail(videoId, thumbnailLocalPath);
      console.log(`Thumbnail generated for video ${videoId}`);
    }

    // آپلود فایل‌های HLS به storage
    const { playlistPath: storagePlPath, segmentsPath: storageSegPath } =
      await uploadHLSFiles(videoId, hlsOutputDir);

    console.log(`HLS files uploaded for video ${videoId}`);

    // بروزرسانی دیتابیس
    await updateVideoHLS(videoId, storagePlPath, storageSegPath);

    // بروزرسانی thumbnail اگر تولید شده باشد
    if (thumbnailPath) {
      const { updateVideo } = await import("./video-service");
      await updateVideo(videoId, { thumbnailPath });
    }

    console.log(`Video ${videoId} processing completed successfully`);

    // پاکسازی فایل‌های موقت
    await cleanupTempDir(videoId);
  } catch (error) {
    console.error(`Error processing video ${videoId}:`, error);

    // ثبت خطا در دیتابیس
    await updateVideoProcessingStatus(
      videoId,
      "FAILED",
      error instanceof Error ? error.message : "خطای نامشخص"
    );

    // پاکسازی فایل‌های موقت
    await cleanupTempDir(videoId);

    throw error;
  }
}

/**
 * بررسی وجود FFmpeg
 */
export async function checkFFmpegAvailability(): Promise<{
  ffmpeg: boolean;
  ffprobe: boolean;
}> {
  const checkCommand = (command: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const process = spawn(command, ["-version"]);
      process.on("close", (code) => resolve(code === 0));
      process.on("error", () => resolve(false));
    });
  };

  const [ffmpeg, ffprobe] = await Promise.all([
    checkCommand("ffmpeg"),
    checkCommand("ffprobe"),
  ]);

  return { ffmpeg, ffprobe };
}
