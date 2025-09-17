import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function WalletConnect() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    checkWalletConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      try {
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address || accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setAccount('');
      setIsConnected(false);
    }
  };

  // ✅ Switch to Sepolia network, add if missing
  const switchToSepolia = async () => {
    const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      return true; // switched successfully
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia Test Network",
              rpcUrls: ["https://rpc.sepolia.org"],
              nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            }],
          });
          return true; // added & switched
        } catch (addError) {
          console.error("Failed to add Sepolia:", addError);
          return false;
        }
      } else {
        console.error("Failed to switch network:", error);
        return false;
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this app");
        return;
      }

      const switched = await switchToSepolia();
      if (!switched) {
        alert("Please switch to Sepolia Testnet in MetaMask");
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
      setIsConnected(true);

    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="wallet-connect">
      {!isConnected ? (
        <button onClick={connectWallet} className="connect-button">
          Connect MetaMask
        </button>
      ) : (
        <div className="wallet-info">
          <span>Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
        </div>
      )}

      <style jsx>{`
        .wallet-connect {
          padding: 1rem;
        }
        .connect-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .connect-button:hover {
          background: #2980b9;
        }
        .wallet-info {
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 4px;
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
}

export default WalletConnect;