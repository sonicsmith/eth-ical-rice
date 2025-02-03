export interface AgentInstruction {
  talker: string;
  listener: string;
  message: string;
}

export interface Script {
  agentInstructions: AgentInstruction[];
  personInNeed: string;
  amount: number;
  foodType: string;
}

export type PlantType = "wheat" | "tomato" | "rice";
