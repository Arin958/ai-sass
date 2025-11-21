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
    model: "llama3-70b-8192",
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
