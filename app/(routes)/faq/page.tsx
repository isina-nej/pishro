import type { Metadata } from "next";
import FaqPageContent from "@/components/faq/pageContent";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "سوالات متداول | پیشرو",
  description: "پاسخ پرسش‌های پرتکرار درباره دوره‌ها، سرمایه‌ گذاری و پشتیبانی پیشرو.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "سوالات متداول | پیشرو",
    description: "پاسخ پرسش‌های پرتکرار درباره دوره‌ها، سرمایه‌ گذاری و پشتیبانی پیشرو.",
    type: "website",
  },
};

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

  const faqJsonLd = items.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <div>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <FaqPageContent items={items} />
    </div>
  );
};

export default FaqPage;
