export interface HomeAlbumSlide {
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  published: boolean;
}

export const homeAlbumSlides: HomeAlbumSlide[] = [
  ['تحلیل تکنیکال حرفه‌ای', 'یادگیری اصول و تکنیک‌های پیشرفته تحلیل تکنیکال برای معامله‌گری موفق در بازارهای مالی', 'p01.webp'],
  ['مدیریت ریسک و سرمایه', 'آموزش اصولی مدیریت سرمایه و کنترل ریسک برای حفظ و رشد پایدار پورتفولیو', 'p02.webp'],
  ['استراتژی‌های معاملاتی', 'آشنایی با استراتژی‌های معاملاتی کاربردی برای بازارهای ارز دیجیتال و بورس', 'p03.webp'],
  ['روانشناسی معامله‌گری', 'تسلط بر احساسات و تصمیم‌گیری هوشمندانه در بازارهای پرنوسان مالی', 'p04.webp'],
  ['تحلیل بنیادی بازارها', 'شناخت عوامل بنیادی تأثیرگذار بر بازارهای مالی و تصمیم‌گیری آگاهانه', 'p05.webp'],
  ['معامله‌گری الگوریتمی', 'آموزش اصول معامله‌گری خودکار و استفاده از ابزارهای هوشمند', 'p06.webp'],
  ['تحلیل تکنیکال پیشرفته', 'یادگیری اندیکاتورها و الگوهای پیشرفته برای شناسایی فرصت‌های معاملاتی', 'p07.webp'],
  ['استراتژی نوسان‌گیری', 'تکنیک‌های حرفه‌ای نوسان‌گیری در بازارهای کوتاه‌مدت و میان‌مدت', 'p08.webp'],
  ['سرمایه‌گذاری بلندمدت', 'اصول و استراتژی‌های سرمایه‌گذاری بلندمدت برای رشد پایدار', 'p09.webp'],
  ['تحلیل حجم معاملات', 'آموزش تحلیل حجم و شناسایی حرکات اصلی بازار برای ورود و خروج به‌موقع', 'p10.webp'],
  ['استراتژی پرایس اکشن', 'تسلط بر تحلیل حرکت قیمت بدون نیاز به اندیکاتورهای پیچیده', 'p11.webp'],
  ['مدیریت پورتفولیو', 'آموزش تخصیص دارایی و متنوع‌سازی سبد برای کاهش ریسک و افزایش بازدهی', 'p12.webp'],
].map(([title, description, fileName], index) => ({
  title,
  description,
  imageUrl: `/images/home/landing-slider/${fileName}`,
  order: index + 1,
  published: true,
}));

export const homeMiniSliderRows = {
  1: homeAlbumSlides.slice(0, 6).map((slide) => slide.imageUrl),
  2: homeAlbumSlides.slice(6, 12).map((slide) => slide.imageUrl),
} as const;

/** Map legacy album jpgs to resized webp assets after the display-size conversion. */
export function normalizeHomeAlbumImageUrl(url: string): string {
  return url.replace(
    /(\/images\/home\/landing-slider\/p\d+)\.jpe?g$/i,
    "$1.webp"
  );
}
