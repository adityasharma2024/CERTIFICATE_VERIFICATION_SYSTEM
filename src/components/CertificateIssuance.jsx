import React, { useState } from 'react';
import { ethers } from 'ethers';
import WalletConnect from './WalletConnect';
import './CertificateIssuance.css'; // Add this file for styling

function CertificateIssuance() {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    courseProgram: '',
    grade: '',
    completionDate: '',
    certificateFile: null,
    institutionCategory: '',
    institutionAddress: '',
    studentAddress: ''
  });

  const [fileName, setFileName] = useState('');
  const [issuanceResult, setIssuanceResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to issue certificates');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const metadata = {
        ...formData,
        issueDate: new Date().toISOString(),
        issuer: accounts[0]
      };

      const fakeHash = '0x123abc456...'; // Replace with real tx hash later

      sessionStorage.setItem(formData.studentAddress, JSON.stringify({
        hash: fakeHash,
        metadata
      }));

      setIssuanceResult({ hash: fakeHash, metadata });

      setFormData({
        studentName: '',
        studentId: '',
        courseProgram: '',
        grade: '',
        completionDate: '',
        certificateFile: null,
        institutionCategory: '',
        institutionAddress: '',
        studentAddress: ''
      });

      setFileName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="certificate-container">
      <h2 className="title">🎓 Issue Blockchain Certificate</h2>
      <WalletConnect />

      <form onSubmit={handleSubmit} className="certificate-form">
        <div className="form-row">
          <input type="text" placeholder="Student Name" value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} required />
        </div>

        <div className="form-row">
          <input type="text" placeholder="Student ID" value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} required />
        </div>

        <div className="form-row">
          <input type="text" placeholder="Course or Program" value={formData.courseProgram}
            onChange={(e) => setFormData({ ...formData, courseProgram: e.target.value })} required />
        </div>

        <div className="form-row">
          <input type="text" placeholder="Grade (e.g. A+)" value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })} required />
        </div>

        <div className="form-row">
          <input type="date" value={formData.completionDate}
            onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })} required />
        </div>

        <div className="form-row file-upload">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              setFormData({ ...formData, certificateFile: e.target.files[0] });
              setFileName(e.target.files[0]?.name || '');
            }} required />
          {fileName && <span className="file-name">📎 {fileName}</span>}
        </div>

        <div className="form-row">
          <select value={formData.institutionCategory}
            onChange={(e) => setFormData({ ...formData, institutionCategory: e.target.value })} required>
            <option value="">Select Institution Category</option>
            <option value="Secondary School">Secondary School</option>
            <option value="TVET School">TVET School</option>
            <option value="University">University</option>
          </select>
        </div>

        <div className="form-row">
          <input type="text" placeholder="Institution Blockchain Address"
            value={formData.institutionAddress}
            onChange={(e) => setFormData({ ...formData, institutionAddress: e.target.value })} required />
        </div>

        <div className="form-row">
          <input type="text" placeholder="Student Blockchain Address"
            value={formData.studentAddress}
            onChange={(e) => setFormData({ ...formData, studentAddress: e.target.value })} required />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '🔄 Issuing Certificate...' : '🚀 Issue Certificate'}
        </button>
      </form>

      {issuanceResult && (
        <div className="result-box success">
          ✅ Certificate issued!
          <div>
            <strong>Hash:</strong> <code>{issuanceResult.hash}</code>
            <button onClick={() => navigator.clipboard.writeText(issuanceResult.hash)} className="copy-btn">Copy</button>
          </div>
        </div>
      )}

      {error && <div className="result-box error">❌ {error}</div>}
    </div>
  );
}

export default CertificateIssuance;







// import React, { useState } from 'react';
// import { ethers } from 'ethers';
// import WalletConnect from './WalletConnect';

// function CertificateIssuance() {
//   const [formData, setFormData] = useState({
//     studentName: '',
//     studentId: '',  // Added Student ID
//     courseProgram: '',
//     grade: '',
//     completionDate: '',
//     certificateFile: null,
//     institutionCategory: '',  // Added Institution Category
//     institutionAddress: ''  // Added Institution Address
//   });
//   const [issuanceResult, setIssuanceResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       // Check if MetaMask is installed
//       if (!window.ethereum) {
//         throw new Error('Please install MetaMask to issue certificates');
//       }

//       // Request account access
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();

//       // Create certificate metadata including new fields
//       const metadata = {
//         studentName: formData.studentName,
//         studentId: formData.studentId,  // Added Student ID
//         courseProgram: formData.courseProgram,
//         grade: formData.grade,
//         completionDate: formData.completionDate,
//         institutionCategory: formData.institutionCategory,  // Added Institution Category
//         institutionAddress: formData.institutionAddress,  // Added Institution Address
//         issueDate: new Date().toISOString(),
//         issuer: accounts[0]
//       };

//       // Here you would typically:
//       // 1. Upload the certificate file to IPFS
//       // 2. Store the metadata on the blockchain
//       // 3. Emit an event for the certificate issuance

//       // For now, we'll just show a success message
//       setIssuanceResult({
//         hash: '0x...', // This would be the actual transaction hash
//         metadata
//       });

//       // Reset form
//       setFormData({
//         studentName: '',
//         studentId: '',  // Reset Student ID
//         courseProgram: '',
//         grade: '',
//         completionDate: '',
//         certificateFile: null,
//         institutionCategory: '',  // Reset Institution Category
//         institutionAddress: ''  // Reset Institution Address
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="issue-certificate">
//       <h2>Issue Certificate</h2>
//       <WalletConnect />
      
//       <form onSubmit={handleSubmit} className="certificate-form">
//         <div className="form-group">
//           <label>Student Name</label>
//           <input
//             type="text"
//             value={formData.studentName}
//             onChange={(e) => setFormData({...formData, studentName: e.target.value})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Student ID</label>  {/* New field for Student ID */}
//           <input
//             type="text"
//             value={formData.studentId}
//             onChange={(e) => setFormData({...formData, studentId: e.target.value})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Course/Program</label>
//           <input
//             type="text"
//             value={formData.courseProgram}
//             onChange={(e) => setFormData({...formData, courseProgram: e.target.value})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Grade</label>
//           <input
//             type="text"
//             value={formData.grade}
//             onChange={(e) => setFormData({...formData, grade: e.target.value})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Date of Completion</label>
//           <input
//             type="date"
//             value={formData.completionDate}
//             onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Upload Certificate File (PDF/Image)</label>
//           <input
//             type="file"
//             accept=".pdf,.jpg,.jpeg,.png"
//             onChange={(e) => setFormData({...formData, certificateFile: e.target.files[0]})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Institution Category</label>  {/* New field for Institution Category */}
//           <input
//             type="text"
//             value={formData.institutionCategory}
//             onChange={(e) => setFormData({...formData, institutionCategory: e.target.value})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Institution Address</label>  {/* New field for Institution Address */}
//           <input
//             type="text"
//             value={formData.institutionAddress}
//             onChange={(e) => setFormData({...formData, institutionAddress: e.target.value})}
//             required
//           />
//         </div>

//         <button type="submit" className="submit-btn" disabled={loading}>
//           {loading ? 'Issuing Certificate...' : 'Issue Certificate'}
//         </button>
//       </form>

//       {issuanceResult && (
//         <div className="issuance-result">
//           <div className="success-message">
//             ✅ Certificate issued successfully
//           </div>
//           <div className="hash-info">
//             Hash: <code>{issuanceResult.hash}</code>
//             <button className="copy-btn" onClick={() => navigator.clipboard.writeText(issuanceResult.hash)}>
//               Copy
//             </button>
//           </div>
//         </div>
//       )}

//       {error && <div className="error-message">{error}</div>}

//       <style>
//         {`
//           .issue-certificate {
//             padding: 2rem;
//             background: white;
//             border-radius: 12px;
//             box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//           }

//           h2 {
//             color: #2c3e50;
//             margin-bottom: 2rem;
//             text-align: center;
//           }

//           .certificate-form {
//             max-width: 600px;
//             margin: 0 auto;
//           }

//           .form-group {
//             margin-bottom: 1.5rem;
//           }

//           label {
//             display: block;
//             margin-bottom: 0.5rem;
//             color: #555;
//             font-weight: 500;
//           }

//           input {
//             width: 100%;
//             padding: 0.75rem;
//             border: 1px solid #ddd;
//             border-radius: 4px;
//             font-size: 1rem;
//           }

//           input:focus {
//             border-color: #2196F3;
//             outline: none;
//             box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
//           }

//           .submit-btn {
//             width: 100%;
//             padding: 1rem;
//             background: #2196F3;
//             color: white;
//             border: none;
//             border-radius: 4px;
//             font-size: 1rem;
//             font-weight: 500;
//             cursor: pointer;
//             transition: background 0.3s ease;
//           }

//           .submit-btn:hover {
//             background: #1976D2;
//           }

//           .issuance-result {
//             margin-top: 2rem;
//             padding: 1.5rem;
//             background: #e8f5e9;
//             border-radius: 8px;
//             text-align: center;
//           }

//           .success-message {
//             color: #2e7d32;
//             font-size: 1.2rem;
//             font-weight: 500;
//             margin-bottom: 1rem;
//           }

//           .hash-info {
//             background: white;
//             padding: 1rem;
//             border-radius: 4px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             gap: 1rem;
//           }

//           code {
//             background: #f5f5f5;
//             padding: 0.25rem 0.5rem;
//             border-radius: 4px;
//             font-family: monospace;
//           }

//           .copy-btn {
//             padding: 0.25rem 0.75rem;
//             background: #2196F3;
//             color: white;
//             border: none;
//             border-radius: 4px;
//             cursor: pointer;
//             font-size: 0.9rem;
//           }

//           .copy-btn:hover {
//             background: #1976D2;
//           }

//           @media (max-width: 768px) {
//             .issue-certificate {
//               padding: 1rem;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default CertificateIssuance;







// import React, { useState } from 'react';
// import { ethers } from 'ethers';
// import WalletConnect from './WalletConnect';

// function CertificateIssuance() {
//   const [formData, setFormData] = useState({
//     studentName: '',
//     courseProgram: '',
//     grade: '',
//     completionDate: '',
//     certificateFile: null
//   });
//   const [issuanceResult, setIssuanceResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       // Check if MetaMask is installed
//       if (!window.ethereum) {
//         throw new Error('Please install MetaMask to issue certificates');
//       }

//       // Request account access
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();

//       // Create certificate metadata
//       const metadata = {
//         studentName: formData.studentName,
//         courseProgram: formData.courseProgram,
//         grade: formData.grade,
//         completionDate: formData.completionDate,
//         issueDate: new Date().toISOString(),
//         issuer: accounts[0]
//       };

//       // Here you would typically:
//       // 1. Upload the certificate file to IPFS
//       // 2. Store the metadata on the blockchain
//       // 3. Emit an event for the certificate issuance

//       // For now, we'll just show a success message
//       setIssuanceResult({
//         hash: '0x...', // This would be the actual transaction hash
//         metadata
//       });

//       // Reset form
//       setFormData({
//         studentName: '',
//         courseProgram: '',
//         grade: '',
//         completionDate: '',
//         certificateFile: null
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="issue-certificate">
//       <h2>Issue Certificate</h2>
//       <WalletConnect />
      
//       <form onSubmit={handleSubmit} className="certificate-form">
//         <div className="form-group">
//           <label>Student Name</label>
//           <input
//             type="text"
//             value={formData.studentName}
//             onChange={(e) => setFormData({...formData, studentName: e.target.value})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Course/Program</label>
//           <input
//             type="text"
//             value={formData.courseProgram}
//             onChange={(e) => setFormData({...formData, courseProgram: e.target.value})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Grade</label>
//           <input
//             type="text"
//             value={formData.grade}
//             onChange={(e) => setFormData({...formData, grade: e.target.value})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Date of Completion</label>
//           <input
//             type="date"
//             value={formData.completionDate}
//             onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Upload Certificate File (PDF/Image)</label>
//           <input
//             type="file"
//             accept=".pdf,.jpg,.jpeg,.png"
//             onChange={(e) => setFormData({...formData, certificateFile: e.target.files[0]})}
//             required
//           />
//         </div>

//         <button type="submit" className="submit-btn">Issue Certificate</button>
//       </form>

//       {issuanceResult && (
//         <div className="issuance-result">
//           <div className="success-message">
//             ✅ Certificate issued successfully
//           </div>
//           <div className="hash-info">
//             Hash: <code>{issuanceResult.hash}</code>
//             <button className="copy-btn" onClick={() => navigator.clipboard.writeText(issuanceResult.hash)}>
//               Copy
//             </button>
//           </div>
//         </div>
//       )}

//       <style>
//         {`
//           .issue-certificate {
//             padding: 2rem;
//             background: white;
//             border-radius: 12px;
//             box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//           }

//           h2 {
//             color: #2c3e50;
//             margin-bottom: 2rem;
//             text-align: center;
//           }

//           .certificate-form {
//             max-width: 600px;
//             margin: 0 auto;
//           }

//           .form-group {
//             margin-bottom: 1.5rem;
//           }

//           label {
//             display: block;
//             margin-bottom: 0.5rem;
//             color: #555;
//             font-weight: 500;
//           }

//           input {
//             width: 100%;
//             padding: 0.75rem;
//             border: 1px solid #ddd;
//             border-radius: 4px;
//             font-size: 1rem;
//           }

//           input:focus {
//             border-color: #2196F3;
//             outline: none;
//             box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
//           }

//           .submit-btn {
//             width: 100%;
//             padding: 1rem;
//             background: #2196F3;
//             color: white;
//             border: none;
//             border-radius: 4px;
//             font-size: 1rem;
//             font-weight: 500;
//             cursor: pointer;
//             transition: background 0.3s ease;
//           }

//           .submit-btn:hover {
//             background: #1976D2;
//           }

//           .issuance-result {
//             margin-top: 2rem;
//             padding: 1.5rem;
//             background: #e8f5e9;
//             border-radius: 8px;
//             text-align: center;
//           }

//           .success-message {
//             color: #2e7d32;
//             font-size: 1.2rem;
//             font-weight: 500;
//             margin-bottom: 1rem;
//           }

//           .hash-info {
//             background: white;
//             padding: 1rem;
//             border-radius: 4px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             gap: 1rem;
//           }

//           code {
//             background: #f5f5f5;
//             padding: 0.25rem 0.5rem;
//             border-radius: 4px;
//             font-family: monospace;
//           }

//           .copy-btn {
//             padding: 0.25rem 0.75rem;
//             background: #2196F3;
//             color: white;
//             border: none;
//             border-radius: 4px;
//             cursor: pointer;
//             font-size: 0.9rem;
//           }

//           .copy-btn:hover {
//             background: #1976D2;
//           }

//           @media (max-width: 768px) {
//             .issue-certificate {
//               padding: 1rem;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default CertificateIssuance;