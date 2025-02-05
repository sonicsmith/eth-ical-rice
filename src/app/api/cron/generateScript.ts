import { agentKeys } from "@/constants";
import { AgentInstruction, Script } from "@/types";
import { getNextCampaign } from "@/utils/getNextCampaign";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY must be set");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const context =
  "You are an NPC in a video game. There are 5 characters in the game." +
  "Alice, a positive hard worker, with a smile on her face." +
  "Bob, a grumpy man who has no time for anyone." +
  "Charlie, a quirky, generous, joker." +
  "David, a social extrovert who likes to talk." +
  "Eve, an introverted shy old woman.";

const formatting =
  "Keep responses to 2 sentences or less." +
  "Do not add any markdown formatting characters.";

const getRandomCharacter = (exclude?: string) => {
  const characters = agentKeys.filter((key) => key !== exclude);
  return characters[Math.floor(Math.random() * characters.length)];
};

const COMMANDS_PER_DAY = 15;

export const generateScript = async (): Promise<Script> => {
  const agentInstructions: AgentInstruction[] = [];

  let talker = getRandomCharacter();
  let listener = getRandomCharacter(talker);
  let lastMessage = "";
  const foodType = Math.random() > 0.5 ? "wheat" : "tomato";
  const amount = Math.floor(Math.random() * 5) + 1;
  const personInNeed = talker;

  const campaign = await getNextCampaign();
  console.log("Campaign", campaign);

  for (let i = 0; i < COMMANDS_PER_DAY; i++) {
    let messageContent = "";

    if (i % 3 === 0) {
      listener = getRandomCharacter(talker);
      lastMessage = "";
    }

    if (!lastMessage) {
      messageContent = `You are ${talker}, talking to ${listener} about how ${
        personInNeed === talker ? "you" : personInNeed
      } need ${amount} lots of ${foodType}. You can't help, but you can talk about it.`;
    } else {
      messageContent = `You are ${talker}, reply to ${listener}, who just said "${lastMessage}".`;
    }

    let prompt = `${context} ${messageContent} ${formatting}`;
    if (i === 0 && !!campaign) {
      const productName = campaign.name;
      const productDescription = campaign.description;
      const productPlacement = `Also subtly mention our sponsor, '${productName}' - ${productDescription}.`;
      prompt = prompt + productPlacement;
    }

    console.log("Making call to ai api");
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      model: "gpt-4o-mini",
    });

    const text = completion.choices[0].message.content;

    console.log("text:", text);

    if (!text) {
      throw new Error("No text returned from OpenAI");
    }

    agentInstructions.push({
      talker,
      listener,
      message: text,
    });

    lastMessage = text;
    [talker, listener] = [listener, talker];
  }

  return {
    agentInstructions,
    personInNeed,
    amount,
    foodType,
  };
};
