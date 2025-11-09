# 🚚 Decentralized Shipment Tracking dApp

A blockchain-based **shipment tracking system** that ensures **transparency, trust, and security** between senders, couriers, and receivers — built on **Ethereum (Sepolia Testnet)** using **Solidity**, **React**, and **Ethers.js**.

---

## 🧩 Overview

This dApp allows users to:

* 📦 **Create new shipments** by entering receiver, courier, distance, time, and price in ETH.
* 🚚 **Couriers** can start and mark shipments as delivered.
* ✅ **Receivers** confirm delivery — automatically releasing payment to the courier.
* 🔍 **View shipment details** by ID and track status in real time.

Everything is verified on-chain — no central authority, no middlemen.

---

## ⚙️ Tech Stack

| Layer                  | Technology               |
| ---------------------- | ------------------------ |
| **Smart Contract**     | Solidity, Hardhat        |
| **Frontend**           | React.js, Bootstrap      |
| **Blockchain Network** | Ethereum Sepolia Testnet |
| **Wallet**             | MetaMask                 |
| **Library**            | Ethers.js                |
| **Node Provider**      | Alchemy RPC              |

---

## 💡 Features

### 🔗 Blockchain Logic

* Shipment creation with payment in **ETH** (held in smart contract).
* **Courier workflow:** Start → Deliver → Receiver Confirms → Auto Payment.
* Each shipment stored immutably on blockchain.
* **Access control:** only sender can view full shipment details.

### 💻 Frontend Interface

* **Create Shipment:** Input details and pay ETH.
* **All Shipments:** View global list with real-time updates.
* **Get Shipment:** Fetch details by shipment ID (restricted to sender).
* **Wallet Connection:** Connect or disconnect MetaMask wallet.
* **Navigation Bar:** Smooth-scroll navigation across components.

### 🪶 UI Enhancements

* Glassy dark theme navbar.
* Glow animation for title and buttons.
* Smooth scroll behavior between components.
* Responsive design for all screen sizes.

---

## 🧠 Smart Contract Overview

```solidity
// Key functions
function createShipment(
  address receiver,
  address courier,
  uint256 pickupTime,
  uint256 distance,
  uint256 price
) external payable;

function startShipment(uint256 shipmentId) external;
function markDelivered(uint256 shipmentId) external;
function confirmDelivery(uint256 shipmentId) external;
function getAllShipments() public view returns (Shipment[] memory);
function getShipmentDetails(uint256 shipmentId) public view returns (Shipment memory);
```

**Access Control:**

* `createShipment` → Only sender creates.
* `startShipment`, `markDelivered` → Only courier.
* `confirmDelivery` → Only receiver.
* `getShipmentDetails` → Only sender.

---

## 🖼️ Frontend Components

| Component              | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| **Navbar.js**          | Fixed glass navbar with Connect/Disconnect wallet and scroll links.        |
| **CreateShipment.js**  | Form to create new shipments with ETH payment.                             |
| **ShipmentList.js**    | Displays all shipments with status and actions for courier/receiver.       |
| **ShipmentDetails.js** | Fetches and displays specific shipment details.                            |
| **TrackingContext.js** | Core Web3 logic (connect wallet, interact with contract, read/write data). |

---

## 🚀 How to Run Locally

### 1️⃣ Clone this repository

```bash
git clone https://github.com/<your-username>/shipment-tracker-dapp.git
cd shipment-tracker-dapp
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup Environment

* Update your **Alchemy Sepolia RPC URL** in `TrackingContext.js`
* Replace `CONTRACT_ADDRESS` with your deployed contract address.

### 4️⃣ Start development server

```bash
npm run dev
```

### 5️⃣ Open in browser

```
http://localhost:3000
```

Connect your **MetaMask** (on Sepolia Testnet) and start using the app.

---

## 🌐 Deployed Contract

**Network:** Ethereum Sepolia
**Contract Address:** `0xd349ea4Cfc51a9F6f6accC49253eD445e6D80987`

---

## 🔒 Access Control Summary

| Role         | Permissions                                      |
| ------------ | ------------------------------------------------ |
| **Sender**   | Create shipment, view shipment, confirm delivery |
| **Courier**  | Start shipment, mark delivered                   |
| **Receiver** | Confirm delivery (triggers payment)              |

---
