"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

export const LoginView = () => {
  const { ready, authenticated, login, logout } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <div className="bg-[#40722A] p-16">
      <div className="flex justify-center">
        <Image src={"/assets/logo.jpg"} width={256} height={256} alt={"logo"} />
      </div>
      {authenticated ? (
        <div className="flex justify-center p-8 text-white">
          <div className="flex flex-col gap-8">
            <Link
              href={"/game"}
              className="text-3xl text-center font-bold underline"
            >
              Play Game!
            </Link>
            <Link className="text-center" href={"/publish"}>
              (Advertisers click here)
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex justify-center p-8">
          <Button disabled={disableLogin} onClick={login}>
            Login
          </Button>
        </div>
      )}
      {authenticated && (
        <div className="flex justify-center p-8">
          <Button onClick={logout}>Logout</Button>
        </div>
      )}
    </div>
  );
};
