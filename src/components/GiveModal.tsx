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

export const GiveModal = ({
  isOpen,
  setIsOpen,
  wheat,
  tomato,
  rice,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  wheat: number;
  tomato: number;
  rice: number;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Give to player</DialogTitle>
          <DialogDescription>
            Choose what to give to this player
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button disabled={wheat === 0}>Wheat</Button>
          <Button disabled={tomato === 0}>Tomato</Button>
          <Input type="number" placeholder="Amount" />
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
