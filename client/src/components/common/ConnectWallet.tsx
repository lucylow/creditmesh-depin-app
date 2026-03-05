import { useWeb3 } from "@/contexts/Web3Context";
import { shortenAddress } from "@/utils/formatters";
import { Button } from "@/components/ui/button";

export function ConnectWallet() {
  const { account, connect, disconnect, isActive } = useWeb3();

  if (isActive && account) {
    return (
      <Button variant="outline" onClick={disconnect} size="sm">
        {shortenAddress(account)}
      </Button>
    );
  }

  return (
    <Button onClick={connect} size="sm">
      Connect Wallet
    </Button>
  );
}
