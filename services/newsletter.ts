import { NewsletterInput } from "@/lib/validations/newsletter";

// later you will replace with real API call
export async function subscribeToNewsletter(data: NewsletterInput) {
  // Example: POST request
  // return axios.post("/api/newsletter", data);

  console.log("Newsletter subscription data:", data);
  return { success: true };
}
