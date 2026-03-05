try {
  require("@nomicfoundation/hardhat-toolbox");
} catch (_) {
  // Toolbox optional; compile works with just hardhat + @openzeppelin/contracts
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    creditcoinTestnet: {
      url: process.env.CREDITCOIN_RPC || "https://rpc.testnet.creditcoin.network",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
