import { Link, useLocation } from "wouter";
import { ConnectWallet } from "@/components/common/ConnectWallet";
import { LayoutDashboard, Cpu, Coins, ShoppingBag, ShieldCheck, Vote } from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/devices", label: "Devices", icon: Cpu },
  { path: "/staking", label: "Staking", icon: Coins },
  { path: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { path: "/verifier", label: "Verifier", icon: ShieldCheck },
  { path: "/governance", label: "Governance", icon: Vote },
];

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            CreditMesh
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                href={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
}
