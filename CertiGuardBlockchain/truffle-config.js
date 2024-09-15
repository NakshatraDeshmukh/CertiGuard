// require('dotenv').config();
// const { MNEMONIC, PROJECT_ID } = process.env;

// const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    // Development network configuration for Ganache
    development: {
      host: "127.0.0.1",     // Localhost for Ganache
      port: 7545,            // Standard Ethereum port for Ganache
      network_id: "*",       // Match any network id
    },

    // You can add more network configurations if needed (e.g., Goerli, Mainnet, etc.)
    // goerli: {
    //   provider: () => new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${PROJECT_ID}`),
    //   network_id: 5,       // Goerli's id
    //   confirmations: 2,    // # of confirmations to wait between deployments
    //   timeoutBlocks: 200,  // # of blocks before deployment times out
    //   skipDryRun: true     // Skip dry run before migrations
    // },
  },

  mocha: {
    timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.21",      // Specify exact version
      settings: {
        optimizer: {
          enabled: true,      // Enable optimizer
          runs: 200           // Optimize for how many times you intend to run the code
        },
        evmVersion: "istanbul" // EVM version, you can modify this if necessary
      }
    }
  },

  // Truffle DB settings, disabled by default
  db: {
    enabled: false
  }
};
