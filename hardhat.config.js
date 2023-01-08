/* eslint-disable indent */
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config()
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan")



module.exports = {
   solidity: "0.8.15",
   defaultNetwork: `${process.env.defaultNetwork}`,
   networks: {
      hardhat: {},
      matic_testnet: {
         url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.polyGonTestNetKey}`,
         accounts: [
            `${process.env.privateKey}`
         ],
         gasMultiplier: 0.1
      },
      matic_mainnet: {
         /* url: "https://polygon-rpc.com", */
         url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.polyGonMainNetKey}`,
         accounts: [
            `${process.env.privateKey}`
         ]
      },
   },
   etherscan: {
      apiKey: {
         matic_testnet: process.env.etherScanKey,
         matic_mainnet: process.env.etherScanKey
      },
      customChains: [
         {
            network: "matic_testnet",
            chainId: 80001,
            urls: {
               apiURL: "https://api-testnet.polygonscan.com/",
               browserURL: "https://mumbai.polygonscan.com/"
            }
         },
         {
            network: "matic_mainnet",
            chainId: 137,
            urls: {
               apiURL: "https://api.polygonscan.com/",
               browserURL: "https://polygonscan.com/"
            }
         }

      ]
   }
}