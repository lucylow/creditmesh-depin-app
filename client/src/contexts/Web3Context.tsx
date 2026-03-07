import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isActive: boolean;
  connectionError: string | null;
}

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connect = async () => {
    setConnectionError(null);
    if (!window.ethereum) {
      setConnectionError("Please install MetaMask or another Web3 wallet.");
      return;
    }
    try {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      await prov.send("eth_requestAccounts", []);
      const sig = prov.getSigner();
      const acc = await sig.getAddress();
      const network = await prov.getNetwork();
      setProvider(prov);
      setSigner(sig);
      setAccount(acc);
      setChainId(network.chainId);
      setIsActive(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Connection failed";
      setConnectionError(message);
      console.error("Web3 connection failed:", error);
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setIsActive(false);
    setConnectionError(null);
  };

  useEffect(() => {
    if (window.ethereum?.on) {
      window.ethereum.on("accountsChanged", (accounts: unknown) => {
        const list = accounts as string[];
        if (list.length === 0) disconnect();
        else setAccount(list[0]);
      });
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{ provider, signer, account, chainId, connect, disconnect, isActive, connectionError }}
    >
      {children}
    </Web3Context.Provider>
  );
};
