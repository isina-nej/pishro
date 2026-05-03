import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function GET(_req: NextRequest) {
  try {
    // Create directories
    const pdfDir = join(process.cwd(), "public", "uploads", "books", "pdfs");
    const coverDir = join(process.cwd(), "public", "uploads", "books", "covers");
    
    await mkdir(pdfDir, { recursive: true });
    await mkdir(coverDir, { recursive: true });

    // Create a simple test PDF
    const pdfContent = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000074 00000 n\n0000000133 00000 n\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n211\n%%EOF");
    
    // Create a 1x1 transparent PNG
    const pngContent = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82,
    ]);

    await writeFile(join(pdfDir, "test-book.pdf"), pdfContent);
    await writeFile(join(coverDir, "test-cover.jpg"), pngContent);

    return Response.json({
      message: "Test files created successfully",
      files: {
        pdf: `${pdfDir}/test-book.pdf`,
        cover: `${coverDir}/test-cover.jpg`,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Error creating test files:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
