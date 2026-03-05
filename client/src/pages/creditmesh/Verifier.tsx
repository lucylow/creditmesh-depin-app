import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";
import { VerifierDashboard } from "@/components/Verifier/VerifierDashboard";

export default function CreditMeshVerifier() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Verifier</h1>
        <VerifierDashboard />
      </main>
      <Footer />
    </div>
  );
}
