// @/components/home/homeContent.tsx

import HomeContentClassic from "./classic/homeContentClassic";
import HomeContentV32 from "./v32/homeContentV32";
import { getHomeLayout } from "@/lib/services/settings-service";

export default async function HomePageContent() {
  const layout = await getHomeLayout();

  // ponytail: forced v32 for active editing — revert to `layout === "v32"` when switch is tested via admin
  return <HomeContentV32 />;
}
