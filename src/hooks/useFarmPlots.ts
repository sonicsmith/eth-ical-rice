import { useState } from "react";

export const useFarmPlots = () => {
  const [farmPlots, setFarmPlots] = useState<string[]>([]);

  return farmPlots;
};
