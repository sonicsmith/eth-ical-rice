import OpenAI from "openai";

if (!process.env.DEEP_SEEK_API_KEY) {
  throw new Error("DEEP_SEEK_API_KEY must be set");
}

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEP_SEEK_API_KEY,
});

export const generateScript = async () => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an NPC in a farming game. Say hello",
      },
    ],
    model: "deepseek-chat",
  });

  const text = completion.choices[0].message.content;

  if (!text) {
    throw new Error("No text returned from OpenAI");
  }

  return text;
};
