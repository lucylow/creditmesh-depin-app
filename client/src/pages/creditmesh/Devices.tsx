import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { DeviceList } from "@/components/Devices/DeviceList";
import { RegisterDevice } from "@/components/Devices/RegisterDevice";
import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";

export default function CreditMeshDevices() {
  const { account } = useWeb3();
  const [showRegister, setShowRegister] = useState(false);

  if (!account) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Please connect your wallet.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Devices</h1>
          <Button
            onClick={() => setShowRegister(!showRegister)}
          >
            {showRegister ? "View Devices" : "Register New Device"}
          </Button>
        </div>
        {showRegister ? <RegisterDevice /> : <DeviceList />}
      </main>
      <Footer />
    </div>
  );
}
