import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Listing } from "./ListingCard";

interface PurchaseModalProps {
  listing: Listing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (listingId: string, quantity: number) => Promise<void>;
}

export function PurchaseModal({
  listing,
  open,
  onOpenChange,
  onConfirm,
}: PurchaseModalProps) {
  if (!listing) return null;

  const handleConfirm = async () => {
    await onConfirm(listing.id, 1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            {listing.metadata?.name ?? `Listing #${listing.id}`} —{" "}
            {listing.available.toString()} units available
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm Purchase</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
