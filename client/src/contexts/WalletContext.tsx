import { createContext, useContext, useState, ReactNode } from "react";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  const connectWallet = async () => {
    // Mock wallet connection
    const mockAddresses = [
      "0x742d35Cc6634C0532925a3b844Bc9e7595f",
      "0x8f3Cf7ad23Cd3CaDbD9735AFF958023D8",
      "0x1234567890abcdef1234567890abcdef12",
    ];
    const randomAddress = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
    const mockBalance = Math.floor(Math.random() * 50000) + 5000;

    setAddress(randomAddress);
    setBalance(mockBalance);
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(0);
    setIsConnected(false);
  };

  return (
    <WalletContext.Provider value={{ isConnected, address, balance, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
