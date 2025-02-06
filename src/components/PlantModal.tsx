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
  seeds,
  plantSeed,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  seeds: Record<PlantType, number>;
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
          <Button disabled={seeds.wheat === 0} onClick={() => onClick("wheat")}>
            Wheat
          </Button>
          <Button
            disabled={seeds.tomato === 0}
            onClick={() => onClick("tomato")}
          >
            Tomato
          </Button>
          <Button disabled={seeds.rice === 0} onClick={() => onClick("rice")}>
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
