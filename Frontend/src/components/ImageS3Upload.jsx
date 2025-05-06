import React, { useState, useRef } from 'react';
import '../styles/ImageS3Upload.css';

const ImageS3Upload = ({ onUploadStart, onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);
  const [uploadedKey, setUploadedKey] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    
    // Validate file
    if (!selected.type.startsWith('image/')) {
      setMessage('Please select an image file');
      return;
    }
    
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setMessage('');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return;
    
    if (typeof onUploadStart === 'function') {
      onUploadStart();
    }

    setIsUploading(true);
    setUploadProgress(10); // Start progress indication

    const timestamp = new Date().getTime();
    const uniqueFileName = `${timestamp}-${file.name}`;
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      
      try {
        setMessage('Uploading to cloud storage...');
        setUploadProgress(30);
        
        const uploadResponse = await fetch(
          'https://4o536nhnq5.execute-api.us-east-1.amazonaws.com/upload',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageKey: uniqueFileName,
              imageData: base64,
              contentType: file.type
            }),
          }
        );

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }

        setUploadProgress(60);
        
        const uploadData = await uploadResponse.json();
        setUploadedKey(uploadData.key);
        const imageUrl = `https://is215-image-labeling.s3.amazonaws.com/${uploadData.key}`;
        
        setUploadProgress(80);
        setMessage('Analyzing image...');
        
        const keyForLabels = uploadData.key.includes('uploads/')
          ? uploadData.key.replace('uploads/', '')
          : uploadData.key;
          
        const url = `https://4o536nhnq5.execute-api.us-east-1.amazonaws.com/getLabels?imageKey=${encodeURIComponent(keyForLabels)}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        setUploadProgress(100);
        setIsUploading(false);
        setMessage(data.message || 'Upload complete!');
        
        if (typeof onAnalysisComplete === 'function') {
          onAnalysisComplete(data, imageUrl);
        }
      } catch (error) {
        setIsUploading(false);
        setUploadProgress(0);
        setMessage('❌ Error: ' + error.message);
        console.error('Upload error:', error);
      }
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      setUploadProgress(0);
      setMessage('❌ Error reading file');
    };
    
    reader.readAsDataURL(file);
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setMessage('');
    setUploadedKey('');
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <div className="modern-upload-container">
      <div className="upload-header">
        <h1>Upload Image</h1>
        <p className="upload-subtitle">Upload and generate article</p>
      </div>
      
      <div className="upload-area">
        {!preview ? (
          <div className="drop-zone" onClick={triggerFileInput}>
            <div className="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p>Drag & drop an image or click to browse</p>
          </div>
        ) : (
          <div className="preview-container">
            <img src={preview} alt="preview" className="image-preview" />
            {!isUploading && !uploadedKey && (
              <div className="preview-overlay">
                <button className="choose-btn" onClick={triggerFileInput}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                  Change
                </button>
              </div>
            )}
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef}
          className="file-input" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>

      {isUploading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className="progress-text">{uploadProgress}% complete</p>
        </div>
      )}

      {message && <p className={`status ${message.includes('Error') ? 'error' : ''}`}>{message}</p>}
      
      <div className="action-buttons">
        {file && !uploadedKey && !isUploading && (
          <button className="upload-btn" onClick={handleUpload}>
            Upload & Generate Article
          </button>
        )}
        
        {uploadedKey && (
          <div className="success-container">
            <div className="success-message">
              <div className="success-icon">✓</div>
              <p>Upload successful!</p>
            </div>
            <div className="upload-info">
              <p>Uploaded to: <span className="file-key">{uploadedKey}</span></p>
              <div className="link-container">
                <a
                  href={`https://is215-image-labeling.s3.amazonaws.com/${uploadedKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-link"
                >
                  View image
                </a>
                <button className="reset-btn" onClick={resetUpload}>
                  Upload Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageS3Upload;