import FaqPageContent from "@/components/faq/pageContent";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPublishedFaqs() {
  try {
    const rows = await prisma.fAQ.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: 80,
      select: {
        id: true,
        question: true,
        answer: true,
      },
    });

    // Seed generator can repeat question copy — keep first occurrence only.
    const seen = new Set<string>();
    const unique: Array<{ id: string; question: string; answer: string }> = [];
    for (const row of rows) {
      const key = row.question.trim();
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(row);
      if (unique.length >= 40) break;
    }
    return unique;
  } catch (error) {
    console.error("Failed to load FAQs:", error);
    return [];
  }
}

const FaqPage = async () => {
  const items = await getPublishedFaqs();

  return (
    <div>
      <FaqPageContent items={items} />
    </div>
  );
};

export default FaqPage;
