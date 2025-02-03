"use client";

import { usePrivy } from "@privy-io/react-auth";
import dynamic from "next/dynamic";

const GameView = dynamic(
  () => import("@/components/GameView").then(({ GameView }) => GameView),
  { ssr: false }
);

export const MainView = () => {
  const { ready, authenticated } = usePrivy();

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <div>Please login to continue</div>;
  }

  return (
    <div>
      <GameView />
    </div>
  );
};
