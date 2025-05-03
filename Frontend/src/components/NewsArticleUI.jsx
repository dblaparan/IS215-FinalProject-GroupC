import React, { useState } from 'react';
import './NewsArticleUI.css';

const NewsArticle = ({ article, imageUrl, analysisData }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  if (!article) return null;

  // Prepare labels for display
  const formatLabels = () => {
    if (!analysisData || !analysisData.Labels) return [];
    return analysisData.Labels
      .sort((a, b) => b.Confidence - a.Confidence)
      .map(label => ({
        name: label.Name,
        confidence: label.Confidence.toFixed(1)
      }));
  };

  return (
    <div className="news-article">
      {/* Header */}
      <header className="article-header">
        <h2>{article.title}</h2>
        <div className="article-info">
          <span>{article.category}</span>
          <span>•</span>
          <span>{article.date}</span>
        </div>
      </header>

      {/* Content */}
      <div className="article-content">
        <div className="article-image-container">
          <img src={imageUrl || article.image} alt="Article" className="article-image" />
        </div>
        <p className="article-author">By {article.author}</p>
        <div className="article-text">
          {article.content.split('\n\n').map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>

      {/* Analysis Toggle */}
      <div className="article-footer">
        <button 
          className="analysis-toggle"
          onClick={() => setShowAnalysis(!showAnalysis)}
        >
          {showAnalysis ? 'Hide Analysis Details' : 'Show Analysis Details'}
        </button>

        {showAnalysis && (
          <div className="analysis-details">
            <h3>Image Analysis</h3>

            <div className="labels-container">
              {formatLabels().map((label, index) => (
                <div key={index} className="label-item">
                  <span className="label-name">{label.name}</span>
                  <span className="label-confidence">{label.confidence}%</span>
                </div>
              ))}
            </div>

            {analysisData.FaceDetails?.length > 0 && (
              <div className="faces-details">
                <h4>Faces Detected: {analysisData.FaceDetails.length}</h4>
                {analysisData.FaceDetails.map((face, index) => (
                  <div key={index} className="face-item">
                    <p>Face #{index + 1}</p>
                    {face.Gender && (
                      <p>Gender: {face.Gender.Value} ({face.Gender.Confidence.toFixed(1)}%)</p>
                    )}
                    {face.AgeRange && (
                      <p>Age range: {face.AgeRange.Low} - {face.AgeRange.High}</p>
                    )}
                    {face.Emotions?.length > 0 && (
                      <p>Primary emotion: {face.Emotions[0].Type} ({face.Emotions[0].Confidence.toFixed(1)}%)</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {analysisData.CelebrityFaces?.length > 0 && (
              <div className="celebrity-details">
                <h4>Celebrities Detected:</h4>
                <ul>
                  {analysisData.CelebrityFaces.map((celeb, index) => (
                    <li key={index}>
                      {celeb.Name} ({celeb.MatchConfidence.toFixed(1)}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsArticleUI;
