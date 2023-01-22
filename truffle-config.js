const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    dashboard: {
      port: 24012
    },
    goerli: {
      provider: () => {
        return  new HDWalletProvider({
          // mnemonic: {
          //   phrase: process.env.MNEMONIC
          // },
          privateKeys: [
            process.env.PRIVATE_KEY
          ],
          providerOrUrl: 'https://eth-goerli.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY_DEV,
        })
      },
      network_id: 5,
      // gas: 4465030,
      gasPrice: 10000000000,
    },
    mainnet: {
      provider: () => {
        return  new HDWalletProvider({
          privateKeys: [
            process.env.PRIVATE_KEY
          ],
          // mnemonic: {
          //   phrase: process.env.MNEMONIC
          // },
          providerOrUrl: 'https://eth-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY_LIVE,
        })
      },
      network_id: 1,        // Ethereum public network
      // gas: 4465030,
      gasPrice: 10000000000,
      // optional config values:
      // gas                  - use gas and gasPrice if creating type 0 transactions
      // gasPrice             - all gas values specified in wei
      // maxFeePerGas         - use maxFeePerGas and maxPriorityFeePerGas if creating type 2 transactions (https://eips.ethereum.org/EIPS/eip-1559)
      // maxPriorityFeePerGas -
      // from - default address to use for any transaction Truffle makes during migrations
      // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
      //          - function that returns a web3 provider instance (see below.)
      //          - if specified, host and port are ignored.
      // production: - set to true if you would like to force a dry run to be performed every time you migrate using this network (default: false)
      //             - during migrations Truffle performs a dry-run if you are deploying to a 'known network'
      // skipDryRun: - set to true if you don't want to test run the migration locally before the actual migration (default: false)
      // confirmations: - number of confirmations to wait between deployments (default: 0)
      // timeoutBlocks: - if a transaction is not mined, keep waiting for this number of blocks (default: 50)
      // deploymentPollingInterval: - duration between checks for completion of deployment transactions
      // networkCheckTimeout: - amount of time for Truffle to wait for a response from the node when testing the provider (in milliseconds)
      //                      - increase this number if you have a slow internet connection to avoid connection errors (default: 5000)
      // disableConfirmationListener: - set to true to disable web3's confirmation listener
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.17"
    }
  },
  db: {
    enabled: false
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
  },
};
