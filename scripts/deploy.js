const hre = require("hardhat");

async function main() {
  console.log("Deploying CreditMesh contracts...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 1. Deploy CreditMeshToken
  const CreditMeshToken = await hre.ethers.getContractFactory("CreditMeshToken");
  const token = await CreditMeshToken.deploy();
  await token.deployed();
  console.log("CMESH token deployed to:", token.address);

  // 2. Deploy ParameterManager
  const ParameterManager = await hre.ethers.getContractFactory("ParameterManager");
  const paramManager = await ParameterManager.deploy();
  await paramManager.deployed();
  console.log("ParameterManager deployed to:", paramManager.address);

  // 3. Deploy DeviceNFT
  const DeviceNFT = await hre.ethers.getContractFactory("DeviceNFT");
  const deviceNFT = await DeviceNFT.deploy();
  await deviceNFT.deployed();
  console.log("DeviceNFT deployed to:", deviceNFT.address);

  // 4. Deploy StakingPool
  const StakingPool = await hre.ethers.getContractFactory("StakingPool");
  const stakingPool = await StakingPool.deploy(token.address, deviceNFT.address, paramManager.address);
  await stakingPool.deployed();
  console.log("StakingPool deployed to:", stakingPool.address);

  // Grant roles on DeviceNFT: STAKING_ROLE and VERIFIER_ROLE (for recordContribution) to contracts; MINTER to deployer for device registration
  await deviceNFT.grantRole(await deviceNFT.STAKING_ROLE(), stakingPool.address);
  await deviceNFT.grantRole(await deviceNFT.MINTER_ROLE(), deployer.address);
  // VERIFIER_ROLE granted to RewardDistributor below after it's deployed

  // 5. Deploy VerifierSelection
  const VerifierSelection = await hre.ethers.getContractFactory("VerifierSelection");
  const verifierSelection = await VerifierSelection.deploy(stakingPool.address);
  await verifierSelection.deployed();
  console.log("VerifierSelection deployed to:", verifierSelection.address);

  // 6. Deploy RewardDistributor
  const RewardDistributor = await hre.ethers.getContractFactory("RewardDistributor");
  const rewardDistributor = await RewardDistributor.deploy(
    deviceNFT.address,
    stakingPool.address,
    paramManager.address,
    token.address
  );
  await rewardDistributor.deployed();
  console.log("RewardDistributor deployed to:", rewardDistributor.address);

  // RewardDistributor calls deviceNFT.recordContribution — grant VERIFIER_ROLE
  await deviceNFT.grantRole(await deviceNFT.VERIFIER_ROLE(), rewardDistributor.address);
  await rewardDistributor.grantRole(await rewardDistributor.DISTRIBUTOR_ROLE(), verifierSelection.address);

  // 7. Deploy DataMarketplace
  const DataMarketplace = await hre.ethers.getContractFactory("DataMarketplace");
  const marketplace = await DataMarketplace.deploy(deviceNFT.address, token.address);
  await marketplace.deployed();
  console.log("DataMarketplace deployed to:", marketplace.address);

  // 8. Deploy USCVerifier
  const USCVerifier = await hre.ethers.getContractFactory("USCVerifier");
  const uscVerifier = await USCVerifier.deploy();
  await uscVerifier.deployed();
  console.log("USCVerifier deployed to:", uscVerifier.address);

  // 9. Deploy Timelock & Governor (DAO)
  const minDelay = 2 * 24 * 60 * 60; // 2 days
  const proposers = [];
  const executors = [];
  const admin = deployer.address;

  const CreditMeshTimelock = await hre.ethers.getContractFactory("CreditMeshTimelock");
  const timelock = await CreditMeshTimelock.deploy(minDelay, proposers, executors, admin);
  await timelock.deployed();
  console.log("Timelock deployed to:", timelock.address);

  const CreditMeshGovernor = await hre.ethers.getContractFactory("CreditMeshGovernor");
  const governor = await CreditMeshGovernor.deploy(
    token.address,
    timelock.address,
    1, // voting delay (blocks)
    7200, // voting period (blocks) ~1 day
    hre.ethers.utils.parseEther("10000") // proposal threshold
  );
  await governor.deployed();
  console.log("Governor deployed to:", governor.address);

  // Setup timelock roles
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
  const CANCELLER_ROLE = await timelock.CANCELLER_ROLE();
  const TIMELOCK_ADMIN_ROLE = await timelock.TIMELOCK_ADMIN_ROLE();

  await timelock.grantRole(PROPOSER_ROLE, governor.address);
  await timelock.grantRole(CANCELLER_ROLE, governor.address);
  await timelock.grantRole(EXECUTOR_ROLE, hre.ethers.constants.AddressZero); // anyone can execute
  await timelock.revokeRole(TIMELOCK_ADMIN_ROLE, deployer.address);
  await timelock.grantRole(TIMELOCK_ADMIN_ROLE, timelock.address); // self-admin

  // Transfer ownership of token to timelock (so DAO can mint)
  await token.transferOwnership(timelock.address);

  // Grant PARAM_SETTER_ROLE to timelock
  await paramManager.grantSetterRole(timelock.address);

  console.log("\n=== Deployment Summary ===");
  console.log("CMESH Token:", token.address);
  console.log("ParameterManager:", paramManager.address);
  console.log("DeviceNFT:", deviceNFT.address);
  console.log("StakingPool:", stakingPool.address);
  console.log("VerifierSelection:", verifierSelection.address);
  console.log("RewardDistributor:", rewardDistributor.address);
  console.log("DataMarketplace:", marketplace.address);
  console.log("USCVerifier:", uscVerifier.address);
  console.log("Timelock:", timelock.address);
  console.log("Governor:", governor.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
