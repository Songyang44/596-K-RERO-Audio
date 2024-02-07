// src/services/translationService.js
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import v4 and rename it to uuidv4

export const translateText = async (
  text,
  fromLanguage,
  toLanguage,
  subscriptionKey,
  subscriptionRegion
) => {
  const translatorEndpoint = "https://api.cognitive.microsofttranslator.com";

  let params = new URLSearchParams({
    "api-version": "3.0",
    from: fromLanguage,
    to: toLanguage,
  });

  const headers = {
    "Ocp-Apim-Subscription-Key": subscriptionKey,
    "Ocp-Apim-Subscription-Region": subscriptionRegion,
    "Content-type": "application/json",
    "X-ClientTraceId": uuidv4().toString(), // Use uuidv4 here
  };

  try {
    const response = await axios.post(
      `${translatorEndpoint}/translate`,
      [{ text }],
      { params, headers }
    );
    return response.data[0].translations[0].text;
  } catch (error) {
    console.error("Error translating text:", error);
  }
};
