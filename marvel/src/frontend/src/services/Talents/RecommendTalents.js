import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyC2z-jB_SdE15a6cN5NNMenZizZdb1cSjQ",
});

export default async function main(jobPosting, talentProfile) {
  // 1. Build the query string
  let query = `I have a job posting and a list of talent profiles. 
My goal is to recommend the best talent for the job based on their skills and experience.

Job Posting:
${jobPosting.title}: ${jobPosting.description}

Talent Profiles:
- Name: ${talentProfile.name}
  Skills: ${talentProfile.skills.join(", ")}
  Experience: ${talentProfile.experience} years
  Bio: ${talentProfile.bio}
  Location: ${talentProfile.location}
  Phone: ${talentProfile.phone}
  Position: ${talentProfile.position}
  Salary: ${talentProfile.salary}

Please analyze these profiles and recommend the top 3 best-fitting talents for the job.

⚠️ Important:
- Always return the full talent object by **copying the existing profile fields exactly as they are given** ("name", "skills", "experience", "location", "phone", "position", "salary").
- add a new field called \`score\` (number from 0–100) that represents the match score.
- add a new field called \`reason\`  that represents briefly the your reason to choose this candidate.
- Do not invent or change values of existing fields.
- Return the result in pure JSON only, no text, no code fences.

The JSON must strictly follow this format:
[
  {
    "name": "string",
    "skills": ["string"],
    "experience": "string",
    "location": "string",
    "phone": "string",
    "position": "string",
    "salary": number,
    "score": number,
    "reason": "string",
  }
]`;

  // Define schema matching prompt
  const talentSchema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        name: { type: "string" },
        skills: { type: "array", items: { type: "string" } },
        experience: { type: "string" },
        location: { type: "string" },
        phone: { type: "string" },
        position: { type: "string" },
        salary: { type: "string" },
        score: { type: "number" },
        reason: { type: "string" },
      },
      required: [
        "name",
        "skills",
        "experience",
        "location",
        "phone",
        "position",
        "salary",
        "score",
        "reason",
      ],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query.trim(),
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: talentSchema,
      },
    });

    let text = response.candidates[0].content.parts[0].text;
    text = text
      .replace(/```json\n?/, "")
      .replace(/```$/, "")
      .trim();
    const talents = JSON.parse(text);

    console.log(talents);
    return talents;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
}
