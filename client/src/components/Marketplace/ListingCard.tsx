import { ethers } from "ethers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface Listing {
  id: string;
  deviceId: string;
  price: ethers.BigNumber;
  available: ethers.BigNumber;
  expiry: number;
  seller: string;
  metadata?: { name?: string; description?: string; image?: string };
}

interface ListingCardProps {
  listing: Listing;
  onPurchase?: () => void;
}

export function ListingCard({ listing, onPurchase }: ListingCardProps) {
  const isExpired = listing.expiry < Math.floor(Date.now() / 1000);
  const imageUrl = listing.metadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/") ?? "";

  return (
    <Card className="overflow-hidden">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={listing.metadata?.name ?? "Listing"}
          className="w-full h-40 object-cover"
        />
      )}
      <CardHeader>
        <h3 className="font-semibold">{listing.metadata?.name ?? `Device #${listing.deviceId}`}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {listing.metadata?.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-lg font-bold">
          {ethers.utils.formatEther(listing.price)} CMESH <span className="text-sm font-normal text-muted-foreground">/ unit</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Available: {listing.available.toString()} · Expires: {new Date(listing.expiry * 1000).toLocaleDateString()}
        </p>
        {!isExpired && onPurchase && (
          <Button onClick={onPurchase} className="w-full mt-2">
            Purchase
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
