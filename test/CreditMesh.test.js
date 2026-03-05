const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreditMesh", function () {
  let token, deviceNFT, stakingPool, rewardDistributor, marketplace, paramManager;
  let owner, deviceOwner, verifier, buyer;

  beforeEach(async function () {
    [owner, deviceOwner, verifier, buyer] = await ethers.getSigners();

    const CreditMeshToken = await ethers.getContractFactory("CreditMeshToken");
    token = await CreditMeshToken.deploy();
    await token.deployed();

    const ParameterManager = await ethers.getContractFactory("ParameterManager");
    paramManager = await ParameterManager.deploy();
    await paramManager.deployed();

    const DeviceNFT = await ethers.getContractFactory("DeviceNFT");
    deviceNFT = await DeviceNFT.deploy();
    await deviceNFT.deployed();

    const StakingPool = await ethers.getContractFactory("StakingPool");
    stakingPool = await StakingPool.deploy(token.address, deviceNFT.address, paramManager.address);
    await stakingPool.deployed();

    await deviceNFT.grantRole(await deviceNFT.STAKING_ROLE(), stakingPool.address);
    await deviceNFT.grantRole(await deviceNFT.MINTER_ROLE(), owner.address);

    const RewardDistributor = await ethers.getContractFactory("RewardDistributor");
    rewardDistributor = await RewardDistributor.deploy(
      deviceNFT.address,
      stakingPool.address,
      paramManager.address,
      token.address
    );
    await rewardDistributor.deployed();

    const DataMarketplace = await ethers.getContractFactory("DataMarketplace");
    marketplace = await DataMarketplace.deploy(deviceNFT.address, token.address);
    await marketplace.deployed();
  });

  it("Should register a device and stake", async function () {
    await token.mint(deviceOwner.address, ethers.utils.parseEther("1000"));
    await token.connect(deviceOwner).approve(stakingPool.address, ethers.utils.parseEther("200"));

    // Register device via DeviceNFT (MINTER_ROLE is owner)
    const tx = await deviceNFT.connect(owner).registerDevice(
      deviceOwner.address,
      0, // Sensor
      "did:creditmesh:123",
      "ipfs://QmTest"
    );
    const receipt = await tx.wait();
    const event = receipt.events.find((e) => e.event === "DeviceRegistered");
    const tokenId = event.args.tokenId;

    await stakingPool.connect(deviceOwner).stakeForDevice(tokenId, ethers.utils.parseEther("100"));

    const stake = await stakingPool.getStake(deviceOwner.address);
    expect(stake.amount).to.equal(ethers.utils.parseEther("100"));
    expect(stake.deviceId).to.equal(tokenId);
  });

  it("Should return device info after registration", async function () {
    await deviceNFT.connect(owner).registerDevice(
      deviceOwner.address,
      1, // Gateway
      "did:creditmesh:456",
      "ipfs://QmGateway"
    );
    const devices = await deviceNFT.getDevicesByOwner(deviceOwner.address);
    expect(devices.length).to.equal(1);
    const info = await deviceNFT.getDeviceInfo(devices[0]);
    expect(info.owner).to.equal(deviceOwner.address);
    expect(info.deviceType).to.equal(1);
    expect(info.reputation).to.equal(50);
    expect(info.deviceDID).to.equal("did:creditmesh:456");
  });

  it("Should list and buy data on marketplace", async function () {
    await token.mint(deviceOwner.address, ethers.utils.parseEther("1000"));
    await token.mint(buyer.address, ethers.utils.parseEther("1000"));
    await deviceNFT.connect(owner).registerDevice(
      deviceOwner.address,
      0,
      "did:creditmesh:789",
      "ipfs://QmData"
    );
    const devices = await deviceNFT.getDevicesByOwner(deviceOwner.address);
    const deviceId = devices[0];

    await marketplace.connect(deviceOwner).listData(
      deviceId,
      ethers.utils.parseEther("1"),
      100,
      86400
    );
    await token.connect(buyer).approve(marketplace.address, ethers.utils.parseEther("10"));
    await marketplace.connect(buyer).buyData(1, 10);

    const listing = await marketplace.getListing(1);
    expect(listing.available).to.equal(90);
  });
});
