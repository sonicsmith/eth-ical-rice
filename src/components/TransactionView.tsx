"use client";

import { getChainIds } from "@/utils/getChainIds";
import { useTransactionReceipt } from "wagmi";

export const TransactionView = ({ hash }: { hash: string }) => {
  const result = useTransactionReceipt({
    hash: hash as `0x${string}`,
    chainId: getChainIds().xai,
  });

  return (
    <div className="text-white flex justify-center">
      <div className="flex flex-col">
        <div className="text-3xl flex gap-2 mt-32">
          TRANSACTION:
          {!result ||
            (result.isPending && <div className="animate-pulse">PENDING</div>)}
          {result.isSuccess && <div className="text-green-500">SUCCESS</div>}
          {result.isError && <div className="text-red-500">ERROR</div>}
        </div>
        <div className="mt-4">
          <a
            href={`${process.env.NEXT_PUBLIC_XAI_BLOCK_EXPLORER}/${hash}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Link to transaction
          </a>
        </div>
      </div>
    </div>
  );
};
