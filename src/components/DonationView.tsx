"use client";

import { getChainIds } from "@/utils/getChainIds";
import { useTransactionReceipt } from "wagmi";

export const DonationView = ({ hash }: { hash: string }) => {
  const result = useTransactionReceipt({
    hash: hash as `0x${string}`,
    chainId: getChainIds().base,
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
        {result.isSuccess && (
          <div className="mt-4">
            <div>
              Congratulations! You have successfully donated your rice to
              charity.
            </div>
            <div>
              Proof of donation:{" "}
              <a
                href={`${process.env.NEXT_PUBLIC_BASE_BLOCK_EXPLORER}/${hash}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Block explorer
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
