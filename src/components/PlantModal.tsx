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
import { useState } from "react";
import { PlantType } from "@/types";

export const PlantModal = ({
  isOpen,
  setIsOpen,
  wheatSeeds,
  tomatoSeeds,
  riceSeeds,
  plantSeed,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  wheatSeeds: number;
  tomatoSeeds: number;
  riceSeeds: number;
  plantSeed: (plantType: PlantType) => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async (plantType: PlantType) => {
    setIsLoading(true);
    await plantSeed(plantType);
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Plant Seed</DialogTitle>
          <DialogDescription>Choose what seed to plant</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button disabled={wheatSeeds === 0} onClick={() => onClick("wheat")}>
            Wheat
          </Button>
          <Button
            disabled={tomatoSeeds === 0}
            onClick={() => onClick("tomato")}
          >
            Tomato
          </Button>
          <Button disabled={riceSeeds === 0} onClick={() => onClick("rice")}>
            Rice
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
