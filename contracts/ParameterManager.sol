// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ParameterManager
 * @dev Stores protocol parameters that can be updated by the DAO.
 * The Timelock contract is granted the PARAM_SETTER_ROLE.
 */
contract ParameterManager is AccessControl {
    bytes32 public constant PARAM_SETTER_ROLE = keccak256("PARAM_SETTER_ROLE");

    // Staking parameters
    uint256 public minStakeAmount;
    uint256 public maxStakeAmount;
    uint256 public minVerifierStake;
    uint256 public stakeLockPeriod;
    uint256 public slashPercentage;

    // Reward parameters
    uint256 public epochDuration;
    uint256 public sensorBaseReward;
    uint256 public gatewayBaseReward;
    uint256 public satelliteBaseReward;

    event ParameterUpdated(string indexed name, uint256 oldValue, uint256 newValue);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // Initialize with default values
        minStakeAmount = 100 * 10**18;
        maxStakeAmount = 10000 * 10**18;
        minVerifierStake = 500 * 10**18;
        stakeLockPeriod = 30 days;
        slashPercentage = 10; // 10%

        epochDuration = 1 days;
        sensorBaseReward = 1 * 10**18;
        gatewayBaseReward = 5 * 10**18;
        satelliteBaseReward = 10 * 10**18;
    }

    modifier onlySetter() {
        require(hasRole(PARAM_SETTER_ROLE, msg.sender), "Not setter");
        _;
    }

    function setMinStakeAmount(uint256 _minStakeAmount) external onlySetter {
        uint256 old = minStakeAmount;
        minStakeAmount = _minStakeAmount;
        emit ParameterUpdated("minStakeAmount", old, _minStakeAmount);
    }

    function setMaxStakeAmount(uint256 _maxStakeAmount) external onlySetter {
        uint256 old = maxStakeAmount;
        maxStakeAmount = _maxStakeAmount;
        emit ParameterUpdated("maxStakeAmount", old, _maxStakeAmount);
    }

    function setMinVerifierStake(uint256 _minVerifierStake) external onlySetter {
        uint256 old = minVerifierStake;
        minVerifierStake = _minVerifierStake;
        emit ParameterUpdated("minVerifierStake", old, _minVerifierStake);
    }

    function setStakeLockPeriod(uint256 _stakeLockPeriod) external onlySetter {
        uint256 old = stakeLockPeriod;
        stakeLockPeriod = _stakeLockPeriod;
        emit ParameterUpdated("stakeLockPeriod", old, _stakeLockPeriod);
    }

    function setSlashPercentage(uint256 _slashPercentage) external onlySetter {
        require(_slashPercentage <= 100, "Invalid percentage");
        uint256 old = slashPercentage;
        slashPercentage = _slashPercentage;
        emit ParameterUpdated("slashPercentage", old, _slashPercentage);
    }

    function setEpochDuration(uint256 _epochDuration) external onlySetter {
        uint256 old = epochDuration;
        epochDuration = _epochDuration;
        emit ParameterUpdated("epochDuration", old, _epochDuration);
    }

    function setSensorBaseReward(uint256 _sensorBaseReward) external onlySetter {
        uint256 old = sensorBaseReward;
        sensorBaseReward = _sensorBaseReward;
        emit ParameterUpdated("sensorBaseReward", old, _sensorBaseReward);
    }

    function setGatewayBaseReward(uint256 _gatewayBaseReward) external onlySetter {
        uint256 old = gatewayBaseReward;
        gatewayBaseReward = _gatewayBaseReward;
        emit ParameterUpdated("gatewayBaseReward", old, _gatewayBaseReward);
    }

    function setSatelliteBaseReward(uint256 _satelliteBaseReward) external onlySetter {
        uint256 old = satelliteBaseReward;
        satelliteBaseReward = _satelliteBaseReward;
        emit ParameterUpdated("satelliteBaseReward", old, _satelliteBaseReward);
    }

    /**
     * @dev Grant PARAM_SETTER_ROLE to the Timelock so DAO can update params.
     */
    function grantSetterRole(address timelock) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(PARAM_SETTER_ROLE, timelock);
    }
}
