# 📚 Settings API Documentation

این مستند راهنمای کامل استفاده از API مدیریت تنظیمات سایت است که برای پنل مدیریت (CMS) طراحی شده است.

## 📋 فهرست مطالب

1. [معرفی](#معرفی)
2. [احراز هویت](#احراز-هویت)
3. [Endpoints](#endpoints)
   - [دریافت تنظیمات](#1-دریافت-تنظیمات)
   - [به‌روزرسانی تنظیمات](#2-به‌روزرسانی-تنظیمات)
4. [مدل داده](#مدل-داده)
5. [کدهای خطا](#کدهای-خطا)
6. [نمونه‌های کاربردی](#نمونه‌های-کاربردی)

---

## معرفی

API تنظیمات به ادمین‌های سایت امکان می‌دهد تا تنظیمات کلیدی سایت از جمله **شناسه پذیرنده زرین‌پال** را از طریق پنل مدیریت تنظیم کنند.

### ویژگی‌های کلیدی:

- ✅ مدیریت شناسه پذیرنده زرین‌پال (Zarinpal Merchant ID)
- ✅ امکان افزودن تنظیمات جدید در آینده
- ✅ احراز هویت امن با Auth.js
- ✅ دسترسی محدود به ادمین‌ها
- ✅ Fallback به متغیرهای محیطی (Environment Variables)

**Base URL:** `https://pishrosarmaye.com/api/admin/settings`

---

## احراز هویت

### نوع احراز هویت

این API از **Session-Based Authentication** استفاده می‌کند که توسط **Auth.js v5** پیاده‌سازی شده است.

### الزامات

- کاربر باید **وارد سیستم** شده باشد (Session موجود باشد)
- نقش کاربر باید **ADMIN** باشد

### Headers مورد نیاز

برای ارسال درخواست‌ها، باید cookie های session را ارسال کنید:

```http
Cookie: authjs.session-token=YOUR_SESSION_TOKEN
```

### خطاهای احراز هویت

#### 401 Unauthorized - کاربر وارد نشده است

```json
{
  "success": false,
  "error": "لطفا وارد شوید",
  "code": "UNAUTHORIZED"
}
```

#### 403 Forbidden - کاربر ادمین نیست

```json
{
  "success": false,
  "error": "دسترسی محدود به ادمین",
  "code": "FORBIDDEN"
}
```

---

## Endpoints

### 1. دریافت تنظیمات

دریافت تمام تنظیمات سایت.

#### Request

```http
GET /api/admin/settings
```

#### Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "تنظیمات با موفقیت دریافت شد",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "zarinpalMerchantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "siteName": "نام سایت",
    "siteDescription": "توضیحات سایت",
    "supportEmail": "support@example.com",
    "supportPhone": "02112345678",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### مثال با cURL

```bash
curl -X GET https://pishrosarmaye.com/api/admin/settings \
  -H "Cookie: authjs.session-token=YOUR_SESSION_TOKEN"
```

#### مثال با JavaScript (fetch)

```javascript
const response = await fetch("https://pishrosarmaye.com/api/admin/settings", {
  method: "GET",
  credentials: "include", // Important: Include cookies
  headers: {
    "Content-Type": "application/json",
  },
});

const result = await response.json();
console.log(result.data);
```

---

### 2. به‌روزرسانی تنظیمات

به‌روزرسانی یک یا چند فیلد از تنظیمات سایت.

#### Request

```http
PATCH /api/admin/settings
Content-Type: application/json
```

#### Request Body

تمام فیلدها **اختیاری** هستند. فقط فیلدهایی که می‌خواهید تغییر دهید را ارسال کنید.

```json
{
  "zarinpalMerchantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "siteName": "نام جدید سایت",
  "siteDescription": "توضیحات جدید",
  "supportEmail": "newsupport@example.com",
  "supportPhone": "02187654321"
}
```

#### فیلدها

| فیلد                 | نوع      | الزامی | توضیحات                | اعتبارسنجی                  |
| -------------------- | -------- | ------ | ---------------------- | --------------------------- |
| `zarinpalMerchantId` | `string` | ❌     | شناسه پذیرنده زرین‌پال | باید 36 کاراکتر (UUID) باشد |
| `siteName`           | `string` | ❌     | نام سایت               | -                           |
| `siteDescription`    | `string` | ❌     | توضیحات سایت           | -                           |
| `supportEmail`       | `string` | ❌     | ایمیل پشتیبانی         | -                           |
| `supportPhone`       | `string` | ❌     | شماره تلفن پشتیبانی    | -                           |

#### Response (موفق)

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "تنظیمات با موفقیت به‌روزرسانی شد",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "zarinpalMerchantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "siteName": "نام جدید سایت",
    "siteDescription": "توضیحات جدید",
    "supportEmail": "newsupport@example.com",
    "supportPhone": "02187654321",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### Response (خطای اعتبارسنجی)

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "message": "فرمت شناسه پذیرنده صحیح نیست",
  "errors": {
    "zarinpalMerchantId": "شناسه پذیرنده باید 36 کاراکتر باشد (فرمت UUID)"
  },
  "code": "VALIDATION_ERROR"
}
```

#### مثال با cURL

```bash
curl -X PATCH https://pishrosarmaye.com/api/admin/settings \
  -H "Content-Type: application/json" \
  -H "Cookie: authjs.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "zarinpalMerchantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }'
```

#### مثال با JavaScript (fetch)

```javascript
const response = await fetch("https://pishrosarmaye.com/api/admin/settings", {
  method: "PATCH",
  credentials: "include", // Important: Include cookies
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    zarinpalMerchantId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    siteName: "نام جدید سایت",
  }),
});

const result = await response.json();

if (result.success) {
  console.log("تنظیمات با موفقیت به‌روزرسانی شد:", result.data);
} else {
  console.error("خطا:", result.message, result.errors);
}
```

#### مثال با Axios

```javascript
import axios from "axios";

try {
  const response = await axios.patch(
    "https://pishrosarmaye.com/api/admin/settings",
    {
      zarinpalMerchantId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    },
    {
      withCredentials: true, // Important: Include cookies
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("Success:", response.data);
} catch (error) {
  if (error.response) {
    console.error("Error:", error.response.data);
  }
}
```

---

## مدل داده

### SiteSettings Model

```typescript
interface SiteSettings {
  id: string; // شناسه یکتا (MongoDB ObjectId)
  zarinpalMerchantId?: string; // شناسه پذیرنده زرین‌پال (36 کاراکتر UUID)
  siteName?: string; // نام سایت
  siteDescription?: string; // توضیحات سایت
  supportEmail?: string; // ایمیل پشتیبانی
  supportPhone?: string; // شماره تلفن پشتیبانی
  createdAt: string; // تاریخ ایجاد (ISO 8601)
  updatedAt: string; // تاریخ آخرین به‌روزرسانی (ISO 8601)
}
```

### نکات مهم

1. **تنها یک رکورد Settings در دیتابیس وجود دارد**

   - اگر رکوردی وجود نداشته باشد، به صورت خودکار ایجاد می‌شود

2. **Fallback به Environment Variables**

   - اگر `zarinpalMerchantId` در دیتابیس خالی باشد، سیستم به متغیر `ZARINPAL_MERCHANT_ID` در env رجوع می‌کند

3. **فرمت UUID برای Merchant ID**
   - شناسه پذیرنده زرین‌پال باید یک UUID معتبر با 36 کاراکتر باشد
   - مثال: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

---

## کدهای خطا

| کد                 | توضیح                        |
| ------------------ | ---------------------------- |
| `UNAUTHORIZED`     | کاربر وارد سیستم نشده است    |
| `FORBIDDEN`        | کاربر دسترسی ادمین ندارد     |
| `VALIDATION_ERROR` | داده‌های ورودی نامعتبر هستند |
| `DATABASE_ERROR`   | خطا در ارتباط با دیتابیس     |

---

## نمونه‌های کاربردی

### سناریو 1: اولین بار تنظیم کردن Merchant ID

```javascript
// Step 1: دریافت تنظیمات فعلی
const settingsResponse = await fetch("/api/admin/settings", {
  credentials: "include",
});
const { data: settings } = await settingsResponse.json();

console.log("Merchant ID فعلی:", settings.zarinpalMerchantId);
// Output: null یا undefined

// Step 2: تنظیم Merchant ID جدید
const updateResponse = await fetch("/api/admin/settings", {
  method: "PATCH",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    zarinpalMerchantId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  }),
});

const result = await updateResponse.json();

if (result.success) {
  console.log("✅ Merchant ID با موفقیت تنظیم شد");
} else {
  console.error("❌ خطا:", result.message);
}
```

### سناریو 2: به‌روزرسانی چند فیلد به صورت همزمان

```javascript
const updateResponse = await fetch("/api/admin/settings", {
  method: "PATCH",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    zarinpalMerchantId: "new-merchant-id-here-xxxx-xxxx",
    siteName: "آکادمی پیشرو",
    supportEmail: "support@pishro.com",
    supportPhone: "02188776655",
  }),
});

const result = await updateResponse.json();
console.log(result);
```

### سناریو 3: خالی کردن یک فیلد

برای خالی کردن یک فیلد، مقدار `null` یا `""` (رشته خالی) ارسال کنید:

```javascript
const updateResponse = await fetch("/api/admin/settings", {
  method: "PATCH",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    supportPhone: null, // یا ""
  }),
});
```

### سناریو 4: مدیریت خطاها

```javascript
async function updateSettings(newSettings) {
  try {
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSettings),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle HTTP errors
      if (response.status === 401) {
        console.error("لطفا ابتدا وارد شوید");
        // Redirect to login
      } else if (response.status === 403) {
        console.error("شما دسترسی ادمین ندارید");
      } else if (response.status === 400) {
        console.error("خطای اعتبارسنجی:", result.errors);
        // Show validation errors to user
      } else {
        console.error("خطای سرور:", result.message);
      }
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("خطای شبکه:", error);
    return null;
  }
}

// استفاده:
const updated = await updateSettings({
  zarinpalMerchantId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
});

if (updated) {
  console.log("✅ تنظیمات به‌روزرسانی شد:", updated);
}
```

---

## 🔧 راهنمای پیاده‌سازی در CMS

### مثال: فرم تنظیمات در React

```jsx
import { useState, useEffect } from "react";

function SettingsForm() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load current settings
  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const response = await fetch("/api/admin/settings", {
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setSettings(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("خطا در بارگذاری تنظیمات");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const data = {
      zarinpalMerchantId: formData.get("merchantId"),
      siteName: formData.get("siteName"),
      supportEmail: formData.get("supportEmail"),
      supportPhone: formData.get("supportPhone"),
    };

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSettings(result.data);
        alert("✅ تنظیمات با موفقیت به‌روزرسانی شد");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("خطا در ذخیره تنظیمات");
    } finally {
      setLoading(false);
    }
  }

  if (!settings) return <div>در حال بارگذاری...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>تنظیمات سایت</h2>

      {error && <div className="error">{error}</div>}

      <div>
        <label>شناسه پذیرنده زرین‌پال:</label>
        <input
          type="text"
          name="merchantId"
          defaultValue={settings.zarinpalMerchantId || ""}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          maxLength={36}
        />
        <small>36 کاراکتر - فرمت UUID</small>
      </div>

      <div>
        <label>نام سایت:</label>
        <input
          type="text"
          name="siteName"
          defaultValue={settings.siteName || ""}
        />
      </div>

      <div>
        <label>ایمیل پشتیبانی:</label>
        <input
          type="email"
          name="supportEmail"
          defaultValue={settings.supportEmail || ""}
        />
      </div>

      <div>
        <label>تلفن پشتیبانی:</label>
        <input
          type="text"
          name="supportPhone"
          defaultValue={settings.supportPhone || ""}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </button>
    </form>
  );
}

export default SettingsForm;
```

---

## 📝 نکات مهم برای توسعه‌دهندگان CMS

1. **همیشه credentials: 'include' را در fetch ارسال کنید**

   - برای ارسال cookie های session ضروری است

2. **مدیریت صحیح خطاها**

   - خطاهای 401/403 را handle کنید و کاربر را به صفحه login هدایت کنید
   - خطاهای validation را به کاربر نمایش دهید

3. **اعتبارسنجی سمت کلاینت**

   - قبل از ارسال، Merchant ID را بررسی کنید (باید 36 کاراکتر باشد)

4. **UX خوب**

   - هنگام ذخیره، loading state نمایش دهید
   - پس از ذخیره موفق، پیام موفقیت نمایش دهید

5. **امنیت**
   - هرگز Merchant ID را در لاگ‌ها یا console.log ذخیره نکنید
   - این اطلاعات حساس هستند

---

## 🚀 تست API با Postman

### Setup

1. ابتدا وارد سیستم شوید تا session ایجاد شود
2. Cookie را از browser کپی کنید:
   - Chrome DevTools → Application → Cookies → `authjs.session-token`

### تنظیمات Postman

**Headers:**

```
Content-Type: application/json
Cookie: authjs.session-token=YOUR_TOKEN_HERE
```

**GET Request:**

```
GET https://pishrosarmaye.com/api/admin/settings
```

**PATCH Request:**

```
PATCH https://pishrosarmaye.com/api/admin/settings

Body (raw JSON):
{
  "zarinpalMerchantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## 📞 پشتیبانی

در صورت بروز مشکل یا سوال، با تیم توسعه تماس بگیرید.

**تاریخ آخرین به‌روزرسانی:** 2024-11-20
**نسخه API:** 1.0.0
