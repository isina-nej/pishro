/** Homepage layout variants — admin-selectable in SiteSettings.homeLayout */

export const HOME_LAYOUTS = ["classic", "v32"] as const;
export type HomeLayout = (typeof HOME_LAYOUTS)[number];

export const DEFAULT_HOME_LAYOUT: HomeLayout = "classic";

export const HOME_LAYOUT_LABELS: Record<
  HomeLayout,
  { title: string; description: string }
> = {
  classic: {
    title: "لندینگ کلاسیک",
    description:
      "هیرو ویدیوی سکه‌ها، اسکرولر موبایل، ماشین‌حساب، دوره‌ها و نظرات — نسخهٔ فعلی سایت.",
  },
  v32: {
    title: "لندینگ سرمایه ساده (نسخه ۳۲)",
    description:
      "طرح کامل نسخه ۳۲: هیرو با موبایل، سکه‌ها، ابزارها، ماشین‌حساب و FAQ — رنگ‌ها از پالت سایت.",
  },
};

export function isValidHomeLayout(value: string): value is HomeLayout {
  return (HOME_LAYOUTS as readonly string[]).includes(value);
}

export function parseHomeLayout(
  value: string | null | undefined
): HomeLayout {
  if (value && isValidHomeLayout(value)) return value;
  return DEFAULT_HOME_LAYOUT;
}
