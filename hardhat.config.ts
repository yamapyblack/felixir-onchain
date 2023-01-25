import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkAccountsConfig } from "hardhat/types";

import "solc";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";

const accounts = (): HttpNetworkAccountsConfig => {
  if (!process.env.PRIV_KEY) {
    return "remote";
  }
  return [process.env.PRIV_KEY!];
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    shiden: {
      url: "https://shiden.api.onfinality.io/public",
      chainId: 336,
      accounts: accounts(),
    },
    astar: {
      // url: `https://astar-mainnet.g.alchemy.com/v2/${process.env.ETHERSCAN_API_KEY}`,
      // url: "https://astar.public.blastapi.io",
      // url: "https://rpc.astar.network:8545",
      // url: `https://astar-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      url: "https://evm.astar.network",
      chainId: 592,
      accounts: accounts(),
    },
  },
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
  gasReporter: {
    currency: "MATIC",
    gasPrice: 30,
    enabled: false,
  },
};

export default config;
