Certificate Verification Smart Contract
This smart contract enables the registration of institutions and the issuance, verification, and revocation of certificates on the Ethereum blockchain. 
Table of Contents
•	Overview
•	Features
•	Installation
•	Usage
	Register Institution
	Issue Certificate
	Revoke Certificate
	Verify Certificate
	Fetch Institution Info
•	Events
•	Roles
•	License
Overview
This smart contract provides a decentralized, transparent, and secure way to:
•	Register accredited institutions.
•	Allow registered institutions to issue certificates to recipients.
•	Enable verification of issued certificates by the public.
•	Revoke certificates if needed.
Features
•	Institution registration with metadata (name, email, accreditation ID, country).
•	Certificate issuance with metadata (recipient, course, date).
•	revocation with issuer check.
•	 Public verification of certificate authenticity.
•	 Role-based access control using OpenZeppelin.
•	Extendable structure for adding features like IPFS, Pausable, and more.




Installation
1.	Clone the repository:
2.	git clone https://github.com/yourusername/certificate-verification.git
cd certificate-verification

3.	Install dependencies:
npm install
4.	Compile the smart contract:
npx hardhat compile
Usage
Register Institution
Only DEFAULT_ADMIN_ROLE (usually the contract deployer) can register institutions.
function registerInstitution(
    address institutionAddress,
    string memory name,
    string memory email,
    string memory accreditationId,
    string memory country
) public onlyRole(DEFAULT_ADMIN_ROLE)
Grants the ISSUER_ROLE to the specified address
 Issue Certificate
Only an institution with the ISSUER_ROLE can issue certificates.
function issueCertificate(
    string memory certificateId,
    string memory recipientName,
    string memory course,
    string memory issuedDate
) public onlyRole(ISSUER_ROLE)
Certificate ID must be unique and not previously issued.


Revoke Certificate
Institutions can revoke their previously issued certificates.
function revokeCertificate(string memory certificateId) public onlyRole(ISSUER_ROLE)
The sender must be the original issuer of the certificate.
Verify Certificate
Anyone can verify a certificate by its ID.
function verifyCertificate(string memory certificateId) public view returns (
    string memory recipientName,
    string memory course,
    string memory issuedDate,
    address issuedBy,
    bool isValid
)
Returns certificate details including validity.
 Fetch Institution Info
Anyone can fetch registered institution info by address.
function getInstitution(address institutionAddress) public view returns (
    string memory name,
    string memory email,
    string memory accreditationId,
    string memory country,
    uint256 registeredAt
)
Events
•	InstitutionRegistered
•	event InstitutionRegistered(
•	  address indexed institutionAddress,
•	  string name,
•	  string email,
•	  string accreditationId,
•	  string country,
•	  uint256 registeredAt
);
•	CertificateIssued
•	event CertificateIssued(
•	  string certificateId,
•	  string recipientName,
•	  string course,
•	  string issuedDate,
•	  address issuedBy
);
•	CertificateRevoked
event CertificateRevoked(string certificateId, address revokedBy);

Roles
•	DEFAULT_ADMIN_ROLE: Can register institutions and assign roles.
•	ISSUER_ROLE: Can issue and revoke certificates.
Role management is handled via OpenZeppelin's AccessControl.


