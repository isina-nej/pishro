// lib/sms.ts
import fetch from "node-fetch";

const MELI_API_TOKEN = process.env.MELIPAYAMAK_API_KEY;

// send sms via Melipayamak REST console
export async function sendSmsMelipayamak(phone: string, text: string) {
  // NOTE: adjust endpoint/headers according to your panel (token or username/password).
  // This example uses the console REST endpoint pattern (token-based).
  const url = "https://api.melipayamak.ir/v1/messages"; // check your panel docs
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MELI_API_TOKEN}`,
    },
    body: JSON.stringify({
      mobile: phone,
      message: text,
      // other fields per API: from, urllink, isFlash, ...
    }),
  });

  const body = await res.json();
  return body;
}
