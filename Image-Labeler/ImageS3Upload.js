import React, { useState } from 'react';
import '../styles/ImageS3Upload.css';

function ImageS3Upload({ onUploadStart, onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);
  const [imageKey, setImageKey] = useState('');
  const [uploadedKey, setUploadedKey] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setImageKey(selected.name);
    setPreview(URL.createObjectURL(selected));
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) return;
    
    if (typeof onUploadStart === 'function') {
      onUploadStart();
    }
    
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
              imageKey: imageKey,
              imageData: base64,
            }),
          }
        );

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed with status ${uploadResponse.status}`);
        }

        const uploadData = await uploadResponse.json();
        setUploadedKey(uploadData.key);
        
        const imageUrl = `https://is215-image-labeling.s3.amazonaws.com/${uploadData.key}`;
        
        const url = `https://4o536nhnq5.execute-api.us-east-1.amazonaws.com/getLabels?imageKey=${encodeURIComponent(uploadData.key.replace('uploads/', ''))}`;
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
      }
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
      {uploadedKey && <p>Uploaded to: {uploadedKey}</p>}
    </div>
  );
}

export default ImageS3Upload;