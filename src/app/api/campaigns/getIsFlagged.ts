import OpenAI from "openai";
import { isProfane } from "no-profanity";

export const getIsFlagged = async (input: string) => {
  if (isProfane(input)) {
    return true;
  }

  const openai = new OpenAI();

  const moderation = await openai.moderations.create({
    model: "omni-moderation-latest",
    input,
  });
  console.log(moderation);
  return moderation.results[0].flagged;
};
