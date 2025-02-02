"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";

export const LoginView = () => {
  const { ready, authenticated, login } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);
  return (
    <div>
      <Button disabled={disableLogin} onClick={login}>
        Login
      </Button>
    </div>
  );
};
