"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import Link from "next/link";

export const LoginView = () => {
  const { ready, authenticated, login } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <div>
      {authenticated ? (
        <div className="flex justify-center p-32 text-white">
          <div className="flex flex-col gap-8">
            <Link href={"/game"} className="text-3xl text-center font-bold">
              Play Game!
            </Link>
            <Link className="text-center" href={"/publishers"}>
              (Publishers click here)
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex justify-center p-32">
          <Button disabled={disableLogin} onClick={login}>
            Login
          </Button>
        </div>
      )}
    </div>
  );
};
