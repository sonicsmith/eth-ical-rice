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

export const DonateModal = ({
  isOpen,
  setIsOpen,
  rice,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  rice: number;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Donate Rice</DialogTitle>
          <DialogDescription>
            This will donate all your rice to charity
          </DialogDescription>
        </DialogHeader>
        <div className="">
          Some grains of rice will be lost in transport. It is best to donate
          rice when you have a large amount.
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Donate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
