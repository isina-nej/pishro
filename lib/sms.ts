// @/lib/sms.ts
import { URLSearchParams } from "url";
const MELI_USERNAME = process.env.MELIPAYAMAK_USERNAME!;
const MELIPAYAMAK_API_KEY = process.env.MELIPAYAMAK_API_KEY!;
const MELI_SENDER = process.env.MELIPAYAMAK_SENDER!; // e.g. "5000XXXXXXX"

/**
 * Send SMS via Melipayamak REST API
 * Docs: https://www.melipayamak.com/docs/
 */
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

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const responseText = await res.text();

  if (!res.ok || responseText.includes("Error")) {
    console.error("Melipayamak API error:", responseText);
    throw new Error("Failed to send SMS via Melipayamak");
  }

  return responseText;
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

      if (!res.ok || responseText.includes("Error")) {
        console.error(`Melipayamak batch API error for batch ${i}:`, responseText);
        // Mark all phones in this batch as failed
        results.failed += batch.length;
        results.failedPhones.push(...batch);
        batch.forEach(phone => {
          results.errors.push({ phone, error: responseText });
        });
      } else {
        // All phones in this batch succeeded
        results.success += batch.length;
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
