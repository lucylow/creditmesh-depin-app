import { Link } from "wouter";
import { useStaking } from "@/hooks/useStaking";
import { formatEther } from "@/utils/formatters";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function StakingCard() {
  const { totalStaked, loading } = useStaking();

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-lg">Your Staking</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : (
          <p className="text-2xl font-bold">{formatEther(totalStaked)} CMESH</p>
        )}
        <Link href="/staking">
          <Button variant="outline" className="w-full">
            Manage Staking
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
