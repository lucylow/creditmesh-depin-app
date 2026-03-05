import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useSimulator } from "@/hooks/useSimulator";

export default function Simulator() {
  const [stake, setStake] = useState(100);
  const [deviceType, setDeviceType] = useState<"sensor" | "gateway" | "verifier">("sensor");

  const result = useSimulator({
    stake,
    deviceType,
    reputation: 50,
  });

  const deviceInfo = {
    sensor: {
      description: "Temperature, humidity, air quality sensors",
      minStake: 10,
      maxStake: 500,
      color: "cyan",
    },
    gateway: {
      description: "Network relay and data aggregation",
      minStake: 50,
      maxStake: 750,
      color: "pink",
    },
    verifier: {
      description: "Proof-of-Contribution validation nodes",
      minStake: 100,
      maxStake: 1000,
      color: "cyan",
    },
  };

  const currentInfo = deviceInfo[deviceType];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-in">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            Reward <span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Estimate your potential earnings based on device type and stake amount. All calculations are performed on-chain during each epoch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Input Panel */}
          <div className="card-blueprint">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Configure Your Device</h2>

              {/* Device Type Selection */}
              <div className="mb-8">
                <label className="tech-label mb-4 block">Device Type</label>
                <div className="space-y-3">
                  {(["sensor", "gateway", "verifier"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setDeviceType(type)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        deviceType === type
                          ? "border-cyan-400 bg-cyan-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-bold text-slate-900 capitalize">{type}</div>
                      <div className="text-sm text-slate-600">{deviceInfo[type].description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stake Amount */}
              <div className="mb-8">
                <label className="tech-label mb-4 block">Stake Amount: {stake} CTC</label>
                <input
                  type="range"
                  min={currentInfo.minStake}
                  max={currentInfo.maxStake}
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-2">
                  <span>{currentInfo.minStake} CTC</span>
                  <span>{currentInfo.maxStake} CTC</span>
                </div>
              </div>

              {/* Manual Input */}
              <div className="mb-8">
                <label className="tech-label mb-2 block">Or Enter Manually</label>
                <input
                  type="number"
                  min={currentInfo.minStake}
                  max={currentInfo.maxStake}
                  value={stake}
                  onChange={(e) => setStake(Math.max(currentInfo.minStake, Math.min(currentInfo.maxStake, Number(e.target.value))))}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-cyan-400 outline-none"
                />
              </div>

              {/* Info Box */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-600 space-y-2">
                  <p><strong>Min Stake:</strong> {currentInfo.minStake} CTC</p>
                  <p><strong>Max Stake:</strong> {currentInfo.maxStake} CTC</p>
                  <p><strong>Lock-up Period:</strong> 1 epoch (24 hours)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* APY Card */}
            <div className="card-blueprint">
              <div className="relative z-10">
                <div className="stat-label mb-2">Annual Percentage Yield</div>
                <div className="stat-display text-cyan-600 mb-4">
                  {result.apy}%
                </div>
                <p className="text-sm text-slate-600">
                  Your estimated yearly return on staked CTC
                </p>
              </div>
            </div>

            {/* Daily Earnings */}
            <div className="card-blueprint">
              <div className="relative z-10">
                <div className="stat-label mb-2">Daily Earnings</div>
                <div className="stat-display text-pink-600 mb-4">
                  {result.daily} CMESH
                </div>
                <p className="text-sm text-slate-600">
                  Average reward per 24-hour epoch
                </p>
              </div>
            </div>

            {/* Monthly Earnings */}
            <div className="card-blueprint">
              <div className="relative z-10">
                <div className="stat-label mb-2">Monthly Earnings</div>
                <div className="stat-display text-cyan-600 mb-4">
                  {result.monthly} CMESH
                </div>
                <p className="text-sm text-slate-600">
                  Estimated 30-day reward accumulation
                </p>
              </div>
            </div>

            {/* Yearly Earnings */}
            <div className="card-blueprint">
              <div className="relative z-10">
                <div className="stat-label mb-2">Yearly Earnings</div>
                <div className="stat-display text-pink-600 mb-4">
                  {result.yearly} CMESH
                </div>
                <p className="text-sm text-slate-600">
                  Projected annual reward total
                </p>
              </div>
            </div>

            {/* Verifier Chance */}
            {deviceType === "verifier" && (
              <div className="card-blueprint border-pink-400">
                <div className="relative z-10">
                  <div className="stat-label mb-2 text-pink-600">Verifier Selection Chance</div>
                  <div className="stat-display text-pink-600 mb-4">
                    {result.verifierChancePct ?? 0}%
                  </div>
                  <p className="text-sm text-slate-600">
                    Probability of being selected as epoch verifier
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 card-blueprint bg-slate-50">
          <div className="relative z-10">
            <h3 className="font-bold text-slate-900 mb-3">⚠️ Disclaimer</h3>
            <p className="text-sm text-slate-600 mb-3">
              This calculator provides estimates based on current network parameters. Actual earnings may vary based on:
            </p>
            <ul className="text-sm text-slate-600 space-y-1 ml-4">
              <li>• Network congestion and device availability</li>
              <li>• Proof-of-Contribution verification success rate</li>
              <li>• Epoch reward pool distribution</li>
              <li>• Device uptime and data quality metrics</li>
              <li>• Slashing penalties for malicious behavior</li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 justify-center mt-12">
          <Link href="/">
            <Button variant="outline" className="border-2 border-slate-300 text-slate-900 font-bold px-8 py-3">
              Back to Home
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3">
              View Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
