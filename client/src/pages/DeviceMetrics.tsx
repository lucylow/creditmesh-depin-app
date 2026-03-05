import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const deviceMetrics = {
  sensor: {
    name: "IoT Sensor",
    emoji: "📊",
    uptime: 99.2,
    dataPoints: 2847,
    reputation: 4.8,
    monthlyEarnings: 45.5,
    minStake: 100,
    maxStake: 5000,
    apy: "18-24%",
    powerConsumption: "0.5W",
    dataFrequency: "Every 5 minutes",
    accuracy: "±0.5%",
    range: "100m",
  },
  gateway: {
    name: "Network Gateway",
    emoji: "🌐",
    uptime: 99.8,
    dataPoints: 5234,
    reputation: 4.9,
    monthlyEarnings: 156.3,
    minStake: 500,
    maxStake: 25000,
    apy: "22-28%",
    powerConsumption: "2.5W",
    dataFrequency: "Real-time",
    accuracy: "±0.2%",
    range: "500m",
  },
  verifier: {
    name: "Verifier Node",
    emoji: "🔐",
    uptime: 99.95,
    dataPoints: 8921,
    reputation: 4.95,
    monthlyEarnings: 287.6,
    minStake: 2000,
    maxStake: 100000,
    apy: "28-35%",
    powerConsumption: "5W",
    dataFrequency: "Continuous",
    accuracy: "±0.1%",
    range: "Unlimited",
  },
};

const performanceData = [
  { metric: "Sensor", uptime: 99.2, reputation: 4.8, earnings: 45.5 },
  { metric: "Gateway", uptime: 99.8, reputation: 4.9, earnings: 156.3 },
  { metric: "Verifier", uptime: 99.95, reputation: 4.95, earnings: 287.6 },
];

const uptimeHistory = [
  { day: "Mon", sensor: 99.1, gateway: 99.8, verifier: 99.95 },
  { day: "Tue", sensor: 99.3, gateway: 99.7, verifier: 99.94 },
  { day: "Wed", sensor: 99.2, gateway: 99.9, verifier: 99.96 },
  { day: "Thu", sensor: 99.4, gateway: 99.8, verifier: 99.95 },
  { day: "Fri", sensor: 99.1, gateway: 99.85, verifier: 99.97 },
  { day: "Sat", sensor: 99.2, gateway: 99.9, verifier: 99.94 },
  { day: "Sun", sensor: 99.3, gateway: 99.75, verifier: 99.96 },
];

export default function DeviceMetrics() {
  const [selectedDevice, setSelectedDevice] = useState<"sensor" | "gateway" | "verifier">("sensor");
  const device = deviceMetrics[selectedDevice];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="outline" className="mb-6 border-white text-white hover:bg-white/10">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-5xl font-black mb-2">Device Performance Metrics</h1>
          <p className="text-lg text-slate-300">Compare detailed statistics across device types</p>
        </div>
      </div>

      {/* Device Selection */}
      <section className="py-12 bg-slate-50 border-b-2 border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            {(Object.entries(deviceMetrics) as [keyof typeof deviceMetrics, typeof device][]).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setSelectedDevice(key)}
                className={`card-blueprint text-center p-6 transition-all ${
                  selectedDevice === key ? "border-cyan-400 shadow-lg scale-105" : ""
                }`}
              >
                <div className="text-5xl mb-3">{data.emoji}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{data.name}</h3>
                <p className="text-sm text-slate-600">Click to view details</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Metrics */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Key Stats */}
            <div className="card-blueprint">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Performance Overview</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-mono text-slate-600 uppercase tracking-widest mb-2">Uptime</p>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-black text-cyan-600">{device.uptime}%</div>
                      <div className="flex-1 bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-3 rounded-full"
                          style={{ width: `${device.uptime}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-mono text-slate-600 uppercase tracking-widest mb-2">Reputation Score</p>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-black text-pink-600">{device.reputation}/5</div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-2xl ${i < Math.floor(device.reputation) ? "⭐" : "☆"}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-mono text-slate-600 uppercase tracking-widest mb-2">Monthly Earnings</p>
                    <div className="text-4xl font-black text-green-600">${device.monthlyEarnings}</div>
                  </div>

                  <div>
                    <p className="text-sm font-mono text-slate-600 uppercase tracking-widest mb-2">Data Points Collected</p>
                    <div className="text-3xl font-black text-slate-900">{device.dataPoints.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="card-blueprint">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Technical Specifications</h2>
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-4">
                    <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-1">Minimum Stake</p>
                    <p className="text-lg font-bold text-slate-900">{device.minStake} CTC</p>
                  </div>

                  <div className="border-b border-slate-200 pb-4">
                    <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-1">Maximum Stake</p>
                    <p className="text-lg font-bold text-slate-900">{device.maxStake.toLocaleString()} CTC</p>
                  </div>

                  <div className="border-b border-slate-200 pb-4">
                    <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-1">APY Range</p>
                    <p className="text-lg font-bold text-cyan-600">{device.apy}</p>
                  </div>

                  <div className="border-b border-slate-200 pb-4">
                    <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-1">Power Consumption</p>
                    <p className="text-lg font-bold text-slate-900">{device.powerConsumption}</p>
                  </div>

                  <div className="border-b border-slate-200 pb-4">
                    <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-1">Data Frequency</p>
                    <p className="text-lg font-bold text-slate-900">{device.dataFrequency}</p>
                  </div>

                  <div className="border-b border-slate-200 pb-4">
                    <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-1">Accuracy</p>
                    <p className="text-lg font-bold text-slate-900">{device.accuracy}</p>
                  </div>

                  <div>
                    <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-1">Coverage Range</p>
                    <p className="text-lg font-bold text-slate-900">{device.range}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Charts */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Performance Comparison */}
            <div className="card-blueprint">
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="metric" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="uptime" fill="#06b6d4" isAnimationActive={true} />
                    <Bar dataKey="reputation" fill="#ec4899" isAnimationActive={true} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Uptime History */}
            <div className="card-blueprint">
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-900 mb-4">7-Day Uptime Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={uptimeHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis domain={[99, 100]} stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="sensor" stroke="#06b6d4" strokeWidth={2} isAnimationActive={true} />
                    <Line type="monotone" dataKey="gateway" stroke="#ec4899" strokeWidth={2} isAnimationActive={true} />
                    <Line type="monotone" dataKey="verifier" stroke="#8b5cf6" strokeWidth={2} isAnimationActive={true} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="card-blueprint text-center p-12">
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-slate-900 mb-4">Ready to Deploy?</h2>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Choose your device type and start earning rewards with CreditMesh today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/simulator">
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 text-lg">
                    Launch Simulator
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="border-2 border-slate-300 text-slate-900 font-bold px-8 py-3 text-lg">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
