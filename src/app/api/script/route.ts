import { Script } from "@/types";
import { NextResponse } from "next/server";
import { generateScript } from "./generateScript";

export const GET = async () => {
  const script: Script = {
    agentInstructions: [
      {
        talker: "alice",
        listener: "bob",
        message: "Hi bob, do you have any 3 wheat to spare?",
      },
      {
        talker: "bob",
        listener: "alice",
        message: "I'm sorry I don't alice",
      },
    ],
    personInNeed: "alice",
    amount: 3,
    foodType: "wheat",
  };

  const aiScript = await generateScript();

  console.log(aiScript);

  return NextResponse.json(script);
};
