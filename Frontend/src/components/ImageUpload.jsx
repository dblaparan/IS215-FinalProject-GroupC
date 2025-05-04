// ImageUpload.jsx
import React, { useState } from 'react';
import '../styles/ImageUpload.css';

function ImageUpload({ onImageUpload, onUploadStart, onAnalysisComplete }) {
  const [preview, setPreview] = useState(null);
  const [articleText, setArticleText] = useState(
    'Upload an image to view a related news article here. This section will dynamically update based on the uploaded file.'
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      setPreview(imageData);
      
      // Generate article based on filename
      const fileName = file.name.toLowerCase();
      let article = "You've uploaded an image.";
      
      if (fileName.includes("network")) {
        article = "This image appears to depict a computer network. In IS215, we explore how systems interconnect.";
      } else if (fileName.includes("hardware")) {
        article = "This hardware image illustrates components we study in computer systems architecture.";
      } else if (fileName.includes("software")) {
        article = "Software concepts, like those shown in this image, are core topics in advanced systems.";
      } else {
        article = "This image supports the visual component of your final project. Make sure it relates clearly to your topic!";
      }
      
      setArticleText(article);
      
      // Call the original onImageUpload callback
      if (onImageUpload) {
        onImageUpload(imageData, article);
      }
      
      // Will automatically start the analysis process 
      if (onUploadStart) {
        onUploadStart();
      }
      
      //This line will simulate AWS Rekognition analysis (will repalce by the actual AWS call)
      setTimeout(() => {
        // Mock AWS Rekognition response (will be replaced by actual AWS response)
        const mockAnalysisResults = {
          Labels: [
            { Name: "Computer", Confidence: 98.5 },
            { Name: "Technology", Confidence: 97.2 },
            { Name: "Electronics", Confidence: 95.2 },
            { Name: "Hardware", Confidence: 92.8 },
            { Name: "Device", Confidence: 91.3 },
            { Name: "Monitor", Confidence: 89.7 },
            { Name: "Screen", Confidence: 86.4 }
          ],
          FaceDetails: fileName.includes("person") ? [
            {
              AgeRange: { Low: 20, High: 30 },
              Gender: { Value: "Male", Confidence: 97.5 },
              Emotions: [
                { Type: "Calm", Confidence: 85.3 },
                { Type: "Happy", Confidence: 12.2 }
              ],
              Smile: { Value: false, Confidence: 92.8 },
              Eyeglasses: { Value: true, Confidence: 95.1 }
            }
          ] : [],
          timestamp: new Date().toISOString()
        };
        
        // Call the callback with analysis results
        if (onAnalysisComplete) {
          onAnalysisComplete(mockAnalysisResults, imageData);
        }
      }, 2000); // Simulate a 2-second processing time 
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Upload Section */}
      <div className="container upload-section">
        <label htmlFor="imageUpload" className="upload-btn">Upload Image</label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      
      {/* Image Preview */}
      <div className="container">
        <div className="label">Image Preview</div>
        {preview ? (
          <img
            id="imagePreview"
            src={preview}
            alt="Preview"
            style={{ display: 'block' }}
          />
        ) : (
          <p>No image uploaded yet.</p>
        )}
      </div>
      
      {/* News Article (only show this if we're not using the external NewsArticleUI component) */}
      {!onAnalysisComplete && (
        <div className="container news-article">
          <div className="label">News Article</div>
          <p id="newsContent">{articleText}</p>
        </div>
      )}
    </>
  );
}

export default ImageUpload;