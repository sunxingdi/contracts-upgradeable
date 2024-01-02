import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import "@nomiclabs/hardhat-ethers";
// import "@nomiclabs/hardhat-etherscan";
// import "@nomiclabs/hardhat-waffle";
// import "@typechain/hardhat";
// import "hardhat-gas-reporter";
// import "solidity-coverage";
import '@openzeppelin/hardhat-upgrades';
// import "@nomiclabs/hardhat-etherscan";
import "./tasks/accounts";
// 加载.env中的环境变量
dotenv.config();
// 获取.env中的环境变量
export const { SEPOLIA_RPC_URL } = process.env;
const { PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      // evmVersion: "paris",
      evmVersion: "istanbul",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [`${PRIVATE_KEY}`] : [],
      chainId: 11155111, // Sepolia Chain ID 
    },
    // 你可以在这里添加更多的网络配置
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },     
  // 其他配置...
};

export default config;
