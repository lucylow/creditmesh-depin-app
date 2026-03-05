// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DeviceNFT
 * @dev ERC721 token representing an IoT device in the CreditMesh network.
 * Stores device type, reputation, stake, and earnings history.
 */
contract DeviceNFT is ERC721, ERC721URIStorage, ERC721Enumerable, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant STAKING_ROLE = keccak256("STAKING_ROLE");

    Counters.Counter private _tokenIdCounter;

    enum DeviceType { Sensor, Gateway, Satellite }

    struct DeviceInfo {
        address owner;               // Current owner
        address originalOwner;       // First owner (for loyalty rewards)
        DeviceType deviceType;       // Sensor, Gateway, Satellite
        uint256 stakeAmount;         // Current stake in CMESH
        uint256 registeredAt;        // Timestamp
        uint256 lastActive;          // Last heartbeat / contribution
        uint256 reputation;          // 0-100, updated by verifiers
        uint256 totalContributions;  // Number of verified contributions
        uint256 totalEarned;         // Total CMESH earned
        string deviceDID;            // Decentralized identifier (e.g., did:creditmesh:...)
        string metadataURI;         // IPFS URI with static metadata
        bool exists;                 // For quick existence check
    }

    mapping(uint256 => DeviceInfo) public devices;
    mapping(address => uint256[]) public ownedDevices; // Owner => device IDs

    event DeviceRegistered(uint256 indexed tokenId, address indexed owner, DeviceType deviceType, string metadataURI);
    event DeviceActivated(uint256 indexed tokenId);
    event DeviceDeactivated(uint256 indexed tokenId);
    event ReputationUpdated(uint256 indexed tokenId, uint256 newReputation);
    event StakeUpdated(uint256 indexed tokenId, uint256 newAmount);
    event ContributionRecorded(uint256 indexed tokenId, uint256 earned);

    constructor() ERC721("CreditMesh Device", "CMDEV") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Register a new device (mint NFT)
     * @param owner Address of device owner
     * @param deviceType Type of device (0=Sensor, 1=Gateway, 2=Satellite)
     * @param deviceDID Unique DID for the device
     * @param metadataURI IPFS URI with device metadata
     * @return tokenId Minted token ID
     */
    function registerDevice(
        address owner,
        DeviceType deviceType,
        string memory deviceDID,
        string memory metadataURI
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(owner != address(0), "Invalid owner");
        require(bytes(deviceDID).length > 0, "DID required");
        require(bytes(metadataURI).length > 0, "Metadata URI required");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(owner, tokenId);
        _setTokenURI(tokenId, metadataURI);

        devices[tokenId] = DeviceInfo({
            owner: owner,
            originalOwner: owner,
            deviceType: deviceType,
            stakeAmount: 0,
            registeredAt: block.timestamp,
            lastActive: block.timestamp,
            reputation: 50, // Start at 50
            totalContributions: 0,
            totalEarned: 0,
            deviceDID: deviceDID,
            metadataURI: metadataURI,
            exists: true
        });

        ownedDevices[owner].push(tokenId);
        emit DeviceRegistered(tokenId, owner, deviceType, metadataURI);
        return tokenId;
    }

    /**
     * @dev Update device activity status (called by verifiers)
     * @param tokenId Device token ID
     * @param isActive New active status
     */
    function setDeviceActive(uint256 tokenId, bool isActive) external onlyRole(VERIFIER_ROLE) {
        require(_exists(tokenId), "Device does not exist");
        devices[tokenId].lastActive = block.timestamp;
        if (isActive) {
            emit DeviceActivated(tokenId);
        } else {
            emit DeviceDeactivated(tokenId);
        }
    }

    /**
     * @dev Update device reputation (called by verifiers)
     * @param tokenId Device token ID
     * @param newReputation New reputation score (0-100)
     */
    function updateReputation(uint256 tokenId, uint256 newReputation) external onlyRole(VERIFIER_ROLE) {
        require(_exists(tokenId), "Device does not exist");
        require(newReputation <= 100, "Reputation must be 0-100");
        devices[tokenId].reputation = newReputation;
        emit ReputationUpdated(tokenId, newReputation);
    }

    /**
     * @dev Update stake amount (called by StakingPool)
     * @param tokenId Device token ID
     * @param newAmount New stake amount
     */
    function updateStake(uint256 tokenId, uint256 newAmount) external onlyRole(STAKING_ROLE) {
        require(_exists(tokenId), "Device does not exist");
        devices[tokenId].stakeAmount = newAmount;
        emit StakeUpdated(tokenId, newAmount);
    }

    /**
     * @dev Record a contribution (called by RewardDistributor)
     * @param tokenId Device token ID
     * @param earned Amount earned from this contribution
     */
    function recordContribution(uint256 tokenId, uint256 earned) external onlyRole(VERIFIER_ROLE) {
        require(_exists(tokenId), "Device does not exist");
        DeviceInfo storage d = devices[tokenId];
        d.totalContributions++;
        d.totalEarned += earned;
        d.lastActive = block.timestamp;
        emit ContributionRecorded(tokenId, earned);
    }

    /**
     * @dev Update metadata URI (owner can update)
     * @param tokenId Device token ID
     * @param newURI New IPFS URI
     */
    function updateMetadata(uint256 tokenId, string memory newURI) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _setTokenURI(tokenId, newURI);
        devices[tokenId].metadataURI = newURI;
    }

    /**
     * @dev Get all devices owned by an address
     */
    function getDevicesByOwner(address owner) external view returns (uint256[] memory) {
        return ownedDevices[owner];
    }

    /**
     * @dev Get full device info
     */
    function getDeviceInfo(uint256 tokenId) external view returns (DeviceInfo memory) {
        require(_exists(tokenId), "Device does not exist");
        return devices[tokenId];
    }

    /**
     * @dev Check if device has been active in the last 24 hours
     */
    function isActive(uint256 tokenId) external view returns (bool) {
        require(_exists(tokenId), "Device does not exist");
        return (block.timestamp - devices[tokenId].lastActive) <= 1 days;
    }

    /**
     * @dev Get device type
     */
    function getDeviceType(uint256 tokenId) external view returns (DeviceType) {
        require(_exists(tokenId), "Device does not exist");
        return devices[tokenId].deviceType;
    }

    /**
     * @dev Check if device exists
     */
    function _exists(uint256 tokenId) internal view override returns (bool) {
        return devices[tokenId].exists;
    }

    /**
     * @dev Remove tokenId from owner's list (helper for transfer)
     */
    function _removeFromOwnedDevices(address owner, uint256 tokenId) internal {
        uint256[] storage list = ownedDevices[owner];
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == tokenId) {
                list[i] = list[list.length - 1];
                list.pop();
                break;
            }
        }
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        devices[tokenId].exists = false;
        _removeFromOwnedDevices(devices[tokenId].owner, tokenId);
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        if (from != address(0) && to != address(0)) {
            devices[tokenId].owner = to;
            _removeFromOwnedDevices(from, tokenId);
            ownedDevices[to].push(tokenId);
        }
    }
}
