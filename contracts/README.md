# CreditMesh Smart Contracts

Solidity 0.8.19 contracts for the CreditMesh DePIN platform on Creditcoin.

## Contracts

| Contract | Description |
|----------|-------------|
| **ParameterManager** | Protocol parameters (staking, rewards, epochs); updatable by DAO. |
| **DeviceNFT** | ERC721 for IoT devices; reputation, stake, earnings. |
| **CreditMeshToken** | ERC20 CMESH with ERC20Votes and ERC20Permit. |
| **StakingPool** | Device and verifier staking; slashing. |
| **VerifierSelection** | Epoch-based verifier selection. |
| **RewardDistributor** | Epoch rewards for devices and verifiers. |
| **DataMarketplace** | List and buy verified data streams. |
| **USCVerifier** | Creditcoin native verifier precompile (0x0FD2) integration. |
| **CreditMeshTimelock** | DAO timelock. |
| **CreditMeshGovernor** | Governor with CMESH voting. |

## Setup

```bash
pnpm install   # or npm install
```

## Commands

```bash
pnpm run compile          # Compile contracts
pnpm run deploy            # Deploy to Hardhat network
pnpm run deploy:testnet    # Deploy to Creditcoin testnet
pnpm run test:contracts    # Run Hardhat tests
```

## Deploy (testnet)

Set in `.env`:

- `PRIVATE_KEY` – deployer wallet private key
- `CREDITCOIN_RPC` – optional; defaults to `https://rpc.testnet.creditcoin.network`

Then:

```bash
pnpm run deploy:testnet
```

Save the printed addresses and set the corresponding `VITE_*` env vars for the client (see `client/src/services/contractAddresses.ts`).
