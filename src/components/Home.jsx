import React from 'react';

function Home() {
  return (
    <div className="home-container">
      <div className="content">
        <img src="/certificate-check.png" alt="Certificate" className="hero-icon" />
        <h1>Blockchain Certificate System</h1>
        <p>Secure, Verifiable, and Immutable Digital Certificates</p>
      </div>

      <style jsx>{`
        .home-container {
          min-height: calc(40vh - 10px);
          background: linear-gradient(135deg, #3498db, #2980b9);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .content {
          text-align: center;
          color: white;
        }

        .hero-icon {
          width: 120px;
          height: 120px;
          margin-bottom: 2rem;
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.25rem;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}

export default Home;