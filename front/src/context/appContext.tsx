import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

interface AppContextProps {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  connected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const AppContext = createContext<AppContextProps>({
  provider: null,
  signer: null,
  address: null,
  connected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethProvider);
        const signer = await ethProvider.getSigner();
        setSigner(signer);
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
        setConnected(true);
      } catch (error) {
        console.error("Error conectando la wallet:", error);
      }
    } else {
      alert("Por favor, instala MetaMask");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setConnected(false);
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        provider,
        signer,
        address,
        connected,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
