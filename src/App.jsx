import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Banner from './components/Banner';
import Home from './components/Home';
import CertificateIssuance from './components/CertificateIssuance';
import VerificationPortal from './components/VerificationPortal';
import Institutions from './components/Institutions';
import InstitutionRegistration from './components/InstitutionRegistration';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<><Banner /><Home /></>} />
            <Route path="/issue" element={<CertificateIssuance />} />
            <Route path="/verify" element={<VerificationPortal />} />
            <Route path="/institutions" element={<Institutions />} />
            <Route path="/contact" element={<InstitutionRegistration />} />
          </Routes>
        </main>
      </div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;
