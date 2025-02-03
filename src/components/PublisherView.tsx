"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const PublisherView = () => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [spendAmount, setSpendAmount] = useState("");

  const createCampaign = () => {
    //
  };

  return (
    <div className="text-white flex justify-center p-8">
      <div className={"flex flex-col gap-2"}>
        <div className="text-2xl">Campaign Name:</div>
        <div>
          <Input
            placeholder={"ETHGlobal"}
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </div>
        <div className="text-2xl">Campaign Description:</div>
        <div>
          <Input
            placeholder={"Building the most valuable community in web3."}
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
          />
        </div>
        <div className="text-2xl">Spend Amount ($USD):</div>
        <div>
          <Input
            type={"number"}
            placeholder={"10.00"}
            value={spendAmount}
            onChange={(e) => setSpendAmount(e.target.value)}
          />
        </div>
        <div className="mt-8">
          <Button onClick={createCampaign}>Create</Button>
        </div>
      </div>
    </div>
  );
};
//
