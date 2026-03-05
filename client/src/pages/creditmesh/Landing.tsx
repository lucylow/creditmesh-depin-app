import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";

export default function CreditMeshLanding() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            CreditMesh DePIN
          </h1>
          <p className="text-lg text-muted-foreground">
            Monetize your IoT devices on Creditcoin. Register devices, stake CMESH, earn rewards, and trade data in the decentralized marketplace.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
            <Link href="/devices">
              <Button variant="outline" size="lg">Register Device</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
