import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

export function EpochCountdown() {
  const epochQuery = trpc.network.currentEpoch.useQuery(undefined, {
    refetchInterval: 1000,
  });
  const [timeLeft, setTimeLeft] = useState<string>("--:--:--");

  useEffect(() => {
    if (!epochQuery.data?.remainingMs) return;

    const updateTimer = () => {
      const remaining = epochQuery.data!.remainingMs;
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [epochQuery.data?.remainingMs]);

  if (epochQuery.isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-slate-900 text-white py-2 z-50 border-b-2 border-cyan-400">
      <div className="container mx-auto px-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-mono">
            Epoch <strong className="text-cyan-400">{epochQuery.data?.epochNumber}</strong>
          </span>
        </div>
        <span className="font-mono text-pink-400">
          Next epoch in <strong>{timeLeft}</strong>
        </span>
        <span className="text-xs text-slate-400">
          Pool: <strong className="text-green-400">{epochQuery.data?.deviceRewardPool} CMESH</strong>
        </span>
      </div>
    </div>
  );
}
