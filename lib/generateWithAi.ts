import { groq } from "./groq";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

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

export async function generateCodeAssistant(
  code: string,
  language: string,
  mode: "write" | "debug" | "optimize"
) {
  const modePrompts = {
    write: `
You are an advanced AI coding assistant.

Task:
- Rewrite or complete the given code.
- Improve structure, readability, and best practices.
- Add missing logic if needed.
- Use modern ${language} conventions.

Return ONLY the improved code in a clean block.
`,

    debug: `
You are an expert software engineer and debugger.

Task:
- Analyze the given ${language} code.
- Identify ALL bugs, errors, weaknesses, or potential failures.
- Explain the problems clearly.
- Provide the fixed version of the code.

Return these sections:
## Issues Found
(list problems)

## Explanation
(why they happen)

## Fixed Code
(code block)
`,

    optimize: `
You are a senior performance engineer.

Task:
- Optimize the provided ${language} code.
- Improve speed, memory usage, readability, or structure.
- Remove unnecessary operations.
- Suggest better patterns.

Return these sections:
## Optimization Summary
## Why It Matters
## Optimized Code
`,
  };

  const systemPrompt = `
You are an expert AI coding assistant.  
You write clean, modern, well-structured ${language} code.  
Always be clear, accurate, and helpful.
`;

  const userPrompt = `
Mode: ${mode.toUpperCase()}
Language: ${language}

User Code:
\`\`\`${language}
${code}
\`\`\`

${modePrompts[mode]}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return (
    completion.choices?.[0]?.message?.content ??
    "AI failed to generate output."
  );
}





export async function generateChatReply(
  messages: Array<{ role: "user" | "assistant"; content: string }>
) {
  // System message (always injected)
  const systemPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: `
You are an intelligent AI assistant.
You help users with coding, writing, problem-solving, and general conversation.
Your tone should be friendly, helpful, and highly knowledgeable.
Keep answers clear, structured, factual, and accurate.
Avoid hallucinations and provide only reliable answers.
    `.trim(),
  };

  // Convert incoming messages to valid ChatCompletionMessageParam[]
  const formattedMessages: ChatCompletionMessageParam[] = [
    systemPrompt,
    ...messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  // Create completion
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    messages: formattedMessages,
  });

  return (
    completion.choices?.[0]?.message?.content ??
    "Failed to generate chat response."
  );
}

