import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: "AIzaSyC2z-jB_SdE15a6cN5NNMenZizZdb1cSjQ",
});

export async function main(query) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query.trim(),
  });
  return response;
}
