import { CONTRACT_ABI } from "@/constants";
import { Script } from "@/types";
import { getChainIds } from "@/utils/getChainIds";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is required");
}
const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const chainId = getChainIds().xai;

export const useScript = () => {
  const [script, setScript] = useState<Script | null>(null);

  const { data: cid } = useReadContract({
    address,
    abi: CONTRACT_ABI,
    functionName: "getScriptHash",
    chainId,
    args: [],
  });

  useEffect(() => {
    if (!cid) {
      return;
    }
    console.log("Fetching script from IPFS", cid);
    fetch(`https://ipfs.io/ipfs/${cid}`)
      .then((res) => res.json())
      .then(setScript);
  }, [cid]);

  return script;
};
