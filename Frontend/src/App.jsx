import React, { useState } from 'react';
import './App.css';
import ImageS3Upload from './components/ImageS3Upload';
import NewsArticleUI from './components/NewsArticleUI';
import LoadingSpinner from './components/LoadingSpinner';

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
          <ImageS3Upload
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