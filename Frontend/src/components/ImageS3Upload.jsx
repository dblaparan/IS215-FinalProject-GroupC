import React, { useState } from 'react';
import '../styles/ImageS3Upload.css';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);
  const [imageKey, setImageKey] = useState('');

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

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1]; // Remove data URI prefix

      try {
        setMessage('Uploading to S3...');

        // ✅ Upload to S3 via your backend API
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

      } catch (error) {
        setMessage('❌ Upload failed: ' + error.message);
        return;
      } finally {
        try {
          const response = await fetch(
            `https://4o536nhnq5.execute-api.us-east-1.amazonaws.com/getLabels?imageKey=${encodeURIComponent(imageKey)}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'image/jpeg',
              },
              body: base64, // or just send imageKey if that's what the API expects
            }
          );

          const data = await response.json();
          setMessage(data.message || 'Upload complete!');
        } catch (fetchError) {
          setMessage('❌ Fetch failed: ' + fetchError.message);
        }
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
