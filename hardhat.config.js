require("@nomicfoundation/hardhat-toolbox");

const NEXT_PUBLIC_POLYGON_AMOY_RPC = "https://rpc-amoy.polygon.technology/";
const NEXT_PUBLIC_PRIVATE_KEY = "1889c56b22178f88d9c215b8236aa8f90b672020e1e932267bdb9e0f0dfe541c";  // Add your private key here

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "polygon_amoy",  
  networks: {
    hardhat: {
      chainId: 31337,
    },
    polygon_amoy: {
      url: NEXT_PUBLIC_POLYGON_AMOY_RPC,
      accounts: [`0x${NEXT_PUBLIC_PRIVATE_KEY}`],
      chainId: 80002,
    },
  },
};
