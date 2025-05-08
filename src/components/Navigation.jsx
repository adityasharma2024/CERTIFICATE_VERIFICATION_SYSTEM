import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <img src="/certificate-check.png" alt="Blockchain" className="nav-logo" />
        <span>Blockchain</span>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/issue" className="nav-link">Issue Certificate</Link>
        <Link to="/contact" className="nav-link">Institution Registration Portal</Link>
        <Link to="/verify" className="nav-link">Verify</Link>
        <Link to="/institutions" className="nav-link">Registered Institutions</Link>
        
      </div>

      <style jsx>{`
        .navigation {
          background: #2c3e50;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .nav-logo {
          width: 32px;
          height: 32px;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .nav-links {
            gap: 1rem;
          }
          
          .nav-link {
            padding: 0.5rem;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navigation;