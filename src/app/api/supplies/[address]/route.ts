import { getPlantSupply } from "@/utils/getPlantSupply";
import { NextResponse } from "next/server";

export const GET = async () => {
  const plantSupply = getPlantSupply();

  return NextResponse.json({ plantSupply });
};
