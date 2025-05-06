import React, { useState } from 'react';
import '../styles/ImageS3Upload.css';

const ImageS3Upload = ({ onUploadStart, onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);
  const [uploadedKey, setUploadedKey] = useState('');
  
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
  
  const handleUpload = async () => {
    if (!file) return;
    
    if (typeof onUploadStart === 'function') {
      onUploadStart();
    }
  
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const uniqueFileName = `${timestamp}-${file.name}`;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      
      try {
        setMessage('Uploading to S3...');
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
              contentType: file.type // Send content type to Lambda
            }),
          }
        );
        
        if (!uploadResponse.ok) {
          throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }
        
        const uploadData = await uploadResponse.json();
        setUploadedKey(uploadData.key);
        
        const imageUrl = `https://is215-image-labeling.s3.amazonaws.com/${uploadData.key}`;
        console.log('Image URL:', imageUrl); // For debugging
      
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
        setMessage(data.message || 'Upload complete!');
        
        if (typeof onAnalysisComplete === 'function') {
          onAnalysisComplete(data, imageUrl);
        }
        
      } catch (error) {
        setMessage('❌ Error: ' + error.message);
        console.error('Upload error:', error);
      }
    };
    
    reader.onerror = () => {
      setMessage('❌ Error reading file');
    };
    
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="app-container">
      <h1>Image Upload to S3</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" className="image-preview" />}
      <button onClick={handleUpload} disabled={!file}>Upload Image</button>
      <p className="status">{message}</p>
      {uploadedKey && (
        <div>
          <p>Uploaded to: {uploadedKey}</p>
          <a 
            href={`https://is215-image-labeling.s3.amazonaws.com/${uploadedKey}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View uploaded image
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageS3Upload;