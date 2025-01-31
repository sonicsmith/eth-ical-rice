import { AgentInstruction, Script } from "@/types";
import OpenAI from "openai";

if (!process.env.DEEP_SEEK_API_KEY) {
  throw new Error("DEEP_SEEK_API_KEY must be set");
}

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEP_SEEK_API_KEY,
});

const context =
  "You are an NPC in a video game. There are 5 characters in the game." +
  "Alice, a positive hardworker, with a smile on her face." +
  "Bob, a grumpy man who has no time for anyone." +
  "Charlie, a quirky, generous, joker." +
  "David, a social extrovert who likes to talk." +
  "Eve, an introverted shy old woman.";

const messageContent =
  "You are Alice, talking to Bob about how you need 3 lots of wheat.";

const formatting =
  "Keep responses to 2 sentences or less." +
  "Do not add any markdown formatting characters.";

export const generateScript = async (): Promise<Script> => {
  const prompt = `${context} ${messageContent} ${formatting}`;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
    model: "deepseek-chat",
  });

  const text = completion.choices[0].message.content;

  if (!text) {
    throw new Error("No text returned from OpenAI");
  }

  const command = {
    talker: "alice",
    listener: "bob",
    message: text,
  };

  const agentInstructions: AgentInstruction[] = [command];

  return {
    agentInstructions,
    personInNeed: "alice",
    amount: 3,
    foodType: "wheat",
  };
};
