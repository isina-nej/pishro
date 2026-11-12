import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";

/** Private objects are denied by default. Free published books and admin previews only. */
export async function canReadPrivateBookUpload(request: Request, relativePath: string): Promise<boolean> {
  const key = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!/^books\/(pdfs|audio)\/[^/]+$/i.test(key)) return false;
  const admin = await getAdminAuth(request);
  if (admin?.role === "ADMIN") return true;
  const book = await prisma.digitalBook.findFirst({
    where: {
      bookStatus: "PUBLISHED",
      OR: [{ price: null }, { price: { lte: 0 } }],
      AND: [{ OR: [
        { fileUrl: { endsWith: `/${key}` } },
        { audioUrl: { endsWith: `/${key}` } },
      ] }],
    },
    select: { id: true },
  });
  return Boolean(book);
}
