"use client";

import { useTransactionReceipt } from "wagmi";

const chainId =
  process.env.NEXT_PUBLIC_CHAIN_ENV === "testnet" ? 37714555429 : 660279;

export const TransactionView = ({ hash }: { hash: string }) => {
  const result = useTransactionReceipt({
    hash: hash as `0x${string}`,
    chainId,
  });

  return (
    <div className="text-white flex justify-center">
      <div className="text-3xl flex gap-2 mt-32">
        TRANSACTION:
        {!result ||
          (result.isPending && <div className="animate-pulse">PENDING</div>)}
        {result.isSuccess && <div className="text-green-500">SUCCESS</div>}
        {result.isError && <div className="text-red-500">ERROR</div>}
      </div>
    </div>
  );
};
