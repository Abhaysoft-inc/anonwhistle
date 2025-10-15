//https://sepolia.etherscan.io/tx/0xf32a6623000a343d0aa2d68809a6897ebeb2b893e311e52c5eba20da7b908216

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ComplaintRegistry
 * @notice Stores complaint proofs (CID + hash) on-chain.
 *         Sensitive content stays encrypted off-chain (e.g. IPFS).
 */

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ComplaintRegistry is AccessControl {
    bytes32 public constant DEPARTMENT_ROLE = keccak256("DEPARTMENT_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    uint256 public nextId;

    enum Status {
        Submitted,
        UnderReview,
        Resolved,
        Rejected
    }

    struct Complaint {
        uint256 id;
        address submitter;
        string cid; // Pointer to encrypted blob (IPFS CID or URL)
        bytes32 commitment; // keccak256 hash proving integrity
        uint8 severity; // severity code
        uint8 deptCode; // department code
        Status status;
        uint256 timestamp;
    }

    mapping(uint256 => Complaint) private complaints;
    mapping(uint256 => mapping(address => string)) private encryptedKeyURIs;

    event ComplaintAdded(
        uint256 indexed id,
        address indexed submitter,
        bytes32 commitment,
        string cid
    );
    event ComplaintStatusChanged(uint256 indexed id, Status status);
    event EncryptedKeyURISet(
        uint256 indexed id,
        address indexed investigator,
        string uri
    );

    /**
     * @dev Constructor: grant DEFAULT_ADMIN_ROLE to deployer/admin.
     */
    constructor(address admin) {
        require(admin != address(0), "admin zero address");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        nextId = 1;
    }

    /**
     * @notice Add a new complaint record.
     */
    function addComplaint(
        string calldata cid,
        bytes32 commitment,
        uint8 severity,
        uint8 deptCode
    ) external returns (uint256) {
        require(bytes(cid).length > 0, "cid required");
        require(commitment != bytes32(0), "commitment required");

        uint256 id = nextId++;
        complaints[id] = Complaint({
            id: id,
            submitter: msg.sender,
            cid: cid,
            commitment: commitment,
            severity: severity,
            deptCode: deptCode,
            status: Status.Submitted,
            timestamp: block.timestamp
        });

        emit ComplaintAdded(id, msg.sender, commitment, cid);
        return id;
    }

    /**
     * @notice Only department role can update complaint status.
     */
    function setStatus(
        uint256 id,
        Status newStatus
    ) external onlyRole(DEPARTMENT_ROLE) {
        require(exists(id), "complaint not found");
        complaints[id].status = newStatus;
        emit ComplaintStatusChanged(id, newStatus);
    }

    /**
     * @notice Store pointer (URI) to the encrypted symmetric key for a given investigator.
     */
    function setEncryptedKeyURI(
        uint256 id,
        address investigator,
        string calldata uri
    ) external {
        require(exists(id), "complaint not found");
        require(investigator != address(0), "invalid investigator");
        require(bytes(uri).length > 0, "uri required");

        if (msg.sender != complaints[id].submitter) {
            require(
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
                    hasRole(AUDITOR_ROLE, msg.sender),
                "not allowed"
            );
        }

        encryptedKeyURIs[id][investigator] = uri;
        emit EncryptedKeyURISet(id, investigator, uri);
    }

    function getEncryptedKeyURI(
        uint256 id,
        address investigator
    ) external view returns (string memory) {
        require(exists(id), "complaint not found");
        return encryptedKeyURIs[id][investigator];
    }

    function getComplaint(
        uint256 id
    )
        external
        view
        returns (
            uint256,
            address,
            string memory,
            bytes32,
            uint8,
            uint8,
            Status,
            uint256
        )
    {
        require(exists(id), "complaint not found");
        Complaint storage c = complaints[id];
        return (
            c.id,
            c.submitter,
            c.cid,
            c.commitment,
            c.severity,
            c.deptCode,
            c.status,
            c.timestamp
        );
    }

    function listComplaints(
        uint256 startId,
        uint256 count
    ) external view returns (Complaint[] memory) {
        require(count <= 200, "count too large");
        require(startId > 0 && startId < nextId, "start out of range");

        uint256 available = nextId - startId;
        uint256 take = available < count ? available : count;
        Complaint[] memory out = new Complaint[](take);

        for (uint256 i = 0; i < take; i++) {
            out[i] = complaints[startId + i];
        }
        return out;
    }

    function exists(uint256 id) public view returns (bool) {
        return id > 0 && id < nextId && complaints[id].timestamp != 0;
    }

    // ---- Admin helpers ----
    function grantDepartmentRole(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DEPARTMENT_ROLE, account);
    }

    function revokeDepartmentRole(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(DEPARTMENT_ROLE, account);
    }

    function grantAuditorRole(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(AUDITOR_ROLE, account);
    }

    function revokeAuditorRole(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(AUDITOR_ROLE, account);
    }
}
