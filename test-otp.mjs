import crypto from 'crypto';

const IPPANEL_API_KEY = "YTFjNjhiMTUtYmRmOC00OWY1LWI2MjYtZTgzNDhkMzkwODEyY2VhZDBlOGViNTg5ZTVhMTlmYjBmMzRjMDNkODljNjQ=";
const IPPANEL_FROM_NUMBER = "+98PRO";
const IPPANEL_PATTERN_CODE = "ppaissmzfp67m2i";
const phone = "09167991896";
const code = "6850";

// Convert phone from 09X to +98X format
const phoneE164 = phone.startsWith("09") 
  ? `+98${phone.slice(1)}` 
  : phone;

const payload = {
  sending_type: "pattern",
  from_number: IPPANEL_FROM_NUMBER,
  code: IPPANEL_PATTERN_CODE,
  recipients: [phoneE164],
  params: {
    code: code,
  },
};

console.log("📨 OTP Pattern Request:");
console.log(JSON.stringify(payload, null, 2));

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
  
  console.log("\n✅ Response Status:", response.status);
  console.log(JSON.stringify(data, null, 2));
  
  if (data.meta?.status) {
    console.log("\n✅ OTP sent successfully!");
    console.log("Message IDs:", data.data?.message_outbox_ids);
  } else {
    console.log("\n❌ Failed to send OTP");
    console.log("Error:", data.meta?.message);
  }
} catch (error) {
  console.error("❌ Error:", error.message);
}
