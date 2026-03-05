import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";
import { DeviceDetail } from "@/components/Devices/DeviceDetail";

export default function DeviceDetailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <DeviceDetail />
      </main>
      <Footer />
    </div>
  );
}
