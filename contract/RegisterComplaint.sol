// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WhistleblowerRegistry {
    
    struct Complaint {
        bytes32 complaintHash;
        uint256 timestamp;
        string category;
        bool isResolved;
        address investigator;
        string resolutionNotes;
        uint256 resolvedAt;
    }
    
    address public admin;
    mapping(uint256 => Complaint) public complaints;
    mapping(address => bool) public authorizedInvestigators;
    uint256 public complaintCount;
    
    event ComplaintRegistered(uint256 indexed complaintId, bytes32 complaintHash, string category, uint256 timestamp);
    event ComplaintAssigned(uint256 indexed complaintId, address investigator);
    event ComplaintResolved(uint256 indexed complaintId, uint256 resolvedAt);
    event InvestigatorAuthorized(address investigator);
    event InvestigatorRevoked(address investigator);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyInvestigator() {
        require(authorizedInvestigators[msg.sender] || msg.sender == admin, "Not authorized investigator");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        authorizedInvestigators[msg.sender] = true;
    }
    
    /**
     * @dev Register a new whistleblowing complaint
     * @param _complaintHash Hash of the complaint details (for privacy)
     * @param _category Category of the complaint
     */
    function registerComplaint(bytes32 _complaintHash, string memory _category) external returns (uint256) {
        require(_complaintHash != bytes32(0), "Invalid complaint hash");
        require(bytes(_category).length > 0, "Category cannot be empty");
        
        complaintCount++;
        
        complaints[complaintCount] = Complaint({
            complaintHash: _complaintHash,
            timestamp: block.timestamp,
            category: _category,
            isResolved: false,
            investigator: address(0),
            resolutionNotes: "",
            resolvedAt: 0
        });
        
        emit ComplaintRegistered(complaintCount, _complaintHash, _category, block.timestamp);
        
        return complaintCount;
    }
    
    /**
     * @dev Assign an investigator to a complaint
     * @param _complaintId ID of the complaint
     * @param _investigator Address of the investigator
     */
    function assignInvestigator(uint256 _complaintId, address _investigator) external onlyAdmin {
        require(_complaintId > 0 && _complaintId <= complaintCount, "Invalid complaint ID");
        require(authorizedInvestigators[_investigator], "Investigator not authorized");
        require(!complaints[_complaintId].isResolved, "Complaint already resolved");
        
        complaints[_complaintId].investigator = _investigator;
        
        emit ComplaintAssigned(_complaintId, _investigator);
    }
    
    /**
     * @dev Resolve a complaint
     * @param _complaintId ID of the complaint
     * @param _resolutionNotes Notes about the resolution
     */
    function resolveComplaint(uint256 _complaintId, string memory _resolutionNotes) external onlyInvestigator {
        require(_complaintId > 0 && _complaintId <= complaintCount, "Invalid complaint ID");
        Complaint storage complaint = complaints[_complaintId];
        require(!complaint.isResolved, "Complaint already resolved");
        require(complaint.investigator == msg.sender || msg.sender == admin, "Not assigned investigator");
        
        complaint.isResolved = true;
        complaint.resolutionNotes = _resolutionNotes;
        complaint.resolvedAt = block.timestamp;
        
        emit ComplaintResolved(_complaintId, block.timestamp);
    }
    
    /**
     * @dev Authorize a new investigator
     * @param _investigator Address to authorize
     */
    function authorizeInvestigator(address _investigator) external onlyAdmin {
        require(_investigator != address(0), "Invalid address");
        require(!authorizedInvestigators[_investigator], "Already authorized");
        
        authorizedInvestigators[_investigator] = true;
        
        emit InvestigatorAuthorized(_investigator);
    }
    
    /**
     * @dev Revoke investigator authorization
     * @param _investigator Address to revoke
     */
    function revokeInvestigator(address _investigator) external onlyAdmin {
        require(_investigator != admin, "Cannot revoke admin");
        require(authorizedInvestigators[_investigator], "Not an authorized investigator");
        
        authorizedInvestigators[_investigator] = false;
        
        emit InvestigatorRevoked(_investigator);
    }
    
    /**
     * @dev Get complaint details
     * @param _complaintId ID of the complaint
     */
    function getComplaint(uint256 _complaintId) external view returns (
        bytes32 complaintHash,
        uint256 timestamp,
        string memory category,
        bool isResolved,
        address investigator,
        string memory resolutionNotes,
        uint256 resolvedAt
    ) {
        require(_complaintId > 0 && _complaintId <= complaintCount, "Invalid complaint ID");
        Complaint memory complaint = complaints[_complaintId];
        
        return (
            complaint.complaintHash,
            complaint.timestamp,
            complaint.category,
            complaint.isResolved,
            complaint.investigator,
            complaint.resolutionNotes,
            complaint.resolvedAt
        );
    }
    
    /**
     * @dev Transfer admin rights
     * @param _newAdmin Address of new admin
     */
    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        admin = _newAdmin;
        authorizedInvestigators[_newAdmin] = true;
    }
}