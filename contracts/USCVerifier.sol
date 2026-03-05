// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title USCVerifier
 * @dev Integrates with Creditcoin's native verifier precompile at 0x0FD2.
 * Verifies that a transaction occurred on another chain (e.g., Ethereum).
 */
contract USCVerifier is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    // Creditcoin's native verifier precompile address
    address constant NATIVE_VERIFIER = 0x0000000000000000000000000000000000000FD2;

    event DataVerified(bytes32 indexed txHash, uint256 indexed deviceId, uint256 timestamp);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Verify a cross-chain transaction and emit an event if valid.
     * @param chainId Source chain ID (1=Ethereum, 137=Polygon)
     * @param blockNumber Block number on source chain
     * @param txIndex Transaction index within the block
     * @param merkleProof Proof of transaction inclusion
     * @param continuityProof Proof of block continuity
     * @param encodedTx Raw transaction bytes
     * @param deviceId CreditMesh device ID (for indexing)
     * @param expectedDataHash Expected hash of the data within the transaction
     */
    function verifyDeviceData(
        uint256 chainId,
        uint256 blockNumber,
        uint256 txIndex,
        bytes calldata merkleProof,
        bytes calldata continuityProof,
        bytes calldata encodedTx,
        uint256 deviceId,
        bytes32 expectedDataHash
    ) external onlyRole(VERIFIER_ROLE) returns (bool) {
        // Call native verifier precompile
        (bool success, bytes memory result) = NATIVE_VERIFIER.staticcall(
            abi.encodeWithSignature(
                "verify(uint256,uint256,uint256,bytes,bytes,bytes)",
                chainId,
                blockNumber,
                txIndex,
                merkleProof,
                continuityProof,
                encodedTx
            )
        );
        require(success, "Verification call failed");
        bool verified = abi.decode(result, (bool));
        require(verified, "Proof invalid");

        // Optional: verify that the transaction contains expected data
        // This requires parsing the transaction; simplified here.
        bytes32 txDataHash = keccak256(encodedTx);
        require(txDataHash == expectedDataHash, "Data hash mismatch");

        bytes32 txHash = keccak256(abi.encodePacked(chainId, blockNumber, txIndex, encodedTx));
        emit DataVerified(txHash, deviceId, block.timestamp);
        return true;
    }
}
