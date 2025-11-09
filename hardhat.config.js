require("@nomicfoundation/hardhat-toolbox");

const SEPOLIA_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/pPfNOZ5-BPehquKNAga5X"; 
const PRIVATE_KEY = "1889c56b22178f88d9c215b8236aa8f90b672020e1e932267bdb9e0f0dfe541c";  

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111,
    },
  },
};
