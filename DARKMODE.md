# 🌙 Dark Mode Implementation - پیاده‌سازی دارک مود

## نمای کلی (Overview)

سیستم دارک مود پیشرو با استفاده از **Next.js 15**, **Tailwind CSS**, و **next-themes** پیاده‌سازی شده است. این سیستم به‌طور خودکار ترجیحات سیستم کاربر را تشخیص می‌دهد و کاربران می‌توانند تم را دستی تغییر دهند.

## ویژگی‌های (Features)

✅ تشخیص خودکار ترجیحات سیستم (Dark/Light)  
✅ انتخاب دستی تم از طریق دکمه ThemeToggle  
✅ ذخیره‌سازی انتخاب تم در localStorage  
✅ بدون Flash/Flicker هنگام بارگذاری صفحه  
✅ CSS Variables برای رنگ‌های custom  
✅ کار در تمام صفحات و کامپوننت‌ها  

## طیف رنگی Dark Mode (Color Palette)

رنگ‌های استفاده شده برای دارک مود بر اساس هویت برند پیشرو:

| عنصر | رنگ HEX | توضیح |
|------|---------|--------|
| **رنگ سازمانی** | `#F9AD03` | نارنجی برند |
| **پس‌زمینه بدنه** | `#151515` | سیاه عمیق |
| **پس‌زمینه فوتر** | `#191919` | سیاه مایل |
| **متن اصلی** | `#EAEAEA` | سفید روشن |
| **متن ثانویه** | `#A1A1A1` | خاکستری روشن |
| **دکمه خرید اشتراک** | `#1CB561` | سبز |
| **کارت‌ها** | `#282828` | خاکستری تیره |
| **حاشیه** | `#FFFFFF1F` | سفید نیمه‌شفاف |

## معماری (Architecture)

### 1. **CSS Variables** (`app/styles/globals.css`)

```css
.dark {
  --brand-color: #F9AD03;
  --body-background: #151515;
  --text-primary: #EAEAEA;
  --btn-primary-bg: #1CB561;
  /* ... */
}
```

### 2. **Tailwind Configuration** (`tailwind.config.ts`)

```typescript
export default {
  darkMode: ["class"], // استفاده از class-based dark mode
  theme: {
    extend: {
      colors: {
        brand: "var(--brand-color)",
        bodyBg: "var(--body-background)",
        // ... دیگر رنگ‌ها
      },
    },
  },
};
```

### 3. **Theme Provider** (`lib/providers/ThemeProvider.tsx`)

```typescript
<ThemeProvider 
  attribute="class" 
  defaultTheme="system" 
  enableSystem 
  disableTransitionOnChange={false}
>
```

### 4. **Theme Toggle Component** (`components/ui/ThemeToggle.tsx`)

دکمه‌ای برای تغییر تم که:
- درخواست hydration را منع می‌کند
- آیکون‌های مختلف برای light/dark را نشان می‌دهد
- localStorage را بروز می‌کند

## استفاده (Usage)

### استفاده در Tailwind Classes

```jsx
// Light mode - پیش‌فرض
<div className="bg-white text-black">Light</div>

// Dark mode - اضافی
<div className="dark:bg-bodyBg dark:text-textPrimary">Dark</div>

// برای رنگ‌های custom
<div className="bg-brand dark:bg-brand">Brand Color</div>
```

### استفاده CSS Variables

```css
.my-element {
  background-color: var(--body-background);
  color: var(--text-primary);
}
```

## نقاط دسترسی (Access Points)

### Navbar
- دکمه ThemeToggle در NavbarActions
- در Desktop و Mobile Navbar

### Anywhere
```jsx
import ThemeToggle from '@/components/ui/ThemeToggle';

<ThemeToggle />
```

## رنگ‌های مشخص‌شده در Tailwind

پس از پیاده‌سازی، می‌توانید از این رنگ‌ها مستقیماً استفاده کنید:

```jsx
<button className="bg-btnPrimaryBg hover:bg-btnPrimaryHover">خرید</button>
<div className="bg-cardBg border-borderColor">کارت</div>
<p className="text-textPrimary">متن</p>
<span className="text-textSecondary">متن ثانویه</span>
```

## اطلاعات فنی (Technical Details)

### Hydration Prevention
```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
```
این کد اطمینان می‌دهد که theme toggle فقط بعد از hydration رندر شود.

### LocalStorage Integration
next-themes خودکار‌اً:
- انتخاب تم را در localStorage ذخیره می‌کند
- تم ترجیح شده را هنگام بازدید بعدی بازیابی می‌کند
- پیش‌فرض سیستم را احترام می‌گذارد

### Transition Timing
```typescript
disableTransitionOnChange={false}
```
این به transition‌های CSS اجازه می‌دهد هنگام تغییر تم کار کنند.

## بهینه‌سازی (Optimization)

1. **بدون Flash**: theme provider در `html` tag قرار گرفته است
2. **SSR Compatible**: ThemeProvider یک Client Component است
3. **Performance**: CSS Variables برای رندرینگ سریع‌تر
4. **RTL Compatible**: تنظیمات RTL در globals.css

## تست (Testing)

1. بر روی دکمه ThemeToggle در navbar کلیک کنید
2. صفحه باید به‌آرام (transition) تغییر رنگ دهد
3. تم باید در تمام صفحات ثابت بماند
4. localStorage میں تم ترجیح باید ذخیره شود

## فایل‌های مرتبط (Related Files)

- [app/styles/globals.css](app/styles/globals.css) - CSS Variables
- [tailwind.config.ts](tailwind.config.ts) - Tailwind Theme Config
- [lib/providers/ThemeProvider.tsx](lib/providers/ThemeProvider.tsx) - Theme Provider
- [components/ui/ThemeToggle.tsx](components/ui/ThemeToggle.tsx) - Toggle Component
- [components/navbar/NavbarActions.tsx](components/navbar/NavbarActions.tsx) - Toggle in Navbar

## مشکل‌گیری (Troubleshooting)

### Theme لود نمی‌شود
- مطمئن شوید `suppressHydrationWarning` در `html` tag است
- localStorage را پاک کنید و صفحه را رفرش کنید

### Flash of Light/Dark
- ThemeProvider فقط Client Component است
- `disableTransitionOnChange` را بررسی کنید

### رنگ‌ها تغییر نمی‌کنند
- `dark:` prefix را بررسی کنید
- CSS specificity را بررسی کنید

## برای توسعه‌دهندگان

### نحوه اضافه کردن رنگ جدید

1. **globals.css میں اضافه کنید:**
```css
.dark {
  --new-color: #yourcolor;
}
```

2. **tailwind.config.ts میں اضافه کنید:**
```typescript
newColor: "var(--new-color)",
```

3. **استفاده کنید:**
```jsx
<div className="bg-newColor dark:bg-newColor">Content</div>
```

## منابع (Resources)

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

---

✅ **Dark Mode Implementation Complete!**
