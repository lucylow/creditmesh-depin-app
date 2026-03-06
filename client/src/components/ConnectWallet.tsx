import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export function ConnectWallet() {
  const { isConnected, address, balance, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-900">{formatAddress(address)}</p>
          <p className="text-xs text-slate-600">{balance.toLocaleString()} CTC</p>
        </div>
        <Button
          onClick={disconnectWallet}
          variant="outline"
          className="border-red-300 text-red-600 hover:bg-red-50"
          size="sm"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold flex items-center gap-2"
      size="sm"
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </Button>
  );
}
