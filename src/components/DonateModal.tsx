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
import { RICE_GRAINS_PER_SEED } from "@/constants";

export const DonateModal = ({
  isOpen,
  setIsOpen,
  rice,
  donateRice,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  rice: number;
  donateRice: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Donate Rice</DialogTitle>
          <DialogDescription>
            This will donate {(rice * RICE_GRAINS_PER_SEED).toLocaleString()}{" "}
            rice grains to charity
          </DialogDescription>
        </DialogHeader>
        {rice ? (
          <div className="">
            Some grains of rice will be lost in transport. It is best to donate
            rice when you have a large amount.
          </div>
        ) : (
          <div className="">You don&apos;t have any rice to donate</div>
        )}
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" disabled={rice === 0} onClick={donateRice}>
            Donate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
