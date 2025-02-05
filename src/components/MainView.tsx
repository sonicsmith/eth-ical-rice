"use client";

import { usePrivy } from "@privy-io/react-auth";
import dynamic from "next/dynamic";

const GameView = dynamic(
  () => import("@/components/GameView").then(({ GameView }) => GameView),
  { ssr: false }
);

export const MainView = () => {
  const { ready, authenticated } = usePrivy();

  if (!ready || !authenticated) {
    return (
      <div className="flex justify-center pt-32 text-white">
        {!ready ? <div>LOADING...</div> : <div>LOGIN REQUIRED</div>}
      </div>
    );
  }

  return (
    <div>
      <GameView />
    </div>
  );
};
