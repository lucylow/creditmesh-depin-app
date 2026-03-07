import { useWeb3 } from "@/contexts/Web3Context";
import { shortenAddress } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/common/ErrorAlert";

export function ConnectWallet() {
  const { account, connect, disconnect, isActive, connectionError } = useWeb3();

  if (isActive && account) {
    return (
      <Button variant="outline" onClick={disconnect} size="sm">
        {shortenAddress(account)}
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {connectionError && (
        <ErrorAlert title="Wallet connection failed" message={connectionError} />
      )}
      <Button onClick={connect} size="sm">
        Connect Wallet
      </Button>
    </div>
  );
}
