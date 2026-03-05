import { useWeb3 } from "@/contexts/Web3Context";
import { StatsOverview } from "@/components/Dashboard/StatsOverview";
import { DeviceList } from "@/components/Devices/DeviceList";
import { StakingCard } from "@/components/Dashboard/StakingCard";
import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";

export default function CreditMeshDashboard() {
  const { account, connect } = useWeb3();

  if (!account) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Welcome to CreditMesh</h2>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to manage your devices and stake.
            </p>
            <Button onClick={connect} size="lg">
              Connect Wallet
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <StatsOverview />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <DeviceList />
          </div>
          <div>
            <StakingCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
