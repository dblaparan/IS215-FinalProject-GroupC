import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1]; // strip base64 header

      try {
        setMessage('Uploading...');
        const response = await fetch('https://98jf4348gh.execute-api.us-east-1.amazonaws.com/directupload-s3bucket/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'image/jpeg',
          },
          body: base64,
        });

        const data = await response.json();
        setMessage(data.message || 'Upload complete!');
      } catch (error) {
        setMessage('❌ Upload failed: ' + error.message);
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
    </div>
  );
}

export default App;