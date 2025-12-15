/**
 * Persian Data Generator
 * Generates random Persian data for seeding database
 */

export class PersianDataGenerator {
  private seed: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed;
  }

  /**
   * Simple seeded random number generator
   */
  private random(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Generate random integer between min (inclusive) and max (exclusive)
   */
  randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min) + min);
  }

  /**
   * Choose random element from array
   */
  choice<T>(arr: T[]): T {
    return arr[this.randomInt(0, arr.length)];
  }

  /**
   * Generate Persian full name
   */
  generateFullName(): { firstName: string; lastName: string } {
    const firstNames = [
      "محمد",
      "علی",
      "حسین",
      "رضا",
      "مهدی",
      "احمد",
      "حسن",
      "فاطمه",
      "زهرا",
      "مریم",
      "سارا",
      "نرگس",
      "الهام",
      "ندا",
      "امیر",
      "پویا",
      "سینا",
      "آرش",
      "کیان",
      "پرهام",
      "سامان",
      "آیدا",
      "نیلوفر",
      "شیدا",
      "پریسا",
      "نازنین",
      "سمیرا",
    ];

    const lastNames = [
      "احمدی",
      "محمدی",
      "حسینی",
      "رضایی",
      "موسوی",
      "کریمی",
      "جعفری",
      "علیزاده",
      "محمدزاده",
      "حسن‌زاده",
      "اکبری",
      "نوری",
      "صادقی",
      "فاضلی",
      "رحیمی",
      "کاظمی",
      "باقری",
      "اسماعیلی",
      "حیدری",
      "نصیری",
      "شریفی",
      "زارعی",
      "سلطانی",
      "قاسمی",
      "توکلی",
    ];

    return {
      firstName: this.choice(firstNames),
      lastName: this.choice(lastNames),
    };
  }

  /**
   * Generate comment/testimonial text
   */
  generateCommentText(): string {
    const comments = [
      "دوره فوق‌العاده‌ای بود! از محتوا و کیفیت آموزش بسیار راضی هستم.",
      "آموزش خیلی کاربردی و عملی بود. توصیه می‌کنم حتماً شرکت کنید.",
      "مدرس با تجربه و حرفه‌ای. مطالب به صورت ساده و قابل فهم ارائه شد.",
      "بهترین دوره‌ای بود که تا حالا دیدم. واقعاً ارزش پرداخت داشت.",
      "محتوای دوره خیلی جامع و کامل است. به همه علاقه‌مندان پیشنهاد می‌شود.",
      "از کیفیت ویدیوها و پشتیبانی راضی بودم. دوره عالی‌ای است.",
      "مباحث خیلی خوب پوشش داده شده. بعد از این دوره اعتماد به نفسم بالا رفت.",
      "دوره کاملی برای یادگیری تحلیل تکنیکال. استاد حرفه‌ای و با تجربه.",
      "قیمت مناسب و محتوای با کیفیت. خیلی ممنونم از تیم پیشرو.",
      "همه چیز عالی بود از آموزش گرفته تا پشتیبانی. پنج ستاره کامل!",
      "دوره‌ای که واقعاً می‌تواند زندگی شما را تغییر دهد.",
      "بعد از گذراندن این دوره، توانستم سود خوبی از بازار بگیرم.",
      "مطالب به روز و کاربردی. برای مبتدی‌ها هم مناسب است.",
      "استاد با صبر و حوصله توضیح می‌دهد. همه چیز قابل فهم است.",
      "از محتوای رایگان هم راضی بودم، ولی دوره پولی خیلی بهتر بود.",
      "تجربه یادگیری فوق‌العاده‌ای داشتم. تشکر از تیم پیشرو.",
      "دوره‌ای که برای همیشه در حافظه‌ام می‌ماند. خیلی عالی بود!",
      "قبل از این دوره هیچی نمی‌دونستم، الان خیلی پیشرفت کردم.",
      "سرمایه‌ گذاری روی این دوره یکی از بهترین تصمیمات من بود.",
      "محتوا خیلی منظم و ساختار یافته ارائه شده. لذت بردم.",
    ];

    return this.choice(comments);
  }

  /**
   * Generate avatar URL
   */
  generateAvatarUrl(index: number): string {
    const avatars = [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=",
      "https://api.dicebear.com/7.x/bottts/svg?seed=",
      "https://api.dicebear.com/7.x/personas/svg?seed=",
    ];

    const style = this.choice(avatars);
    return `${style}${index}`;
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  shuffle<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.randomInt(0, i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
