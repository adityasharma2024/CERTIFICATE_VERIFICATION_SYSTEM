import { ethers } from 'ethers';
import CertificateVerificationABI from '../artifacts/contracts/CertificateVerification.sol/CertificateVerification.json';

// Get contract address from environment variable
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const getContract = async (withSigner = false) => {
    if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum, {
            name: 'localhost',
            chainId: 31337,
            ensAddress: null // Disable ENS resolution
        });
        await provider.ready; // Ensure provider is initialized
        const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CertificateVerificationABI.abi,
            provider
        );

        if (withSigner) {
            const signer = await provider.getSigner();
            return contract.connect(signer);
        }

        return contract;
    } catch (error) {
        console.error('Error getting contract:', error);
        throw error;
    }
};

export const issueCertificateWithRecord = async (certificateData) => {
    try {
        const contract = await getContract(true);
        const tx = await contract.issueCertificateWithRecord(
            certificateData.certificateId,
            certificateData.studentAddress,
            certificateData.ipfsHash,
            certificateData.metadata,
            certificateData.institutionName,
            certificateData.courseName,
            certificateData.grade,
            certificateData.expiryDate
        );
        await tx.wait();
        return true;
    } catch (error) {
        console.error('Error issuing certificate:', error);
        throw error;
    }
};

export const verifyCertificate = async (certificateId) => {
    try {
        const contract = await getContract();
        const result = await contract.verifyCertificate(certificateId);
        
        // Handle the case where the result is undefined or invalid
        if (!result || !Array.isArray(result) || result.length < 2) {
            throw new Error('Invalid response from contract');
        }

        const [isValid, certificate] = result;

        // Validate certificate data
        if (!certificate) {
            throw new Error('Certificate data not found');
        }

        return {
            isValid,
            certificate: {
                ...certificate,
                issueDate: certificate.issueDate ? new Date(Number(certificate.issueDate) * 1000).toLocaleString() : 'N/A',
                expiryDate: certificate.expiryDate ? new Date(Number(certificate.expiryDate) * 1000).toLocaleString() : 'N/A'
            }
        };
    } catch (error) {
        console.error('Error verifying certificate:', error);
        if (error.message.includes('BAD_DATA')) {
            throw new Error('Invalid certificate ID format');
        }
        throw error;
    }
};

export const revokeCertificate = async (certificateId) => {
    try {
        const contract = await getContract(true);
        const tx = await contract.revokeCertificate(certificateId);
        await tx.wait();
        return true;
    } catch (error) {
        console.error('Error revoking certificate:', error);
        throw error;
    }
};

export const getStudentCertificates = async (studentAddress) => {
    try {
        const contract = await getContract();
        const certificates = await contract.getStudentCertificates(studentAddress);
        return certificates;
    } catch (error) {
        console.error('Error getting student certificates:', error);
        throw error;
    }
};

export const getInstitutionCertificates = async (institutionName) => {
    try {
        const contract = await getContract();
        const certificates = await contract.getInstitutionCertificates(institutionName);
        return certificates;
    } catch (error) {
        console.error('Error getting institution certificates:', error);
        throw error;
    }
};

export const grantIssuerRole = async (address) => {
    try {
        const contract = await getContract(true);
        const ISSUER_ROLE = await contract.ISSUER_ROLE();
        const tx = await contract.grantRole(ISSUER_ROLE, address);
        await tx.wait();
        return true;
    } catch (error) {
        console.error('Error granting issuer role:', error);
        throw error;
    }
};

export const revokeIssuerRole = async (address) => {
    try {
        const contract = await getContract(true);
        const ISSUER_ROLE = await contract.ISSUER_ROLE();
        const tx = await contract.revokeRole(ISSUER_ROLE, address);
        await tx.wait();
        return true;
    } catch (error) {
        console.error('Error revoking issuer role:', error);
        throw error;
    }
};