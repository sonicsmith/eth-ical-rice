import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { getCapitalized } from "@/utils/getCapitalized";
import { useState } from "react";

export const GiveModal = ({
  isOpen,
  setIsOpen,
  wheat,
  tomato,
  playerName,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  wheat: number;
  tomato: number;
  playerName: string | undefined;
}) => {
  const [amount, setAmount] = useState(0);

  const capitalizedName = getCapitalized(playerName || "");
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Give to {capitalizedName}</DialogTitle>
          <DialogDescription>
            Choose what to give to {capitalizedName}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <div className="flex gap-2"></div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={wheat < amount}>Wheat bundles</Button>
          <Button disabled={tomato < amount}>Tomatoes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
