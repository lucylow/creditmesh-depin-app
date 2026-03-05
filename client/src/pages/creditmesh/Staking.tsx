import { useWeb3 } from "@/contexts/Web3Context";
import { StakeForm } from "@/components/Staking/StakeForm";
import { UnstakeForm } from "@/components/Staking/UnstakeForm";
import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";

export default function CreditMeshStaking() {
  const { account } = useWeb3();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Staking</h1>
        {!account ? (
          <p className="text-muted-foreground">Connect your wallet to stake CMESH for your devices.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <StakeForm />
            <UnstakeForm />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
