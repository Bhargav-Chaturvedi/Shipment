// src/Context/TrackingContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import TrackingABI from "./Tracking.json";

export const TrackingContext = createContext();

const CONTRACT_ADDRESS = "0xd349ea4Cfc51a9F6f6accC49253eD445e6D80987";

// Read RPC (Sepolia). Replace with your own key if needed.
const READ_RPC = "https://eth-sepolia.g.alchemy.com/v2/pPfNOZ5-BPehquKNAga5X";

export const TrackingProvider = ({ children }) => {
  const [provider, setProvider] = useState(null); // read provider (JsonRpcProvider or Web3Provider)
  const [signer, setSigner] = useState(null); // signer for writes
  const [currentAccount, setCurrentAccount] = useState(null);
  const [shipments, setShipments] = useState([]);

  // helper: create contract instance (provider or signer)
  const getContract = useCallback(
    (pOrS) => new ethers.Contract(CONTRACT_ADDRESS, TrackingABI.abi, pOrS),
    []
  );

  // initialize read-only provider (Sepolia)
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
      console.log("🔌 Wallet disconnected");
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  // connect wallet and ensure Sepolia network
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
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
          alert("Please switch your MetaMask network to Sepolia Testnet.");
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
    } catch (err) {
      console.error("connectWallet error:", err);
      alert("Failed to connect wallet.");
    }
  };

  // detect account changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts) => {
      setCurrentAccount(accounts[0] || null);
      // if disconnected, clear signer
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

  // fetch all shipments (global list) and format for UI
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

      // data is an array of structs: [ sender, receiver, courier, scheduledPickupTime, actualPickupTime, deliveryTime, distance, price, status, isPaid ]
      const formatted = data
        .map((s, idx) => {
          if (!s) return null;
          // some fields might be missing or zero; guard them
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
            price, // string in ETH
            priceWei, // raw wei string (if UI needs it)
            status: s.status !== undefined ? Number(s.status) : 0,
            isPaid: !!s.isPaid,
          };
        })
        .filter(Boolean);

      setShipments(formatted);
      console.log("Fetched shipments:", formatted);
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setShipments([]); // avoid stale data
    }
  }, [provider, getContract]);

  // call getAllShipments automatically when provider ready (read provider)
  useEffect(() => {
    if (!provider) return;
    getAllShipments();
  }, [provider, getAllShipments]);

  // createShipment: sender provides ETH (price in ETH string)
  const createShipment = async (
    receiver,
    courier,
    pickupTime,
    distance,
    price
  ) => {
    if (!signer) return alert("Connect wallet first");
    if (!price || isNaN(price) || Number(price) <= 0) {
      alert("Please enter valid price in ETH");
      return;
    }

    try {
      const contract = getContract(signer);
      const value = ethers.utils.parseEther(price.toString()); // ETH -> wei
      const tx = await contract.createShipment(
        receiver,
        courier,
        pickupTime,
        distance,
        value,
        {
          value,
        }
      );
      await tx.wait();
      alert("Shipment created successfully!");
      // refresh read list
      await getAllShipments();
    } catch (err) {
      console.error("Error creating shipment:", err);
      alert("Transaction failed. See console for details.");
    }
  };

  // startShipment (courier)
  const startShipment = async (shipmentId) => {
    if (!signer) return alert("Connect wallet first");
    try {
      const contract = getContract(signer);
      const tx = await contract.startShipment(shipmentId, { gasLimit: 300000 });
      await tx.wait();
      alert("Shipment started!");
      await getAllShipments();
    } catch (err) {
      console.error("Error starting shipment:", err);
      alert("Failed to start shipment. Check console.");
    }
  };

  // markDelivered (courier)
  const markDelivered = async (shipmentId) => {
    if (!signer) return alert("Connect wallet first");
    try {
      const contract = getContract(signer);
      const tx = await contract.markDelivered(shipmentId, { gasLimit: 300000 });
      await tx.wait();
      alert("Marked delivered (waiting receiver confirmation).");
      await getAllShipments();
    } catch (err) {
      console.error("Error marking delivered:", err);
      alert("Failed to mark delivered. Check console.");
    }
  };

  // confirmDelivery (receiver)
  const confirmDelivery = async (shipmentId) => {
    if (!signer) return alert("Connect wallet first");
    try {
      const contract = getContract(signer);
      const tx = await contract.confirmDelivery(shipmentId, {
        gasLimit: 300000,
      });
      await tx.wait();
      alert("Delivery confirmed. Courier paid.");
      await getAllShipments();
    } catch (err) {
      console.error("Error confirming delivery:", err);
      alert("Failed to confirm delivery. Check console.");
    }
  };

  // getShipmentDetails (restricted by contract to sender; handle errors)
  const getShipmentDetails = async (shipmentId) => {
    try {
      // Use signer if available (so msg.sender = your wallet)
      const activeProvider = signer || provider;
      if (!activeProvider) {
        alert("No provider or signer available.");
        return null;
      }

      const contract = getContract(activeProvider);
      const s = await contract.getShipmentDetails(shipmentId);

      // Format for readability
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

  // getSenderShipmentCount (cheap for frontend; contract may iterate)
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

  // getShipmentsBySender (returns array of shipments created by address)
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
          // note: this index is relative to the returned array, not global id
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
    </TrackingContext.Provider>
  );
};
