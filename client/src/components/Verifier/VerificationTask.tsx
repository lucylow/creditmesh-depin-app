import { useState, useEffect } from "react";
import { useContracts } from "@/hooks/useContracts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function VerificationTask() {
  const { rewardDistributor } = useContracts();
  const [tasks, setTasks] = useState<{ id: string; deviceId: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder: in production, fetch pending verification tasks from contract or indexer
    setTasks([]);
    setLoading(false);
  }, [rewardDistributor]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading tasks...
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No verification tasks available at the moment. Check back later.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">Device #{task.deviceId}</p>
              <p className="text-sm text-muted-foreground">Status: {task.status}</p>
            </div>
            <Button size="sm">Verify</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
