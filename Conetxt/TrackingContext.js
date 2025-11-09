import React, { createContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import TrackingABI from "./Tracking.json";

export const TrackingContext = createContext();

const CONTRACT_ADDRESS = "0xd349ea4Cfc51a9F6f6accC49253eD445e6D80987";
const READ_RPC = "https://eth-sepolia.g.alchemy.com/v2/pPfNOZ5-BPehquKNAga5X";

// Simple Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-500",
    warning: "bg-orange-500",
    error: "bg-red-500"
  };

  return (
    <div className={`fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md animate-slide-in`}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200 font-bold text-xl leading-none">
          ×
        </button>
      </div>
    </div>
  );
};

export const TrackingProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const getContract = useCallback(
    (pOrS) => new ethers.Contract(CONTRACT_ADDRESS, TrackingABI.abi, pOrS),
    []
  );

  useEffect(() => {
    try {
      const readProvider = new ethers.providers.JsonRpcProvider(READ_RPC);
      setProvider(readProvider);
    } catch (err) {
      console.error("Failed to create read provider:", err);
    }
  }, []);
  
  const disconnectWallet = () => {
    try {
      setCurrentAccount(null);
      setSigner(null);
      setProvider(null);
      localStorage.removeItem("connectedWallet");
      showToast("Wallet disconnected", "warning");
      console.log("🔌 Wallet disconnected");
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
      showToast("Error disconnecting wallet", "error");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast("Please install MetaMask!", "error");
      return;
    }
 
    try {
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      const sepoliaChainId = "0xaa36a7";
      if (currentChainId !== sepoliaChainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: sepoliaChainId }],
          });
        } catch (switchErr) {
          showToast("Please switch to Sepolia Testnet", "warning");
          return;
        }
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setCurrentAccount(account);

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      setSigner(web3Provider.getSigner());
      showToast("Wallet connected successfully!", "success");
    } catch (err) {
      console.error("connectWallet error:", err);
      showToast("Failed to connect wallet", "error");
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts) => {
      setCurrentAccount(accounts[0] || null);
      if (!accounts || accounts.length === 0) {
        setSigner(null);
      } else {
        try {
          const web3Provider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          setSigner(web3Provider.getSigner());
        } catch (e) {
          console.warn("Could not set signer after account change", e);
        }
      }
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const getAllShipments = useCallback(async () => {
    try {
      if (!provider) {
        console.warn("Provider not ready yet (getAllShipments).");
        return;
      }
      const contract = getContract(provider);
      const data = await contract.getAllShipments();
      if (!data || data.length === 0) {
        setShipments([]);
        console.log("No shipments returned from contract.");
        return;
      }

      const formatted = data
        .map((s, idx) => {
          if (!s) return null;
          const scheduled = s.scheduledPickupTime
            ? s.scheduledPickupTime.toNumber()
            : 0;
          const actual = s.actualPickupTime ? s.actualPickupTime.toNumber() : 0;
          const delivery = s.deliveryTime ? s.deliveryTime.toNumber() : 0;
          const distance = s.distance ? s.distance.toNumber() : 0;
          const priceWei = s.price ? s.price.toString() : "0";
          const price = (() => {
            try {
              return ethers.utils.formatEther(priceWei);
            } catch {
              return "0";
            }
          })();

          return {
            shipmentId: idx,
            sender: s.sender,
            receiver: s.receiver,
            courier: s.courier,
            scheduledPickupTime: scheduled,
            actualPickupTime: actual,
            deliveryTime: delivery,
            distance,
            price,
            priceWei,
            status: s.status !== undefined ? Number(s.status) : 0,
            isPaid: !!s.isPaid,
          };
        })
        .filter(Boolean);

      setShipments(formatted);
      console.log("Fetched shipments:", formatted);
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setShipments([]);
    }
  }, [provider, getContract]);

  useEffect(() => {
    if (!provider) return;
    getAllShipments();
  }, [provider, getAllShipments]);

  const createShipment = async (
    receiver,
    courier,
    pickupTime,
    distance,
    price
  ) => {
    if (!signer) {
      showToast("Connect wallet first", "warning");
      return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      showToast("Please enter valid price in ETH", "warning");
      return;
    }

    try {
      const contract = getContract(signer);
      const value = ethers.utils.parseEther(price.toString());
      const tx = await contract.createShipment(
        receiver,
        courier,
        pickupTime,
        distance,
        value,
        { value }
      );
      await tx.wait();
      showToast("Shipment created successfully!", "success");
      await getAllShipments();
    } catch (err) {
      console.error("Error creating shipment:", err);
      showToast("Transaction failed", "error");
    }
  };

  const startShipment = async (shipmentId) => {
    if (!signer) {
      showToast("Connect wallet first", "warning");
      return;
    }
    try {
      const contract = getContract(signer);
      const tx = await contract.startShipment(shipmentId, { gasLimit: 300000 });
      await tx.wait();
      showToast("Shipment started!", "success");
      await getAllShipments();
    } catch (err) {
      console.error("Error starting shipment:", err);
      showToast("Failed to start shipment", "error");
    }
  };

  const markDelivered = async (shipmentId) => {
    if (!signer) {
      showToast("Connect wallet first", "warning");
      return;
    }
    try {
      const contract = getContract(signer);
      const tx = await contract.markDelivered(shipmentId, { gasLimit: 300000 });
      await tx.wait();
      showToast("Marked delivered (waiting receiver confirmation)", "success");
      await getAllShipments();
    } catch (err) {
      console.error("Error marking delivered:", err);
      showToast("Failed to mark delivered", "error");
    }
  };

  const confirmDelivery = async (shipmentId) => {
    if (!signer) {
      showToast("Connect wallet first", "warning");
      return;
    }
    try {
      const contract = getContract(signer);
      const tx = await contract.confirmDelivery(shipmentId, {
        gasLimit: 300000,
      });
      await tx.wait();
      showToast("Delivery confirmed. Courier paid.", "success");
      await getAllShipments();
    } catch (err) {
      console.error("Error confirming delivery:", err);
      showToast("Failed to confirm delivery", "error");
    }
  };

  const getShipmentDetails = async (shipmentId) => {
    try {
      const activeProvider = signer || provider;
      if (!activeProvider) {
        showToast("No provider or signer available", "error");
        return null;
      }

      const contract = getContract(activeProvider);
      const s = await contract.getShipmentDetails(shipmentId);

      return {
        sender: s[0],
        receiver: s[1],
        courier: s[2],
        scheduledPickupTime: s[3].toNumber(),
        actualPickupTime: s[4].toNumber(),
        deliveryTime: s[5].toNumber(),
        distance: s[6].toNumber(),
        price: ethers.utils.formatEther(s[7]),
        status: Number(s[8]),
        isPaid: s[9],
      };
    } catch (err) {
      console.error("getShipmentDetails error:", err);
      throw err;
    }
  };

  const getSenderShipmentCount = async (address) => {
    try {
      if (!provider) return 0;
      const contract = getContract(provider);
      const cnt = await contract.getSenderShipmentCount(address);
      return Number(cnt);
    } catch (err) {
      console.error("getSenderShipmentCount error:", err);
      return 0;
    }
  };

  const getShipmentsBySender = async (address) => {
    try {
      if (!provider) return [];
      const contract = getContract(provider);
      const data = await contract.getShipmentsBySender(address);
      if (!data || data.length === 0) return [];

      const formatted = data.map((s, idx) => {
        const scheduled = s.scheduledPickupTime
          ? s.scheduledPickupTime.toNumber()
          : 0;
        const actual = s.actualPickupTime ? s.actualPickupTime.toNumber() : 0;
        const delivery = s.deliveryTime ? s.deliveryTime.toNumber() : 0;
        const distance = s.distance ? s.distance.toNumber() : 0;
        const priceWei = s.price ? s.price.toString() : "0";
        const price = (() => {
          try {
            return ethers.utils.formatEther(priceWei);
          } catch {
            return "0";
          }
        })();
        return {
          sender: s.sender,
          receiver: s.receiver,
          courier: s.courier,
          scheduledPickupTime: scheduled,
          actualPickupTime: actual,
          deliveryTime: delivery,
          distance,
          price,
          priceWei,
          status: s.status !== undefined ? Number(s.status) : 0,
          isPaid: !!s.isPaid,
        };
      });
      return formatted;
    } catch (err) {
      console.error("getShipmentsBySender error:", err);
      return [];
    }
  };

  return (
    <TrackingContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        currentAccount,
        createShipment,
        startShipment,
        markDelivered,
        confirmDelivery,
        getAllShipments,
        getShipmentDetails,
        getSenderShipmentCount,
        getShipmentsBySender,
        shipments,
        getContract,
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </TrackingContext.Provider>
  );
};