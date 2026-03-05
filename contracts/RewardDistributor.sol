// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DeviceNFT.sol";
import "./StakingPool.sol";
import "./ParameterManager.sol";

/**
 * @title RewardDistributor
 * @dev Distributes epoch rewards to devices and verifiers.
 * Rewards are based on contribution count, device type, and reputation.
 */
contract RewardDistributor is AccessControl, ReentrancyGuard {
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    DeviceNFT public deviceNFT;
    StakingPool public stakingPool;
    ParameterManager public paramManager;
    IERC20 public cmesh;

    uint256 public currentEpoch;
    uint256 public epochStart;

    // Reward pools per epoch
    uint256 public deviceRewardPool;
    uint256 public verifierRewardPool;

    // Track which devices/verifiers have been paid this epoch
    mapping(uint256 => mapping(uint256 => bool)) public epochDevicePaid; // epoch => deviceId => paid
    mapping(uint256 => mapping(address => bool)) public epochVerifierPaid;

    // Contribution count per device per epoch (updated by verifiers off-chain, then recorded on-chain)
    mapping(uint256 => mapping(uint256 => uint256)) public epochDeviceContributions; // epoch => deviceId => count

    event EpochStarted(uint256 indexed epoch, uint256 start);
    event DeviceRewardPaid(uint256 indexed epoch, uint256 indexed deviceId, uint256 amount);
    event VerifierRewardPaid(uint256 indexed epoch, address indexed verifier, uint256 amount);
    event ContributionRecorded(uint256 indexed epoch, uint256 indexed deviceId, uint256 count);

    constructor(address _deviceNFT, address _stakingPool, address _paramManager, address _cmesh) {
        deviceNFT = DeviceNFT(_deviceNFT);
        stakingPool = StakingPool(_stakingPool);
        paramManager = ParameterManager(_paramManager);
        cmesh = IERC20(_cmesh);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DISTRIBUTOR_ROLE, msg.sender);
        currentEpoch = 1;
        epochStart = block.timestamp;
    }

    /**
     * @dev Start a new epoch (called by VerifierSelection or manually)
     */
    function startNewEpoch() external {
        require(block.timestamp >= epochStart + paramManager.epochDuration(), "Epoch not finished");
        currentEpoch++;
        epochStart = block.timestamp;
        // Fund pools from treasury (in production, mint or transfer)
        // For simplicity, assume contract has tokens from treasury.
        emit EpochStarted(currentEpoch, epochStart);
    }

    /**
     * @dev Record contributions for a device in the current epoch (called by verifiers)
     * @param deviceId Device token ID
     * @param count Number of contributions
     */
    function recordContributions(uint256 deviceId, uint256 count) external onlyRole(DISTRIBUTOR_ROLE) {
        epochDeviceContributions[currentEpoch][deviceId] += count;
        emit ContributionRecorded(currentEpoch, deviceId, count);
    }

    /**
     * @dev Distribute reward to a device for current epoch
     * @param deviceId Device token ID
     */
    function distributeDeviceReward(uint256 deviceId) external nonReentrant {
        require(!epochDevicePaid[currentEpoch][deviceId], "Already paid this epoch");
        require(deviceNFT.isActive(deviceId), "Device not active");

        uint256 contributionCount = epochDeviceContributions[currentEpoch][deviceId];
        require(contributionCount > 0, "No contributions this epoch");

        uint256 reward = calculateDeviceReward(deviceId, contributionCount);
        require(reward <= deviceRewardPool, "Insufficient pool");

        deviceRewardPool -= reward;
        epochDevicePaid[currentEpoch][deviceId] = true;

        deviceNFT.recordContribution(deviceId, reward);
        address owner = deviceNFT.ownerOf(deviceId);
        cmesh.transfer(owner, reward);

        emit DeviceRewardPaid(currentEpoch, deviceId, reward);
    }

    /**
     * @dev Calculate device reward based on type, reputation, and contribution count
     */
    function calculateDeviceReward(uint256 deviceId, uint256 count) public view returns (uint256) {
        DeviceNFT.DeviceType dtype = deviceNFT.getDeviceType(deviceId);
        uint256 baseReward;
        if (dtype == DeviceNFT.DeviceType.Satellite) {
            baseReward = paramManager.satelliteBaseReward();
        } else if (dtype == DeviceNFT.DeviceType.Gateway) {
            baseReward = paramManager.gatewayBaseReward();
        } else {
            baseReward = paramManager.sensorBaseReward();
        }
        uint256 rep = deviceNFT.getDeviceInfo(deviceId).reputation;
        // Reputation multiplier: 50% to 100%
        uint256 multiplier = 50 + (rep / 2);
        return (baseReward * count * multiplier) / 100;
    }

    /**
     * @dev Distribute reward to a verifier for current epoch
     * @param verifier Verifier address
     */
    function distributeVerifierReward(address verifier) external nonReentrant {
        require(!epochVerifierPaid[currentEpoch][verifier], "Already paid");
        require(stakingPool.isVerifier(verifier), "Not active verifier");

        uint256 reward = calculateVerifierReward(verifier);
        require(reward <= verifierRewardPool, "Insufficient pool");

        verifierRewardPool -= reward;
        epochVerifierPaid[currentEpoch][verifier] = true;
        cmesh.transfer(verifier, reward);

        emit VerifierRewardPaid(currentEpoch, verifier, reward);
    }

    /**
     * @dev Calculate verifier reward (simplified: fixed per epoch if selected)
     */
    function calculateVerifierReward(address verifier) public view returns (uint256) {
        // Could be based on number of verifications performed, stake, etc.
        // Simplified: each selected verifier gets a share of the pool
        uint256 count = stakingPool.getVerifierCount();
        return count > 0 ? verifierRewardPool / count : 0;
    }

    /**
     * @dev Fund reward pools (admin only)
     */
    function fundPools(uint256 deviceAmount, uint256 verifierAmount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        deviceRewardPool += deviceAmount;
        verifierRewardPool += verifierAmount;
    }
}
