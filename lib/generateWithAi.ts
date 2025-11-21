import { groq } from "./groq";


export async function generateWithAI(topic: string, tone: string, length: string) {
  const lengthMap = {
    short: "250–350 words",
    medium: "600–800 words",
    long: "1000–1500 words",
  };

  const toneMap = {
    professional: "professional, authoritative, and formal",
    casual: "friendly, relaxed, conversational",
    enthusiastic: "energetic, inspiring, passionate",
    humorous: "funny, witty, playful",
  };

  const prompt = `
Write a complete blog article in markdown.

Topic: "${topic}"
Tone style: ${toneMap[tone as keyof typeof toneMap]}
Target length: ${lengthMap[length as keyof typeof lengthMap]}

Requirements:
- Use SEO-optimized writing
- Use markdown headings (##, ###)
- Include examples where relevant
- Provide value, insights, and clarity
- End with a strong conclusion
- Make writing natural and human-like
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: "You are a professional blog writer. Write engaging, deep, well-structured content.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8,
  });

  return (
    completion.choices?.[0]?.message?.content ??
    "Failed to generate blog content."
  );
}




export async function generateResumeWithAI(jobTitle: string, experience: string, skills: string[]) {
  const experienceMap = {
    "entry-level": "0-2 years of experience, recent graduate or career changer",
    "mid-level": "3-7 years of professional experience",
    "senior": "8+ years of experience with leadership responsibilities",
    "executive": "15+ years with strategic decision-making experience"
  };

  const prompt = `
Create a professional resume in markdown format for a ${jobTitle} position.

Experience Level: ${experienceMap[experience as keyof typeof experienceMap] || experience}
Key Skills: ${skills.join(', ')}

Requirements:
- Write in professional, industry-standard resume language
- Use markdown formatting with clear sections
- Include these main sections: Professional Summary, Technical Skills, Work Experience, Education
- Make it ATS (Applicant Tracking System) friendly
- Focus on achievements and quantifiable results
- Use action verbs and industry-specific terminology
- Tailor the content specifically for a ${jobTitle} role
- Ensure the skills section highlights: ${skills.join(', ')}
- Keep the tone professional and confident

Important:
- For work experience, create 2-3 realistic job entries that match the experience level
- Include specific accomplishments with metrics (e.g., "Improved performance by 25%", "Managed team of 8 engineers")
- Make the resume look authentic and tailored to the specific role
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a professional resume writer and career coach. Create compelling, ATS-friendly resumes that highlight achievements and skills effectively.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7, // Slightly lower temperature for more professional/consistent output
  });

  return (
    completion.choices?.[0]?.message?.content ??
    "Failed to generate resume content."
  );
}
