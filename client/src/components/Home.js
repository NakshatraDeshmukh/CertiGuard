import React, { useRef } from 'react';
import './home.css';

const Home = () => {
  const featuresRef = useRef(null);

  const handleLearnMoreClick = () => {
    featuresRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h2>Welcome To CertiGuard !</h2>
          <button className="learn-more-button" onClick={handleLearnMoreClick}>
            Learn More
          </button>
        </div>
      </div>
      <div className="features-section" ref={featuresRef}>
        <h3>Why CertiGuard?</h3>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h4>Blockchain-Based Security</h4>
            <p>Utilizes blockchain technology to ensure that certificates are secure, tamper-proof, and easily verifiable.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🚫</div>
            <h4>Fraud Prevention</h4>
            <p>Prevents the creation of duplicate or fraudulent certificates, ensuring the authenticity of every credential.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📋</div>
            <h4>Detailed Records</h4>
            <p>Displays all relevant details of certificates, including student and university information, in a clear and organized manner.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
