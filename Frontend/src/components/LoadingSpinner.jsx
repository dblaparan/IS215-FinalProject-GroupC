import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Processing your image...</p>
      <p className="loading-subtext">This may take a few moments</p>
    </div>
  );
};

export default LoadingSpinner;