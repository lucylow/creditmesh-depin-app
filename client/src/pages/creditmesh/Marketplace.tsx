import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/contexts/Web3Context";
import { useContracts } from "@/hooks/useContracts";
import { ListingCard, type Listing } from "@/components/Marketplace/ListingCard";
import { CreateListing } from "@/components/Marketplace/CreateListing";
import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { IPFS_GATEWAY } from "@/services/contractAddresses";

export default function CreditMeshMarketplace() {
  const { account } = useWeb3();
  const { marketplace, deviceNFT } = useContracts();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchListings = async () => {
    if (!marketplace) return;
    setLoading(true);
    try {
      const total = await (marketplace as unknown as { listingCounter: () => Promise<ethers.BigNumber> }).listingCounter();
      const listingPromises: Promise<Listing>[] = [];
      const n = total.toNumber();
      for (let i = 1; i <= n; i++) {
        const listing = await (marketplace as unknown as { listings: (id: number) => Promise<[ethers.BigNumber, ethers.BigNumber, ethers.BigNumber, ethers.BigNumber, string]> }).listings(i);
        const [, price, available, expiry, seller] = listing;
        const expiryNum = (expiry as ethers.BigNumber).toNumber();
        if (available.gt(0) && expiryNum > Math.floor(Date.now() / 1000)) {
          listingPromises.push(
            (async () => {
              let metadata: Listing["metadata"] = undefined;
              const deviceId = (listing[0] as ethers.BigNumber).toString();
              if (deviceNFT) {
                try {
                  const tokenURI = await (deviceNFT as unknown as { tokenURI: (id: string) => Promise<string> }).tokenURI(deviceId);
                  const url = tokenURI.replace("ipfs://", IPFS_GATEWAY);
                  metadata = await fetch(url).then((r) => r.json());
                } catch {
                  // ignore
                }
              }
              return {
                id: i.toString(),
                deviceId,
                price,
                available,
                expiry: expiryNum,
                seller,
                metadata,
              };
            })()
          );
        }
      }
      const results = await Promise.all(listingPromises);
      setListings(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [marketplace]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Data Marketplace</h1>
          {account && (
            <Button onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? "Browse Listings" : "Create Listing"}
            </Button>
          )}
        </div>
        {showCreate ? (
          <CreateListing />
        ) : (
          <>
            {loading ? (
              <div className="text-center py-10 text-muted-foreground">Loading listings...</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No active listings</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onPurchase={fetchListings}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
