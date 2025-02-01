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

export const PlantModal = ({
  isOpen,
  setIsOpen,
  wheatSeeds,
  tomatoSeeds,
  riceSeeds,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  wheatSeeds: number;
  tomatoSeeds: number;
  riceSeeds: number;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Plant Seed</DialogTitle>
          <DialogDescription>Choose what seed to plant</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button disabled={wheatSeeds === 0}>Wheat</Button>
          <Button disabled={tomatoSeeds === 0}>Tomato</Button>
          <Button disabled={riceSeeds === 0}>Rice</Button>
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
