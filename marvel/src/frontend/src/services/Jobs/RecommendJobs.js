import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyC2z-jB_SdE15a6cN5NNMenZizZdb1cSjQ",
});

export default async function main(job, talentProfile) {
  // 1. Build the query string
  let query = `I have a talent profile and a list of job postings. 
My goal is to recommend the best jobs for this talent based on required skills, experience level, and location.

Talent Profile:
- Name: ${talentProfile.name}
- Skills: ${talentProfile.skills.join(", ")}
- Experience: ${talentProfile.experience} years
- Location: ${talentProfile.location}

Job Postings:
${ `
- Company: ${job.company}
  Title: ${job.title}
  Description: ${job.description}
  Experience Level: ${job.experience_level}
  Job Type: ${job.job_type}
  Location: ${job.location}
  Min Salary: ${job.min_salary}
  Max Salary: ${job.max_salary}
  Skills Required: ${job.skills_required.join(", ")}
  Requirements: ${job.requirements.join(", ")}
  Date: ${job.date}
`}

⚠️ Important:
- Always return the full job object by **copying the fields exactly as they are given** ("company", "description", "experience_level", "job_type", "location", "max_salary", "min_salary", "requirements", "skills_required", "title", "date").
- Only add a new field called \`score\` (number from 0–100) that represents how well the job matches the talent.
- Do not invent or change values of existing fields.
- Return the result in pure JSON only, no text, no code fences.

The JSON must strictly follow this format:
[
  {
    "company": "string",
    "description": "string",
    "experience_level": "string",
    "job_type": "string",
    "location": "string",
    "max_salary": "string",
    "min_salary": "string",
    "requirements": ["string"],
    "skills_required": ["string"],
    "title": "string",
    "date": "string",
    "score": number
  }
]`;

const jobSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      company: { type: "string" },
      description: { type: "string" },
      experience_level: { type: "string" },
      job_type: { type: "string" },
      location: { type: "string" },
      max_salary: { type: "string" },
      min_salary: { type: "string" },
      requirements: { type: "array", items: { type: "string" } },
      skills_required: { type: "array", items: { type: "string" } },
      title: { type: "string" },
      date: { type: "string" },
      score: { type: "number" },
    },
    required: [
      "company",
      "description",
      "experience_level",
      "job_type",
      "location",
      "max_salary",
      "min_salary",
      "requirements",
      "skills_required",
      "title",
      "date",
      "score",
    ],
  },
};

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query.trim(),
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: jobSchema,
      },
    });

    let text = response.candidates[0].content.parts[0].text;
    text = text
      .replace(/```json\n?/, "")
      .replace(/```$/, "")
      .trim();
    const jobs = JSON.parse(text);

    console.log(jobs);
    return jobs;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
}
