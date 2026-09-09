/**
 * پک‌های ایموجی متحرک پنل ادمین + روش افزودن پک جدید توسط ادمین.
 *
 * رندر: WebP متحرک (پشتیبانی native مرورگر، بدون پلیر اضافه).
 * منبع فایل‌های داخلی: Telemoji (ایموجی‌های متحرک تلگرام، ۱۱۹۲ آیتم) —
 * مرورگر و جستجوی همه آیتم‌ها: https://saeedtahmtan.github.io/telemoji/
 *
 * افزودن پک جدید (بدون نیاز به کدنویس):
 *  ۱. در مرورگر Telemoji (یا LottieFiles / tgkit.io) پک را پیدا کنید و
 *     آدرس WebP هر ایموجی را کپی کنید (یا فایل‌ها را در public بگذارید).
 *  ۲. فایل public/animated-emoji/custom-packs.json را از روی
 *     custom-packs.example.json بسازید و آیتم‌ها را اضافه کنید.
 *  ۳. خودش در پیکر ادمین (تب جدا + جستجوی سراسری) ظاهر می‌شود؛ ری‌استارت لازم نیست.
 */

export interface AnimatedEmojiItem {
  id: string;
  char: string;
  fa: string;
  keywords: string[];
  src: string;
}

export interface AnimatedEmojiPack {
  id: string;
  title: string;
  items: AnimatedEmojiItem[];
}

const TELEM = "https://saeedtahmtan.github.io/telemoji";
const W = (file: string) => `${TELEM}/${file}`;

function item(
  id: string,
  char: string,
  fa: string,
  keywords: string[],
  file: string,
): AnimatedEmojiItem {
  return { id, char, fa, keywords, src: W(file) };
}

export const BUILTIN_EMOJI_PACKS: AnimatedEmojiPack[] = [
  {
    id: "money",
    title: "مالی و موفقیت",
    items: [
      item("tg-money-bag", "💰", "کیسه پول", ["money", "پول", "مالی", "ثروت", "درآمد"], "webp/animated/U+1F4B0_1.webp"),
      item("tg-money-wings", "💸", "پول پرنده", ["money", "پول", "هزینه", "خرج", "سود"], "webp/animated/U+1F4B8_1.webp"),
      item("tg-gem", "💎", "الماس", ["gem", "الماس", "ارزشمند", "ویژه"], "webp/animated/U+1F48E_1.webp"),
      item("tg-rich", "🤑", "پول‌دار", ["rich", "پولدار", "ثروتمند", "سود"], "webp/animated/U+1F911_1.webp"),
      item("tg-chart-up", "📈", "نمودار صعودی", ["chart", "نمودار", "رشد", "صعود", "بورس", "ترید"], "webp/animated/U+1F4C8_1.webp"),
      item("tg-chart-down", "📉", "نمودار نزولی", ["chart", "نمودار", "افت", "نزول", "ریزش"], "webp/animated/U+1F4C9_1.webp"),
      item("tg-coin", "🪙", "سکه", ["coin", "سکه", "کریپتو", "ارز"], "webp/animated/U+1FA99_1.webp"),
      item("tg-currency", "💱", "تبدیل ارز", ["currency", "ارز", "صرافی", "تبدیل"], "webp/animated/U+1F4B1_1.webp"),
      item("tg-idea", "💡", "ایده", ["idea", "ایده", "لامپ", "راهنما", "نکته"], "webp/animated/U+1F4A1_1.webp"),
      item("tg-handshake", "🤝", "توافق", ["deal", "توافق", "قرارداد", "همکاری"], "webp/animated/U+1F91D_1.webp"),
      item("tg-rocket", "🚀", "راکت", ["rocket", "راکت", "رشد", "پرواز", "شتاب"], "webp/animated/U+1F680_1.webp"),
      item("tg-trophy", "🏆", "جام قهرمانی", ["trophy", "جام", "قهرمان", "برد", "جایزه"], "webp/animated/U+1F3C6_1.webp"),
    ],
  },
  {
    id: "edu",
    title: "آموزش و آزمون",
    items: [
      item("tg-grad", "🎓", "فارغ‌التحصیلی", ["grad", "فارغ التحصیلی", "دانشجو", "مدرک", "دوره"], "webp/animated/U+1F393_1.webp"),
      item("tg-books", "📚", "کتاب‌ها", ["books", "کتاب", "مطالعه", "کتابخانه"], "webp/animated/U+1F4DA_1.webp"),
      item("tg-memo", "📝", "یادداشت", ["memo", "یادداشت", "نوشتن", "جزوه"], "webp/animated/U+1F4DD_1.webp"),
      item("tg-news", "📰", "روزنامه", ["news", "خبر", "روزنامه", "مقاله"], "webp/animated/U+1F4F0_1.webp"),
      item("tg-mono", "🧐", "عینک دقیق", ["study", "مطالعه", "دقیق", "بررسی", "تحلیل"], "webp/animated/U+1F9D0_1.webp"),
      item("tg-teacher", "👨‍🏫", "مدرس", ["teacher", "مدرس", "معلم", "استاد", "کلاس"], "webp/animated/U+1F468_U+200D_U+1F3EB_1.webp"),
      item("tg-hourglass", "⏳", "ساعت شنی", ["time", "زمان", "صبر", "مهلت", "انتظار"], "webp/animated/U+23F3_1.webp"),
      item("tg-check", "✅", "تیک سبز", ["check", "تیک", "تایید", "درست", "انجام شد"], "webp/animated/U+2705_1.webp"),
      item("tg-100", "💯", "صد", ["100", "صد", "کامل", "نمره کامل"], "webp/animated/U+1F4AF_1.webp"),
      item("tg-clap", "👏", "دست زدن", ["clap", "تشویق", "دست", "آفرین"], "webp/animated/U+1F44F_1.webp"),
      item("tg-muscle", "💪", "قدرت", ["strong", "قدرت", "قوی", "تلاش"], "webp/animated/U+1F4AA_1.webp"),
      item("tg-sparkles", "✨", "درخشش", ["sparkles", "درخشش", "جدید", "ویژه", "جادو"], "webp/animated/U+2728_1.webp"),
    ],
  },
  {
    id: "feelings",
    title: "احساسات",
    items: [
      item("tg-joy", "😂", "خنده", ["laugh", "خنده", "شادی", "خوشحال"], "webp/animated/U+1F602_1.webp"),
      item("tg-love-eyes", "😍", "عاشق", ["love", "عاشق", "علاقه", "دوست داشتن"], "webp/animated/U+1F60D_1.webp"),
      item("tg-kiss", "😘", "بوسه", ["kiss", "بوسه", "محبت"], "webp/animated/U+1F618_1.webp"),
      item("tg-heart", "❤", "قلب", ["heart", "قلب", "عشق", "علاقه"], "webp/animated/U+2764_2.webp"),
      item("tg-cool", "😎", "باحال", ["cool", "باحال", "عینک آفتابی"], "webp/animated/U+1F60E_1.webp"),
      item("tg-star-struck", "🤩", "ذوق‌زده", ["wow", "ذوق", "هیجان", "شگفت"], "webp/animated/U+1F929_1.webp"),
      item("tg-pleading", "🥺", "ملتمس", ["please", "خواهش", "لطفا", "ملتمس"], "webp/animated/U+1F97A_1.webp"),
      item("tg-think", "🤔", "فکر", ["think", "فکر", "تامل"], "webp/animated/U+1F914_1.webp"),
      item("tg-pray", "🙏", "دعا", ["pray", "دعا", "ممنون", "تشکر", "خواهش"], "webp/animated/U+1F64F_1.webp"),
      item("tg-like", "👍", "تایید", ["like", "تایید", "لایک", "خوب"], "webp/animated/U+1F44D_1.webp"),
      item("tg-chat", "💬", "گفتگو", ["chat", "گفتگو", "نظر", "کامنت", "پیام"], "webp/animated/U+1F4AC_1.webp"),
      item("tg-see-no", "🙈", "میمون", ["monkey", "میمون", "خجالت"], "webp/animated/U+1F648_1.webp"),
    ],
  },
  {
    id: "party",
    title: "جشن و انرژی",
    items: [
      item("tg-party", "🥳", "جشن", ["party", "جشن", "تبریک", "شادی"], "webp/animated/U+1F973_2.webp"),
      item("tg-fire", "🔥", "آتش", ["fire", "آتش", "داغ", "ترند", "پیشنهاد داغ"], "webp/animated/U+1F525_1.webp"),
      item("tg-popper", "🎉", "ترقه جشن", ["celebrate", "جشن", "تبریک", "موفقیت"], "webp/animated/U+1F389_1.webp"),
      item("tg-star", "⭐", "ستاره", ["star", "ستاره", "ویژه", "منتخب", "امتیاز"], "webp/animated/U+2B50_2.webp"),
      item("tg-target", "🎯", "هدف", ["target", "هدف", "نشانه", "دقت"], "webp/dice/U+1F3AF_1.webp"),
      item("tg-clapper", "🎬", "کلاکت", ["video", "ویدیو", "فیلم", "کلاس تصویری"], "webp/animated/U+1F3AC_1.webp"),
      item("tg-grin", "😁", "لبخند", ["smile", "لبخند", "خوشحال"], "webp/animated/U+1F601_1.webp"),
      item("tg-cry", "😢", "گریه", ["cry", "گریه", "ناراحت"], "webp/animated/U+1F622_1.webp"),
      item("tg-angry", "😡", "عصبانی", ["angry", "عصبانی", "خشم"], "webp/animated/U+1F621_1.webp"),
      item("tg-lips", "💋", "لب", ["kiss", "بوسه", "لب"], "webp/animated/U+1F48B_1.webp"),
    ],
  },
];

export interface CustomEmojiPackInput {
  id?: string;
  title?: string;
  items?: Array<{
    char?: string;
    fa?: string;
    keywords?: string[];
    src?: string;
  }>;
}

const MAX_CUSTOM_ITEMS = 200;

function isSafeSrc(src: string): boolean {
  return src.startsWith("https://") || src.startsWith("/");
}

/** اعتبارسنجی پک سفارشی ادمین؛ ورودی خراب را بی‌صدا حذف می‌کند. */
export function normalizeCustomPacks(input: unknown): AnimatedEmojiPack[] {
  if (!Array.isArray(input)) return [];
  const packs: AnimatedEmojiPack[] = [];
  for (const [pi, raw] of input.entries()) {
    const pack = raw as CustomEmojiPackInput;
    if (!pack || typeof pack !== "object") continue;
    const title = String(pack.title ?? "").trim();
    if (!title || !Array.isArray(pack.items)) continue;
    const id =
      String(pack.id ?? "")
        .trim()
        .replace(/[^a-z0-9-_]/gi, "")
        .slice(0, 40) || `custom-${pi + 1}`;
    const items: AnimatedEmojiItem[] = [];
    for (const [ii, r] of pack.items.slice(0, MAX_CUSTOM_ITEMS).entries()) {
      const src = String(r?.src ?? "").trim();
      if (!src || !isSafeSrc(src)) continue;
      const char = String(r?.char ?? "").trim().slice(0, 8);
      const fa = String(r?.fa ?? "").trim().slice(0, 60) || char || `ایموجی ${ii + 1}`;
      const keywords = Array.isArray(r?.keywords)
        ? r.keywords.map((k) => String(k).slice(0, 40)).filter(Boolean).slice(0, 8)
        : [];
      items.push({ id: `${id}-${ii}`, char, fa, keywords, src });
    }
    if (items.length > 0) packs.push({ id, title, items });
  }
  return packs;
}

/** خواندن پک‌های سفارشی از public (خرابی = آرایه خالی، بدون خطا). */
export async function loadCustomPacks(): Promise<AnimatedEmojiPack[]> {
  try {
    const res = await fetch("/animated-emoji/custom-packs.json", { cache: "no-store" });
    if (!res.ok) return [];
    return normalizeCustomPacks(await res.json());
  } catch {
    return [];
  }
}

function normalizeFa(value: string): string {
  return value.trim().toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک");
}

/** جستجو در همه پک‌ها: فارسی، انگلیسی، خود ایموجی. خالی = همه آیتم‌ها. */
export function searchAllEmoji(query: string, packs: AnimatedEmojiPack[]): AnimatedEmojiItem[] {
  const q = normalizeFa(query);
  const all = packs.flatMap((p) => p.items);
  if (!q) return all;
  return all.filter((it) => {
    const packTitle = packs.find((p) => p.items.includes(it))?.title ?? "";
    const hay = normalizeFa([it.char, it.fa, packTitle, ...it.keywords].join(" "));
    return q.split(/\s+/).filter(Boolean).every((part) => hay.includes(part));
  });
}
