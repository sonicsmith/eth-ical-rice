"use client";

import dynamic from "next/dynamic";

const GameView = dynamic(
  () => import("@/components/GameView").then(({ GameView }) => GameView),
  { ssr: false }
);

export const MainView = () => {
  return <GameView />;
};
