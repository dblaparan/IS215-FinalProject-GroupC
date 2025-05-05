import React, { useState } from 'react';
import './App.css';
import NewsArticleUI from './components/NewsArticleUI';
import LoadingSpinner from './components/LoadingSpinner';

function ImageUpload({ onUploadStart, onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) return;

    onUploadStart();

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1]; // strip base64 header

      try {
        setMessage('Uploading...');
        const response = await fetch('https://4o536nhnq5.execute-api.us-east-1.amazonaws.com/upload_image', {
          method: 'POST',
          headers: {
            'Content-Type': 'image/jpeg',
          },
          body: base64,
        });

        const data = await response.json();

        const labels = await fetch(`https://4o536nhnq5.execute-api.us-east-1.amazonaws.com/getLabels?imageKey=${data.key}`);
        const analysisData = await labels.json();

        onAnalysisComplete(analysisData, preview);
        setMessage(data.message || 'Upload and analysis complete!');
      } catch (error) {
        setMessage('❌ Upload failed: ' + error.message);
        onAnalysisComplete(null, null);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="upload-container">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" className="image-preview" />}
      <button onClick={handleUpload} disabled={!file}>Upload Image</button>
      <p className="status">{message}</p>
    </div>
  );
}

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sampleArticle = {
    title: "AWS Rekognition Image Analysis",
    category: "Computer Vision",
    date: "May 1, 2025",
    author: "Group C",
    content: "This application demonstrates the power of AWS Rekognition for image analysis.\n\nUpload an image to see detailed analysis including object detection, face analysis, and text recognition.\n\nThis project was created as part of the IS215 Advanced Computer Systems course."
  };

  const handleUploadStart = () => {
    setIsLoading(true);
  };

  const handleAnalysisComplete = (results, uploadedImageUrl) => {
    setAnalysisData(results);
    setImageUrl(uploadedImageUrl);
    setIsLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>IS215 - Advanced Computer Systems</h1>
        <h2>Group C - Final Project</h2>
      </header>

      <main className="App-main">
        <section className="upload-section">
          <ImageUpload
            onUploadStart={handleUploadStart}
            onAnalysisComplete={handleAnalysisComplete}
          />
          {isLoading && <LoadingSpinner />}
        </section>

        {imageUrl && analysisData && (
          <section className="results-section">
            <NewsArticleUI
              article={sampleArticle}
              imageUrl={imageUrl}
              analysisData={analysisData}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
