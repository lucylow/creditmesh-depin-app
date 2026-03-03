import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Leaderboard() {
  const leaderboardQuery = trpc.network.leaderboard.useQuery();
  const leaders = leaderboardQuery.data || [];

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "sensor":
        return "📊";
      case "gateway":
        return "🌐";
      case "verifier":
        return "✓";
      default:
        return "📱";
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-in">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            Top <span className="gradient-text">Contributors</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Meet the top earners in the CreditMesh network. Rankings are updated each epoch based on contribution metrics and reward distribution.
          </p>
        </div>

        {/* Leaderboard Table */}
        <div className="card-blueprint overflow-hidden">
          <div className="relative z-10">
            {leaderboardQuery.isLoading ? (
              <div className="space-y-4 p-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : leaders.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-600">No contributors yet. Be the first to join CreditMesh!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-4 px-6 tech-label">Rank</th>
                      <th className="text-left py-4 px-6 tech-label">Address</th>
                      <th className="text-left py-4 px-6 tech-label">Device Type</th>
                      <th className="text-right py-4 px-6 tech-label">Total Earned</th>
                      <th className="text-right py-4 px-6 tech-label">Staked</th>
                      <th className="text-right py-4 px-6 tech-label">Reputation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaders.map((leader) => (
                      <tr
                        key={leader.rank}
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getMedalEmoji(leader.rank)}</span>
                            <span className="font-bold text-slate-900 text-lg">{leader.rank}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <code className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-900 font-mono">
                            {formatAddress(leader.address)}
                          </code>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getDeviceIcon(leader.deviceType)}</span>
                            <span className="capitalize text-slate-900 font-medium">{leader.deviceType}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="font-bold text-slate-900">{leader.earned.toFixed(1)}</div>
                          <div className="text-xs text-slate-600">CMESH</div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="font-bold text-slate-900">{leader.staked}</div>
                          <div className="text-xs text-slate-600">CTC</div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className="font-bold text-slate-900">{leader.reputation}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="card-blueprint text-center">
            <div className="relative z-10">
              <div className="stat-label mb-2">Total Contributors</div>
              <div className="stat-display text-cyan-600 mb-4">{leaders.length}</div>
              <p className="text-sm text-slate-600">Active devices on the network</p>
            </div>
          </div>

          <div className="card-blueprint text-center">
            <div className="relative z-10">
              <div className="stat-label mb-2">Top Earner</div>
              <div className="stat-display text-pink-600 mb-4">
                {leaders.length > 0 ? `${leaders[0].earned.toFixed(1)} CMESH` : "—"}
              </div>
              <p className="text-sm text-slate-600">Highest single contributor</p>
            </div>
          </div>

          <div className="card-blueprint text-center">
            <div className="relative z-10">
              <div className="stat-label mb-2">Avg Reputation</div>
              <div className="stat-display text-cyan-600 mb-4">
                {leaders.length > 0
                  ? (leaders.reduce((sum, l) => sum + l.reputation, 0) / leaders.length).toFixed(0)
                  : "—"}
              </div>
              <p className="text-sm text-slate-600">Network average score</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 card-blueprint bg-slate-50">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">How Rankings Work</h3>
            <div className="grid md:grid-cols-2 gap-8 text-slate-600">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Earned (CMESH)</h4>
                <p className="text-sm mb-4">
                  Total CMESH tokens earned across all epochs. Higher earnings indicate consistent contribution and device uptime.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Reputation Score</h4>
                <p className="text-sm mb-4">
                  Calculated from data quality, uptime, and verification success rate. Malicious behavior results in slashing.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Device Type</h4>
                <p className="text-sm mb-4">
                  Sensors, gateways, and verifiers earn different base rates. Verifiers have the highest earning potential.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Staked Amount</h4>
                <p className="text-sm mb-4">
                  Higher stakes increase earning multipliers. Minimum stake varies by device type (10-100 CTC).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 justify-center mt-12">
          <Link href="/">
            <Button variant="outline" className="border-2 border-slate-300 text-slate-900 font-bold px-8 py-3">
              Back to Home
            </Button>
          </Link>
          <Link href="/simulator">
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3">
              Try Simulator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
