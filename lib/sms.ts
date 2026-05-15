// @/lib/sms.ts
import { URLSearchParams } from "url";

// Melipayamak credentials
const MELI_USERNAME = process.env.MELIPAYAMAK_USERNAME;
const MELIPAYAMAK_API_KEY = process.env.MELIPAYAMAK_API_KEY;
const MELI_SENDER = process.env.MELIPAYAMAK_SENDER;

// ModirPayamak credentials
const MODIR_USERNAME = process.env.SMS_USERNAME;
const MODIR_PASSWORD = process.env.SMS_PASSWORD;
const MODIR_SENDER = process.env.SMS_FROM;
const MODIR_API_URL = process.env.SMS_API_URL || "https://sms.modirpayamak.com";

// Determine which SMS service to use
const SMS_SERVICE = process.env.SMS_SERVICE || "modirpayamak";

/**
 * Send SMS via Mock Service (for development/testing)
 */
export async function sendSmsMock(phone: string, text: string) {
  console.log("📱 MOCK SMS SERVICE");
  console.log("├─ To:", phone);
  console.log("├─ Message:", text);
  console.log("└─ Status: ✅ Sent successfully (mock)");
  return `Mock SMS sent to ${phone}`;
}
export async function sendSmsMelipayamak(phone: string, text: string) {
  if (!MELI_USERNAME || !MELIPAYAMAK_API_KEY || !MELI_SENDER) {
    throw new Error(
      "Melipayamak credentials are missing in environment variables."
    );
  }

  const url = "https://api.payamak-panel.com/post/Send.asmx/SendSimpleSMS2";

  // Prepare parameters in form-urlencoded format
  const params = new URLSearchParams({
    username: MELI_USERNAME,
    password: MELIPAYAMAK_API_KEY,
    to: phone,
    from: MELI_SENDER,
    text,
    isflash: "false",
  });

  // Set a 15-second timeout for SMS requests (services can be slow)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    console.log("Sending SMS via Melipayamak to", phone);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await res.text();
    console.log("Melipayamak response status:", res.status, "text:", responseText.substring(0, 200));

    // Parse XML response - extract numeric value
    // Melipayamak returns: <string xmlns="...">VALUE</string>
    // Positive numbers = success (message ID), 0 or negative = failure
    const match = responseText.match(/<string[^>]*>([^<]+)<\/string>/);
    const responseValue = match ? match[1].trim() : null;
    
    if (!res.ok) {
      console.error("Melipayamak HTTP error:", res.status, responseText);
      throw new Error(`Melipayamak HTTP error: ${res.status}`);
    }

    if (!responseValue) {
      console.error("Melipayamak invalid response format:", responseText);
      throw new Error("Invalid response format from Melipayamak API");
    }

    // Check if response is an error message or indicates failure
    if (responseText.includes("Error") || responseText.toLowerCase().includes("fault")) {
      console.error("Melipayamak API error:", responseText);
      throw new Error("Failed to send SMS via Melipayamak");
    }

    // Try to parse as number - positive numbers = success
    const msgId = parseInt(responseValue, 10);
    if (isNaN(msgId) || msgId <= 0) {
      console.error(`Melipayamak returned failure code: ${responseValue}. Full response: ${responseText}`);
      throw new Error(`SMS sending failed with response code: ${responseValue}`);
    }

    console.log("✅ SMS sent successfully to", phone, "- Message ID:", msgId);
    return responseText;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Melipayamak send error:", error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Send SMS to multiple recipients via Melipayamak
 * This function sends SMS in batches to avoid overwhelming the API
 * Based on: https://www.melipayamak.com/api/sendsimplesms/
 */
export async function sendBulkSmsMelipayamak(
  phones: string[],
  text: string,
  batchSize: number = 50
) {
  if (!MELI_USERNAME || !MELIPAYAMAK_API_KEY || !MELI_SENDER) {
    throw new Error(
      "Melipayamak credentials are missing in environment variables."
    );
  }

  const results = {
    total: phones.length,
    success: 0,
    failed: 0,
    failedPhones: [] as string[],
    errors: [] as { phone: string; error: string }[],
  };

  // Helper function to add delay between batches
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Process phones in batches
  for (let i = 0; i < phones.length; i += batchSize) {
    const batch = phones.slice(i, i + batchSize);

    // Join phone numbers with semicolon for batch sending
    const phonesString = batch.join(";");

    try {
      const url = "https://api.payamak-panel.com/post/Send.asmx/SendSimpleSMS2";

      const params = new URLSearchParams({
        username: MELI_USERNAME,
        password: MELIPAYAMAK_API_KEY,
        to: phonesString,
        from: MELI_SENDER,
        text,
        isflash: "false",
      });

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const responseText = await res.text();

      // Parse XML response
      const match = responseText.match(/<string[^>]*>([^<]+)<\/string>/);
      const responseValue = match ? match[1].trim() : null;

      // Check for success - positive numbers indicate success
      if (!res.ok || responseText.includes("Error") || responseText.toLowerCase().includes("fault")) {
        console.error(`Melipayamak batch API error for batch ${i}:`, responseText);
        results.failed += batch.length;
        results.failedPhones.push(...batch);
        batch.forEach(phone => {
          results.errors.push({ phone, error: responseText });
        });
      } else if (!responseValue || isNaN(parseInt(responseValue, 10)) || parseInt(responseValue, 10) <= 0) {
        console.error(`Melipayamak returned failure code ${responseValue} for batch ${i}:`, responseText);
        results.failed += batch.length;
        results.failedPhones.push(...batch);
        batch.forEach(phone => {
          results.errors.push({ phone, error: `Response code: ${responseValue}` });
        });
      } else {
        // All phones in this batch succeeded
        results.success += batch.length;
        console.log(`Batch ${i} sent successfully - Message ID: ${responseValue}`);
      }

      // Add delay between batches to avoid rate limiting (500ms)
      if (i + batchSize < phones.length) {
        await delay(500);
      }
    } catch (error) {
      console.error(`Error sending SMS to batch starting at ${i}:`, error);
      // Mark all phones in this batch as failed
      results.failed += batch.length;
      results.failedPhones.push(...batch);
      batch.forEach(phone => {
        results.errors.push({
          phone,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      });
    }
  }

  return results;
}

/**
 * Send SMS via ModirPayamak API
 * Docs: https://sms.modirpayamak.com
 */
export async function sendSmsModirpayamak(phone: string, text: string) {
  if (!MODIR_USERNAME || !MODIR_PASSWORD) {
    console.warn("ModirPayamak credentials not configured, SMS will not be sent");
    return "ModirPayamak not configured";
  }

  const url = `${MODIR_API_URL}/api/SendSms`;

  const params = new URLSearchParams({
    username: MODIR_USERNAME,
    password: MODIR_PASSWORD,
    to: phone,
    text,
    from: MODIR_SENDER || "pishro",
  });

  // Set a 15-second timeout for SMS requests (services can be slow)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await res.text();
    console.log("ModirPayamak response status:", res.status, "text:", responseText.substring(0, 200));

    if (!res.ok || responseText.includes("false") || responseText.includes("error")) {
      console.error("ModirPayamak API error:", responseText);
      throw new Error("Failed to send SMS via ModirPayamak");
    }

    return responseText;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("ModirPayamak send error:", error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Generic SMS send function that routes to the appropriate service
 * Uses SMS_SERVICE environment variable to determine which service to use
 * Falls back to other services or mock in development if primary fails
 */
export async function sendSms(phone: string, text: string) {
  // Use mock SMS service if configured
  if (SMS_SERVICE === "mock") {
    return sendSmsMock(phone, text);
  }

  console.log(`🔔 SMS Request - Service: ${SMS_SERVICE}, Phone: ${phone}`);
  
  if (SMS_SERVICE === "modirpayamak") {
    try {
      return await sendSmsModirpayamak(phone, text);
    } catch (error) {
      console.warn("ModirPayamak failed, falling back to Melipayamak:", error);
      try {
        return await sendSmsMelipayamak(phone, text);
      } catch (fallbackError) {
        console.error("Both SMS services failed, falling back to mock:", fallbackError);
        return sendSmsMock(phone, text);
      }
    }
  } else if (SMS_SERVICE === "melipayamak") {
    try {
      return await sendSmsMelipayamak(phone, text);
    } catch (error) {
      console.warn("Melipayamak failed, falling back to ModirPayamak:", error);
      try {
        return await sendSmsModirpayamak(phone, text);
      } catch (fallbackError) {
        console.error("Both SMS services failed, falling back to mock:", fallbackError);
        return sendSmsMock(phone, text);
      }
    }
  } else {
    throw new Error(`Unknown SMS service: ${SMS_SERVICE}`);
  }
}

/**
 * Send OTP via IPPanel Pattern API
 * This API is optimized for OTP delivery - fast, instant, no approval needed
 * Pattern templates must be pre-created in IPPanel dashboard
 * 
 * Docs: https://edge.ippanel.com/v1/api/send
 */
export async function sendOtpViaPattern(phone: string, code: string) {
  const IPPANEL_API_KEY = process.env.IPPANEL_API_KEY;
  const IPPANEL_FROM_NUMBER = process.env.IPPANEL_FROM_NUMBER || "+983000505";
  const IPPANEL_PATTERN_CODE = process.env.IPPANEL_PATTERN_CODE;

  if (!IPPANEL_API_KEY) {
    console.error("IPPANEL_API_KEY is not configured");
    throw new Error("IPPanel API key not configured");
  }

  if (!IPPANEL_PATTERN_CODE) {
    console.error("IPPANEL_PATTERN_CODE is not configured");
    throw new Error("IPPanel pattern code not configured");
  }

  // Convert phone from 09X to +98X format (E.164)
  const phoneE164 = phone.startsWith("09") 
    ? `+98${phone.slice(1)}` 
    : phone.startsWith("+98")
    ? phone
    : `+98${phone}`;

  const payload = {
    sending_type: "pattern",
    from_number: IPPANEL_FROM_NUMBER,
    code: IPPANEL_PATTERN_CODE,
    recipients: [phoneE164],
    params: {
      code: code, // This will be injected into the pattern template
    },
  };

  console.log(`[OTP Pattern] 📱 Sending OTP to ${phoneE164}`);
  console.log(`[OTP Pattern] Pattern: ${IPPANEL_PATTERN_CODE}`);
  console.log(`[OTP Pattern] From: ${IPPANEL_FROM_NUMBER}`);
  console.log(`[OTP Pattern] Code: ${code}`);

  try {
    const response = await fetch("https://edge.ippanel.com/v1/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": IPPANEL_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.meta?.status) {
      console.error("[OTP Pattern] ❌ Failed to send OTP:", {
        status: response.status,
        statusText: response.statusText,
        message: data.meta?.message,
        code: data.meta?.message_code,
        errors: data.meta?.errors,
      });
      throw new Error(`IPPanel API error: ${data.meta?.message || "Unknown error"}`);
    }

    console.log(`[OTP Pattern] ✅ OTP sent successfully!`);
    console.log(`[OTP Pattern] Message ID: ${data.data?.message_outbox_ids?.[0]}`);

    return data;
  } catch (error) {
    console.error("[OTP Pattern] ❌ Error sending OTP:", error instanceof Error ? error.message : error);
    throw error;
  }
}
