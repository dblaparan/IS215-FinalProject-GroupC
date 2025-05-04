import React from 'react';
import { ClipLoader } from 'react-spinners';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <ClipLoader color="#007bff" size={60} />
      <p className="loading-text">Processing your image...</p>
      <p className="loading-subtext">This may take a few moments</p>
    </div>
  );
};

export default LoadingSpinner;