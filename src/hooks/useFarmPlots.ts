import { useState } from "react";

export const useFarmPlots = ({ address }: { address: string }) => {
  const [farmPlots, setFarmPlots] = useState<string[]>([]);

  return farmPlots;
};
