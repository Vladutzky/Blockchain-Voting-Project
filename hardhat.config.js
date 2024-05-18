const { defaultNetwork } = require("../proiectblockchain/hardhat.config");

require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "running",
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
  running: {
    url: "http://localhost:8545",
    chainId: 1337,
    gas: 2100000,
    gasPrice: 8000000000,
  },
};  
