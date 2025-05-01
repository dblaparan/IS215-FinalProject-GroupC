import React, { useState } from 'react';
import './App.css';

function App() {
  const [preview, setPreview] = useState(null);
  const [articleText, setArticleText] = useState(
    'Upload an image to view a related news article here. This section will dynamically update based on the uploaded file.'
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      setPreview(event.target.result);

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
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="App">
      <h1>IS215 - Advanced Computer Systems</h1>
      <h2>Group C - Final Project</h2>

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

      {/* News Article */}
      <div className="container news-article">
        <div className="label">News Article</div>
        <p id="newsContent">{articleText}</p>
      </div>
    </div>
  );
}

export default App;
