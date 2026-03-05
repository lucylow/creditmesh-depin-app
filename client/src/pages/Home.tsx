import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { NetworkChart } from "@/components/NetworkChart";
import { StatCounter } from "@/components/StatCounter";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsQuery = trpc.network.stats.useQuery();
  const epochQuery = trpc.network.currentEpoch.useQuery();

  const stats = statsQuery.data || {
    deviceCount: 0,
    totalStaked: 0,
    totalEarned: 0,
    activeDevices: 0,
  };

  const epoch = epochQuery.data;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-in">
              <div className="mb-6">
                <span className="tech-label text-cyan-600">Decentralized Physical Infrastructure</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                Monetize Your <span className="gradient-text">IoT Devices</span>
              </h1>
              <p className="text-lg text-slate-700 mb-8 max-w-lg leading-relaxed">
                CreditMesh is a DePIN on Creditcoin that lets anyone earn passive income by sharing sensor data, bandwidth, and connectivity through a decentralized, incentivized network.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/simulator">
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3">
                    Simulate Earnings
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" className="border-2 border-slate-300 text-slate-900 font-bold px-8 py-3">
                    View Leaderboard
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button variant="outline" className="border-2 border-slate-300 text-slate-900 font-bold px-8 py-3">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-96 flex items-center justify-center">
              <div className="wireframe-shape wireframe-cyan rounded-3xl w-64 h-64 absolute opacity-50"></div>
              <div className="wireframe-shape wireframe-pink rounded-full w-48 h-48 absolute opacity-50"></div>
              <div className="relative z-10 text-center">
                <div className="text-6xl font-black text-cyan-600 mb-2">∞</div>
                <p className="text-sm font-mono text-slate-600 uppercase tracking-widest">Decentralized Network</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Network Analytics</h2>
            <p className="text-slate-600">Growth trends and device distribution</p>
          </div>
          <NetworkChart />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Network Statistics</h2>
            <p className="text-slate-600">Real-time metrics from the CreditMesh DePIN</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Active Devices */}
            <div className="card-blueprint">
              <div className="relative z-10">
                {statsQuery.isLoading ? (
                  <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
                ) : (
                  <StatCounter value={stats.activeDevices} label="Active Devices" />
                )}
                <p className="text-sm text-slate-600">Currently contributing to the network</p>
              </div>
            </div>

            {/* Total Staked */}
            <div className="card-blueprint">
              <div className="relative z-10">
                {statsQuery.isLoading ? (
                  <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
                ) : (
                  <StatCounter value={stats.totalStaked} label="Total Staked" suffix=" CTC" />
                )}
                <p className="text-sm text-slate-600">CTC locked in the network</p>
              </div>
            </div>

            {/* Total Earned */}
            <div className="card-blueprint">
              <div className="relative z-10">
                {statsQuery.isLoading ? (
                  <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
                ) : (
                  <StatCounter value={stats.totalEarned} label="Total Earned" suffix=" CMESH" />
                )}
                <p className="text-sm text-slate-600">CMESH distributed to contributors</p>
              </div>
            </div>

            {/* Current Epoch */}
            <div className="card-blueprint">
              <div className="relative z-10">                {statsQuery.isLoading ? (
                  <div className="h-12 bg-slate-200 rounded animate-pulse"></div>
                ) : (
                  <StatCounter value={99.87} label="Network Uptime" suffix="%" />
                )}
                <p className="text-sm text-slate-600">24-hour reward cycle</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              CreditMesh combines blockchain verification with decentralized incentives to create a trustless IoT data marketplace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-blueprint text-center">
              <div className="relative z-10">
                <div className="text-4xl font-black text-cyan-600 mb-4">1</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Register Device</h3>
                <p className="text-slate-600">
                  Register your IoT device (sensor, gateway, or verifier node) on the CreditMesh network.
                </p>
              </div>
            </div>

            <div className="card-blueprint text-center">
              <div className="relative z-10">
                <div className="text-4xl font-black text-pink-600 mb-4">2</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Stake CTC</h3>
                <p className="text-slate-600">
                  Lock CTC tokens to activate your device and earn rewards based on contribution level.
                </p>
              </div>
            </div>

            <div className="card-blueprint text-center">
              <div className="relative z-10">
                <div className="text-4xl font-black text-cyan-600 mb-4">3</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Earn Rewards</h3>
                <p className="text-slate-600">
                  Receive CMESH tokens each epoch based on your device's contribution and stake amount.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Device Types Section */}
      <section className="section-divider bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Device Types</h2>
            <p className="text-slate-600">Choose the device that fits your infrastructure</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sensor */}
            <div className="card-blueprint hover:border-cyan-500">
              <div className="relative z-10">
                <div className="text-5xl font-black text-cyan-600 mb-4">📊</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Sensor</h3>
                <p className="text-xs text-slate-600 mb-4 font-mono uppercase tracking-widest">Entry Level</p>
                <ul className="text-sm text-slate-600 space-y-2 mb-6">
                  <li>✓ Temperature, humidity, air quality</li>
                  <li>✓ Low power consumption</li>
                  <li>✓ Base APY: <strong className="text-cyan-600">5%</strong></li>
                  <li>✓ Min stake: <strong className="text-cyan-600">10 CTC</strong></li>
                  <li>✓ Max stake: <strong className="text-cyan-600">500 CTC</strong></li>
                </ul>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold">
                  Deploy Sensor
                </Button>
              </div>
            </div>

            {/* Gateway */}
            <div className="card-blueprint hover:border-pink-500">
              <div className="relative z-10">
                <div className="text-5xl font-black text-pink-600 mb-4">🌐</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Gateway</h3>
                <p className="text-xs text-slate-600 mb-4 font-mono uppercase tracking-widest">Intermediate</p>
                <ul className="text-sm text-slate-600 space-y-2 mb-6">
                  <li>✓ Network relay & aggregation</li>
                  <li>✓ Higher bandwidth</li>
                  <li>✓ Base APY: <strong className="text-pink-600">15%</strong></li>
                  <li>✓ Min stake: <strong className="text-pink-600">50 CTC</strong></li>
                  <li>✓ Max stake: <strong className="text-pink-600">750 CTC</strong></li>
                </ul>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold">
                  Deploy Gateway
                </Button>
              </div>
            </div>

            {/* Verifier */}
            <div className="card-blueprint hover:border-cyan-500">
              <div className="relative z-10">
                <div className="text-5xl font-black text-cyan-600 mb-4">✓</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Verifier</h3>
                <p className="text-xs text-slate-600 mb-4 font-mono uppercase tracking-widest">Advanced</p>
                <ul className="text-sm text-slate-600 space-y-2 mb-6">
                  <li>✓ Proof-of-Contribution validation</li>
                  <li>✓ Highest rewards</li>
                  <li>✓ Base APY: <strong className="text-cyan-600">50%</strong></li>
                  <li>✓ Min stake: <strong className="text-cyan-600">100 CTC</strong></li>
                  <li>✓ Max stake: <strong className="text-cyan-600">1000 CTC</strong></li>
                </ul>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold">
                  Deploy Verifier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Success <span className="gradient-text">Stories</span></h2>
            <p className="text-slate-600">Hear from top contributors earning passive income</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <TestimonialsCarousel />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="card-blueprint text-center p-12">
            <div className="relative z-10">
              <h2 className="text-4xl font-black text-slate-900 mb-6">Ready to Join CreditMesh?</h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Start monetizing your IoT infrastructure today. Simulate your earnings and explore the leaderboard to see what's possible.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/simulator">
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 text-lg">
                    Launch Simulator
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" className="border-2 border-slate-300 text-slate-900 font-bold px-8 py-3 text-lg">
                    View Leaderboard
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button variant="outline" className="border-2 border-slate-300 text-slate-900 font-bold px-8 py-3 text-lg">
                    FAQ
                  </Button>
                </Link>
                <Link href="/device-metrics">
                  <Button variant="outline" className="border-2 border-slate-300 text-slate-900 font-bold px-8 py-3 text-lg">
                    Device Metrics
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
