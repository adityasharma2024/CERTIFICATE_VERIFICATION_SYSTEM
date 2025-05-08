// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateVerification is AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Institution struct
    struct Institution {
        address institutionAddress;
        string name;
        string email;
        string accreditationId;
        string country;
        uint256 registeredAt;
    }

    mapping(address => Institution) public institutions;

    // Certificate struct
    struct Certificate {
        string certificateId;
        string recipientName;
        string course;
        string issuedDate;
        address issuedBy;
        bool isValid;
    }

    mapping(string => Certificate) public certificates;

    // Events
    event InstitutionRegistered(
        address indexed institutionAddress,
        string name,
        string email,
        string accreditationId,
        string country,
        uint256 registeredAt
    );

    event CertificateIssued(
        string certificateId,
        string recipientName,
        string course,
        string issuedDate,
        address issuedBy
    );

    event CertificateRevoked(string certificateId, address revokedBy);

    // Register institution and grant role
    function registerInstitution(
        address institutionAddress,
        string memory name,
        string memory email,
        string memory accreditationId,
        string memory country
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(institutionAddress != address(0), "Invalid address");
        require(bytes(name).length > 0, "Name is required");
        require(bytes(email).length > 0, "Email is required");
        require(bytes(accreditationId).length > 0, "Accreditation ID is required");
        require(bytes(country).length > 0, "Country is required");

        institutions[institutionAddress] = Institution({
            institutionAddress: institutionAddress,
            name: name,
            email: email,
            accreditationId: accreditationId,
            country: country,
            registeredAt: block.timestamp
        });

        _grantRole(ISSUER_ROLE, institutionAddress);

        emit InstitutionRegistered(
            institutionAddress,
            name,
            email,
            accreditationId,
            country,
            block.timestamp
        );
    }

    // Issue certificate
    function issueCertificate(
        string memory certificateId,
        string memory recipientName,
        string memory course,
        string memory issuedDate
    ) public onlyRole(ISSUER_ROLE) {
        require(certificates[certificateId].issuedBy == address(0), "Certificate already exists");

        certificates[certificateId] = Certificate({
            certificateId: certificateId,
            recipientName: recipientName,
            course: course,
            issuedDate: issuedDate,
            issuedBy: msg.sender,
            isValid: true
        });

        emit CertificateIssued(certificateId, recipientName, course, issuedDate, msg.sender);
    }

    // Revoke certificate
    function revokeCertificate(string memory certificateId) public onlyRole(ISSUER_ROLE) {
        require(certificates[certificateId].isValid, "Certificate is already revoked or does not exist");
        require(certificates[certificateId].issuedBy == msg.sender, "You are not the issuer");

        certificates[certificateId].isValid = false;

        emit CertificateRevoked(certificateId, msg.sender);
    }

    // Verify certificate
    function verifyCertificate(string memory certificateId) public view returns (
        string memory recipientName,
        string memory course,
        string memory issuedDate,
        address issuedBy,
        bool isValid
    ) {
        Certificate memory cert = certificates[certificateId];
        return (
            cert.recipientName,
            cert.course,
            cert.issuedDate,
            cert.issuedBy,
            cert.isValid
        );
    }

    // Fetch institution info
    function getInstitution(address institutionAddress) public view returns (
        string memory name,
        string memory email,
        string memory accreditationId,
        string memory country,
        uint256 registeredAt
    ) {
        Institution memory inst = institutions[institutionAddress];
        return (
            inst.name,
            inst.email,
            inst.accreditationId,
            inst.country,
            inst.registeredAt
        );
    }
}







// pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/access/AccessControl.sol";
// import "@openzeppelin/contracts/security/Pausable.sol";

// contract CertificateVerification is AccessControl, Pausable {
//     bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    
//     struct CertificateRecord {
//         string certificateId;      // Unique identifier
//         address studentAddress;    // Student's Ethereum address
//         string ipfsHash;          // IPFS hash for additional data
//         string metadata;          // Certificate metadata
//         uint256 issueDate;        // Timestamp of issuance
//         bool isRevoked;           // Revocation status
//         address issuer;           // Issuer's address
//         string institutionName;    // Institution that issued the certificate
//         string courseName;        // Name of the course
//         string grade;             // Grade achieved
//         uint256 expiryDate;       // Certificate expiry date
//     }
    
//     // Mapping to store certificates
//     mapping(string => CertificateRecord) private certificates;
//     // Mapping to track student certificates
//     mapping(address => string[]) private studentCertificates;
//     // Mapping to track institution certificates
//     mapping(string => string[]) private institutionCertificates;
    
//     // Events
//     event CertificateIssued(
//         string certificateId,
//         address indexed student,
//         address indexed issuer,
//         string institutionName,
//         uint256 issueDate
//     );
//     event CertificateRevoked(string certificateId, address indexed issuer);
    
//     // Function to issue certificate with complete record
//     function issueCertificateWithRecord(
//         string memory certificateId,
//         address studentAddress,
//         string memory ipfsHash,
//         string memory metadata,
//         string memory institutionName,
//         string memory courseName,
//         string memory grade,
//         uint256 expiryDate
//     ) public onlyRole(ISSUER_ROLE) whenNotPaused {
//         require(bytes(certificateId).length > 0, "Certificate ID cannot be empty");
//         require(studentAddress != address(0), "Invalid student address");
//         require(certificates[certificateId].studentAddress == address(0), "Certificate ID already exists");
        
//         CertificateRecord memory newCertificate = CertificateRecord({
//             certificateId: certificateId,
//             studentAddress: studentAddress,
//             ipfsHash: ipfsHash,
//             metadata: metadata,
//             issueDate: block.timestamp,
//             isRevoked: false,
//             issuer: msg.sender,
//             institutionName: institutionName,
//             courseName: courseName,
//             grade: grade,
//             expiryDate: expiryDate
//         });
        
//         certificates[certificateId] = newCertificate;
//         studentCertificates[studentAddress].push(certificateId);
//         institutionCertificates[institutionName].push(certificateId);
        
//         emit CertificateIssued(
//             certificateId,
//             studentAddress,
//             msg.sender,
//             institutionName,
//             block.timestamp
//         );
//     }
    
//     // Function to get certificate record
//     function getCertificateRecord(string memory certificateId) 
//         public 
//         view 
//         returns (CertificateRecord memory) 
//     {
//         require(certificates[certificateId].studentAddress != address(0), "Certificate does not exist");
//         return certificates[certificateId];
//     }
    
//     // Function to get all certificates for a student
//     function getStudentCertificates(address student) 
//         public 
//         view 
//         returns (string[] memory) 
//     {
//         return studentCertificates[student];
//     }
    
//     // Function to get all certificates for an institution
//     function getInstitutionCertificates(string memory institutionName) 
//         public 
//         view 
//         returns (string[] memory) 
//     {
//         return institutionCertificates[institutionName];
//     }

//     constructor() {
//         _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
//         _grantRole(ISSUER_ROLE, msg.sender);
//     }
    
//     /**
//      * @dev Issues a new certificate
//      * @param certificateId Unique identifier for the certificate
//      * @param studentAddress Address of the student receiving the certificate
//      * @param ipfsHash IPFS hash where the certificate data is stored
//      * @param metadata Additional certificate metadata
//      */
//     function issueCertificate(
//         string memory certificateId,
//         address studentAddress,
//         string memory ipfsHash,
//         string memory metadata
//     ) public onlyRole(ISSUER_ROLE) whenNotPaused {
//         require(bytes(certificateId).length > 0, "Certificate ID cannot be empty");
//         require(studentAddress != address(0), "Invalid student address");
//         require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
//         require(certificates[certificateId].issueDate == 0, "Certificate ID already exists");

//         certificates[certificateId] = CertificateRecord({
//             certificateId: certificateId,
//             studentAddress: studentAddress,
//             ipfsHash: ipfsHash,
//             metadata: metadata,
//             issueDate: block.timestamp,
//             isRevoked: false,
//             issuer: msg.sender,
//             institutionName: "",
//             courseName: "",
//             grade: "",
//             expiryDate: 0
//         });

//         emit CertificateIssued(
//             certificateId,
//             msg.sender,
//             studentAddress,
//             ipfsHash,
//             block.timestamp
//         );
//     }
    
//     /**
//      * @dev Revokes an existing certificate
//      * @param certificateId ID of the certificate to revoke
//      */
//     function revokeCertificate(string memory certificateId) 
//         public 
//         onlyRole(ISSUER_ROLE) 
//         whenNotPaused 
//     {
//         require(certificates[certificateId].issueDate > 0, "Certificate does not exist");
//         require(!certificates[certificateId].isRevoked, "Certificate is already revoked");
        
//         certificates[certificateId].isRevoked = true;
//         emit CertificateRevoked(certificateId, msg.sender);
//     }
    
//     /**
//      * @dev Verifies a certificate's authenticity
//      * @param certificateId ID of the certificate to verify
//      * @return isValid Whether the certificate is valid
//      * @return certificate The certificate data
//      */
//     function verifyCertificate(string memory certificateId)
//         public
//         view
//         returns (bool isValid, CertificateRecord memory certificate)
//     {
//         certificate = certificates[certificateId];
//         isValid = certificate.issueDate > 0 && !certificate.isRevoked;
//         return (isValid, certificate);
//     }
    
//     /**
//      * @dev Pauses all certificate operations
//      */
//     function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
//         _pause();
//     }
    
//     /**
//      * @dev Unpauses all certificate operations
//      */
//     function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
//         _unpause();
//     }
// }