import { useWeb3 } from "@/contexts/Web3Context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { VerificationTask } from "./VerificationTask";

export function VerifierDashboard() {
  const { account } = useWeb3();

  if (!account) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Connect your wallet to participate as a verifier.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Verification Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Review and verify device data submissions to earn rewards.
          </p>
        </CardHeader>
      </Card>
      <VerificationTask />
    </div>
  );
}
