// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./StakingPool.sol";

/**
 * @title VerifierSelection
 * @dev Randomly selects a subset of verifiers for each epoch.
 * Uses a commit‑reveal or blockhash randomness (simplified for hackathon).
 */
contract VerifierSelection is AccessControl {
    using ECDSA for bytes32;

    bytes32 public constant RANDOMNESS_ROLE = keccak256("RANDOMNESS_ROLE");

    StakingPool public stakingPool;

    uint256 public constant EPOCH_DURATION = 1 days;
    uint256 public currentEpoch;
    uint256 public epochStart;

    // For each epoch, the list of selected verifiers
    mapping(uint256 => address[]) public epochVerifiers;
    // Random seed for each epoch
    mapping(uint256 => uint256) public epochRandom;

    event EpochStarted(uint256 indexed epoch, uint256 random);
    event VerifiersSelected(uint256 indexed epoch, address[] verifiers);

    constructor(address _stakingPool) {
        stakingPool = StakingPool(_stakingPool);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        currentEpoch = 1;
        epochStart = block.timestamp;
    }

    /**
     * @dev Start a new epoch (callable by anyone after EPOCH_DURATION)
     * @param randomnessSource Additional entropy (optional)
     */
    function startNewEpoch(bytes calldata randomnessSource) external {
        require(block.timestamp >= epochStart + EPOCH_DURATION, "Epoch not finished");
        currentEpoch++;
        epochStart = block.timestamp;

        // Generate random seed using blockhash and provided source
        uint256 seed = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), randomnessSource, currentEpoch)));
        epochRandom[currentEpoch] = seed;

        // Select verifiers
        address[] memory allVerifiers = stakingPool.getVerifiers();
        uint256 total = allVerifiers.length;
        uint256 count = total / 3 + 1; // select ~1/3 of verifiers, at least 1
        if (count > total) count = total;

        address[] memory selected = new address[](count);
        if (count > 0) {
            // Simple random selection without replacement
            // In production, use a more robust algorithm
            for (uint256 i = 0; i < count; i++) {
                uint256 rand = uint256(keccak256(abi.encodePacked(seed, i))) % total;
                selected[i] = allVerifiers[rand];
            }
        }
        epochVerifiers[currentEpoch] = selected;

        emit EpochStarted(currentEpoch, seed);
        emit VerifiersSelected(currentEpoch, selected);
    }

    /**
     * @dev Get verifiers for a given epoch
     */
    function getVerifiers(uint256 epoch) external view returns (address[] memory) {
        return epochVerifiers[epoch];
    }

    /**
     * @dev Get current epoch info
     */
    function getCurrentEpochInfo() external view returns (uint256 epoch, uint256 start, uint256 end, uint256 timeRemaining) {
        epoch = currentEpoch;
        start = epochStart;
        end = epochStart + EPOCH_DURATION;
        if (block.timestamp < end) {
            timeRemaining = end - block.timestamp;
        } else {
            timeRemaining = 0;
        }
    }
}
