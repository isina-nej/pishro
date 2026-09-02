// @/components/home/v32/homeContentV32.tsx

import V32LandingPage from "./V32LandingPage";
import FloatingNotificationManager from "@/components/utils/floatingNotificationManager";
import { getHiddenPages } from "@/lib/services/settings-service";
import { createVisibility } from "@/lib/site/hidable-pages";

export default async function HomeContentV32() {
  const { show } = createVisibility(await getHiddenPages());

  return (
    <>
      <V32LandingPage
        showHero={show("home:hero")}
        showAudience={show("home:mobile-view")}
        showCalculator={show("home:calculator")}
        showHelp={show("home:news")}
      />
      {show("home:notifications") && <FloatingNotificationManager />}
    </>
  );
}
