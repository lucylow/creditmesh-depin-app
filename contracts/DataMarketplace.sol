// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DeviceNFT.sol";

/**
 * @title DataMarketplace
 * @dev Allows device owners to list verified data streams for sale.
 * Buyers purchase data points using CMESH.
 */
contract DataMarketplace is AccessControl, ReentrancyGuard {
    bytes32 public constant LISTER_ROLE = keccak256("LISTER_ROLE");

    DeviceNFT public deviceNFT;
    IERC20 public cmesh;

    struct Listing {
        uint256 deviceId;
        uint256 price;          // price per data point in CMESH
        uint256 available;      // number of data points available
        uint256 expiry;         // timestamp when listing expires
        address seller;
        bool active;
    }

    uint256 public listingCounter;
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => uint256[]) public deviceListings; // deviceId => listingIds

    event DataListed(uint256 indexed listingId, uint256 indexed deviceId, uint256 price, uint256 quantity, uint256 expiry);
    event DataPurchased(uint256 indexed listingId, address indexed buyer, uint256 quantity, uint256 total);
    event ListingCancelled(uint256 indexed listingId);

    constructor(address _deviceNFT, address _cmesh) {
        deviceNFT = DeviceNFT(_deviceNFT);
        cmesh = IERC20(_cmesh);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev List data for sale
     * @param deviceId Device token ID
     * @param price Price per data point (in CMESH wei)
     * @param quantity Number of data points available
     * @param duration Listing duration in seconds
     */
    function listData(
        uint256 deviceId,
        uint256 price,
        uint256 quantity,
        uint256 duration
    ) external {
        require(deviceNFT.ownerOf(deviceId) == msg.sender, "Not device owner");
        require(price > 0, "Price must be >0");
        require(quantity > 0, "Quantity must be >0");
        require(duration > 0, "Duration must be >0");

        listingCounter++;
        listings[listingCounter] = Listing({
            deviceId: deviceId,
            price: price,
            available: quantity,
            expiry: block.timestamp + duration,
            seller: msg.sender,
            active: true
        });
        deviceListings[deviceId].push(listingCounter);

        emit DataListed(listingCounter, deviceId, price, quantity, block.timestamp + duration);
    }

    /**
     * @dev Purchase data from a listing
     * @param listingId Listing ID
     * @param quantity Number of data points to purchase
     */
    function buyData(uint256 listingId, uint256 quantity) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.available >= quantity, "Not enough data points");
        require(block.timestamp <= listing.expiry, "Listing expired");

        uint256 total = listing.price * quantity;
        listing.available -= quantity;
        if (listing.available == 0) {
            listing.active = false;
        }

        // Transfer payment to seller
        cmesh.transferFrom(msg.sender, listing.seller, total);

        emit DataPurchased(listingId, msg.sender, quantity, total);
    }

    /**
     * @dev Cancel a listing (only seller)
     */
    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not seller");
        require(listing.active, "Already inactive");
        listing.active = false;
        emit ListingCancelled(listingId);
    }

    /**
     * @dev Get active listings for a device
     */
    function getDeviceListings(uint256 deviceId) external view returns (uint256[] memory) {
        return deviceListings[deviceId];
    }

    /**
     * @dev Get listing details
     */
    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }
}
