# گزارش تست سایت pishrosarmaye.com — 2026-09-09

Build سرور سبز. بیلد 109s. 187 صفحه. اپ online. هوم 200.

## اینفرا سالم
- DNS ok: 178.239.147.136
- TCP 443 ok ~33ms. HTTP 200.
- SSL ok: Let's Encrypt تا 2026-11-23.
- http→https 301 ok.

## عمدی، باگ نیست
- 404های /investment-plans /business-consulting /about-us /faq /library عمدی است. hiddenPages فعال: همونا + home:mobile-view. قانون سیستم: مخفی = حذف از منو/فوتر + 404.
- منو/فوتر فیلتر ok. هوم فقط 5 آیتم نشون میده.
- صفرهای SSR (موجودی ۰، درصد ۰٫۰٪) عمدی است. انیمیشن کلاینت پر میکنه.
- تکرار 3x نظرات عمدی است. marquee loop.
- لودینگ ماشین‌حساب SSR عمدی است. API فاندز ok، کلاینت پر میکنه.

## مشکل‌ها (ذخیره شد)
1. HIGH: لینک حقوقی مرده. legalLinks → /about-us و /faq که مخفی و 404ان. قوانین/حریم/سوالات فوتر به بن‌بست میخورن. فیکس: لینک حقوقی به صفحه موجود یا از لیست مخفی خارج کن.
2. MED: www و apex هر دو 200 جدا. canonical یکی نیست. duplicate content. فیکس: یکی رو 301 به اون یکی کن + canonical tag.
3. MED: هدر امنیتی صفر. بدون HSTS/X-Frame/CSP/Referrer. فیکس: nginx header اضافه کن.
4. MED: robots.txt 404 + sitemap.xml 404. فایل app/robots.ts و app/sitemap.* وجود نداره. فیکس: بساز.
5. LOW: favicon.ico 404. آیکون واقعی /logo/* ok. فیکس: redirect یا فایل.
6. LOW: OG image هاست www ولی سایت apex. فیکس: یکدست کن.
7. CHECK: هر 6 دوره هوم «1 دوره‌آموز / 1 ویدیو / ۰ دقیقه». دیتای واقعی یا سید؟ چک کن.
8. CHECK: موبایل فوتر 01154229530 فرمت ثابت است نه 09xx. تایپی یا عمدی؟ چک کن.
9. CHECK: faqs خالی (0 آیتم)، library خالی (0 آیتم). با مخفی بودن صفحه سازگاره ولی محتوا نداره. چک کن.
10. PERF: رندر 404 درباره 5.6s کند vs بقیه ~1s. چک کن.

## API همه 200
- site-chrome، public/cms، courses، investment-funds (2 فاند)، news (142KB)، crypto-market (161KB)، site-theme ok.
- faqs/library خالی ولی 200.

## زمان پاسخ
- home ~1.2s. courses 1.4s. news/crypto/contact/login ~1s. checkout ~2s.

## اقدام بعدی
- اول لینک حقوقی (1). بعد canonical + robots/sitemap (2،4). بعد هدر امنیتی (3).
