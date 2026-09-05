// One-shot script: switch landing to v32 and exit
// Usage: npx tsx scripts/switch-to-v32.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.siteSettings.updateMany({
    data: { homeLayout: "v32" },
  });
  console.log(`✓ homeLayout set to "v32" (${result.count} row(s) updated)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
