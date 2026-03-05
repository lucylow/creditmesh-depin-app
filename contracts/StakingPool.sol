// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DeviceNFT.sol";
import "./ParameterManager.sol";

/**
 * @title StakingPool
 * @dev Manages CMESH stakes for devices and verifiers.
 * Implements slashing for malicious behavior.
 */
contract StakingPool is AccessControl, ReentrancyGuard {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant PARAM_SETTER_ROLE = keccak256("PARAM_SETTER_ROLE");

    IERC20 public cmesh;          // CreditMesh token
    DeviceNFT public deviceNFT;
    ParameterManager public paramManager;

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lockUntil;
        uint256 deviceId;          // For device stakes only (0 if verifier)
        bool slashed;
    }

    mapping(address => StakeInfo) public stakes;
    mapping(uint256 => address) public deviceStaker; // deviceId -> staker address
    address[] public verifierList;                     // List of active verifiers

    event Staked(address indexed staker, uint256 amount, uint256 deviceId);
    event Unstaked(address indexed staker, uint256 amount);
    event Slashed(address indexed staker, uint256 amount, string reason);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    constructor(address _cmesh, address _deviceNFT, address _paramManager) {
        cmesh = IERC20(_cmesh);
        deviceNFT = DeviceNFT(_deviceNFT);
        paramManager = ParameterManager(_paramManager);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Stake tokens for a device
     * @param deviceId Device token ID
     * @param amount Amount of CMESH to stake
     */
    function stakeForDevice(uint256 deviceId, uint256 amount) external nonReentrant {
        require(deviceNFT.ownerOf(deviceId) == msg.sender, "Not device owner");
        uint256 minStake = paramManager.minStakeAmount();
        require(amount >= minStake, "Below minimum stake");
        require(stakes[msg.sender].amount == 0, "Already staked");

        cmesh.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender] = StakeInfo({
            amount: amount,
            startTime: block.timestamp,
            lockUntil: block.timestamp + paramManager.stakeLockPeriod(),
            deviceId: deviceId,
            slashed: false
        });
        deviceStaker[deviceId] = msg.sender;
        deviceNFT.updateStake(deviceId, amount);
        emit Staked(msg.sender, amount, deviceId);
    }

    /**
     * @dev Stake tokens as a verifier
     * @param amount Amount of CMESH to stake
     */
    function stakeAsVerifier(uint256 amount) external nonReentrant {
        uint256 minVerifierStake = paramManager.minVerifierStake();
        require(amount >= minVerifierStake, "Below minimum verifier stake");
        require(stakes[msg.sender].amount == 0, "Already staked");

        cmesh.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender] = StakeInfo({
            amount: amount,
            startTime: block.timestamp,
            lockUntil: block.timestamp + paramManager.stakeLockPeriod(),
            deviceId: 0,
            slashed: false
        });
        verifierList.push(msg.sender);
        emit Staked(msg.sender, amount, 0);
        emit VerifierAdded(msg.sender);
    }

    /**
     * @dev Unstake tokens after lock period
     */
    function unstake() external nonReentrant {
        StakeInfo storage stake = stakes[msg.sender];
        require(stake.amount > 0, "No stake");
        require(block.timestamp >= stake.lockUntil, "Still locked");
        require(!stake.slashed, "Stake was slashed");

        uint256 amount = stake.amount;
        if (stake.deviceId != 0) {
            delete deviceStaker[stake.deviceId];
            deviceNFT.updateStake(stake.deviceId, 0);
        } else {
            // Remove from verifier list
            for (uint256 i = 0; i < verifierList.length; i++) {
                if (verifierList[i] == msg.sender) {
                    verifierList[i] = verifierList[verifierList.length - 1];
                    verifierList.pop();
                    break;
                }
            }
            emit VerifierRemoved(msg.sender);
        }
        delete stakes[msg.sender];
        cmesh.transfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    /**
     * @dev Slash a stake for malicious behavior (called by verifiers)
     * @param staker Address to slash
     * @param reason Reason for slashing
     */
    function slash(address staker, string calldata reason) external onlyRole(VERIFIER_ROLE) nonReentrant {
        StakeInfo storage stake = stakes[staker];
        require(stake.amount > 0, "No stake");
        require(!stake.slashed, "Already slashed");

        uint256 slashAmount = (stake.amount * paramManager.slashPercentage()) / 100;
        uint256 remaining = stake.amount - slashAmount;

        // Burn slashed tokens (send to dead address)
        cmesh.transfer(address(0xdead), slashAmount);

        stake.amount = remaining;
        stake.slashed = true;

        if (stake.deviceId != 0) {
            deviceNFT.updateStake(stake.deviceId, remaining);
        } else {
            // Remove from verifier list
            for (uint256 i = 0; i < verifierList.length; i++) {
                if (verifierList[i] == staker) {
                    verifierList[i] = verifierList[verifierList.length - 1];
                    verifierList.pop();
                    break;
                }
            }
            emit VerifierRemoved(staker);
        }
        emit Slashed(staker, slashAmount, reason);
    }

    /**
     * @dev Get stake info for an address
     */
    function getStake(address staker) external view returns (StakeInfo memory) {
        return stakes[staker];
    }

    /**
     * @dev Check if an address is a verifier (active and staked)
     */
    function isVerifier(address account) external view returns (bool) {
        StakeInfo memory stake = stakes[account];
        return stake.amount >= paramManager.minVerifierStake() && stake.deviceId == 0 && !stake.slashed;
    }

    /**
     * @dev Get count of active verifiers
     */
    function getVerifierCount() external view returns (uint256) {
        return verifierList.length;
    }

    /**
     * @dev Get list of active verifiers
     */
    function getVerifiers() external view returns (address[] memory) {
        return verifierList;
    }

    /**
     * @dev Total amount staked (for dashboard)
     */
    function totalStaked() external view returns (uint256) {
        return cmesh.balanceOf(address(this));
    }
}
