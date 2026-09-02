// @/components/home/homeContent.tsx

import HomeContentClassic from "./classic/homeContentClassic";
import HomeContentV32 from "./v32/homeContentV32";
import { getHomeLayout } from "@/lib/services/settings-service";

export default async function HomePageContent() {
  const layout = await getHomeLayout();

  if (layout === "v32") {
    return <HomeContentV32 />;
  }

  return <HomeContentClassic />;
}
