import React, { useState } from 'react';
import './RetrieveCertificate.css';

function RetrieveCertificate() {
  const [studentAddress, setStudentAddress] = useState('');
  const [studentId, setStudentId] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState('');

  const handleRetrieve = () => {
    setError('');
    if (!studentAddress.trim() || !studentId.trim()) {
      setCertificateData(null);
      setError('Please enter both Student Ethereum Address and Student ID.');
      return;
    }
    const data = sessionStorage.getItem(studentAddress.trim());
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.metadata && parsed.metadata.studentId === studentId.trim()) {
        setCertificateData(parsed);
      } else {
        setCertificateData(null);
        setError('No certificate found for this address and student ID.');
      }
    } else {
      setCertificateData(null);
      setError('No certificate found for this address.');
    }
  };

  return (
    <div className="retrieve-container">
      <h2 className="title">🎓 Retrieve Issued Certificate</h2>

      <div className="form-group">
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter Student Blockchain Address"
          value={studentAddress}
          onChange={(e) => setStudentAddress(e.target.value)}
          className="input"
        />
      </div>
      <div className="form-group">
        <button onClick={handleRetrieve} className="retrieve-btn">
          🔍 Retrieve Certificate
        </button>
      </div>

      {error && <div className="result-box error">❌ {error}</div>}

      {certificateData && (
        <div className="result-box success">
          <h3>📄 Certificate Details</h3>
          <div className="details">
            <p><strong>Name:</strong> {certificateData.metadata.studentName}</p>
            <p><strong>Student ID:</strong> {certificateData.metadata.studentId}</p>
            <p><strong>Program:</strong> {certificateData.metadata.courseProgram}</p>
            <p><strong>Grade:</strong> {certificateData.metadata.grade}</p>
            <p><strong>Completion Date:</strong> {certificateData.metadata.completionDate}</p>
            <p><strong>Institution:</strong> {certificateData.metadata.institutionCategory}</p>
            <p><strong>Institution Address:</strong> {certificateData.metadata.institutionAddress}</p>
            <p><strong>Issued On:</strong> {new Date(certificateData.metadata.issueDate).toLocaleString()}</p>
            <p><strong>Transaction Hash:</strong> <code>{certificateData.hash}</code></p>
          </div>
          <button
            className="copy-btn"
            onClick={() => navigator.clipboard.writeText(certificateData.hash)}
          >
            📋 Copy Hash
          </button>
        </div>
      )}
    </div>
  );
}

export default RetrieveCertificate;
