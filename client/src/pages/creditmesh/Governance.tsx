import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CreditMeshGovernance() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Governance</h1>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">CMESH Governance</h2>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Participate in protocol governance. Proposals and voting will be available here once the governance module is deployed.
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
