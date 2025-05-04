import React, { useState } from 'react';
import '../styles/NewsArticleUI.css';

const NewsArticleUI = ({ article, imageUrl, analysisData }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  if (!article) return null;

  const formatLabels = () => {
    if (!analysisData || !analysisData.Labels) return [];
    return analysisData.Labels
      .sort((a, b) => b.Confidence - a.Confidence)
      .map(label => ({
        name: label.Name,
        confidence: label.Confidence.toFixed(1)
      }));
  };

  const groupLabelsByCategory = () => {
    const labels = formatLabels();
    
    const categories = {
      objects: ['Person', 'Car', 'Building', 'Animal', 'Furniture', 'Electronics'],
      nature: ['Plant', 'Tree', 'Flower', 'Mountain', 'Water', 'Sky', 'Cloud'],
      activities: ['Running', 'Sitting', 'Walking', 'Eating', 'Driving'],
      scenes: ['Urban', 'City', 'Indoor', 'Outdoor', 'Landscape']
    };
    
    const grouped = {
      objects: [],
      nature: [],
      activities: [],
      scenes: [],
      other: []
    };
    
    labels.forEach(label => {
      let placed = false;
      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => label.name.includes(keyword))) {
          grouped[category].push(label);
          placed = true;
          break;
        }
      }
      if (!placed) {
        grouped.other.push(label);
      }
    });
    
    return grouped;
  };

  return (
    <div className="news-article">
      {/* Header */}
      <header className="article-header">
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          <span className="article-category">{article.category}</span> • <span className="article-date">{article.date}</span>
        </div>
      </header>
      
      {/* Content */}
      <div className="article-content">
        {imageUrl && (
          <div className="article-image-container">
            <img src={imageUrl} alt={article.title} className="article-image" />
          </div>
        )}
        
        <div className="article-byline">By {article.author}</div>
        
        <div className="article-body">
          {article.content.split('\n\n').map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>
      
      {/* Analysis Toggle */}
      <div className="analysis-section">
        <button 
          className="analysis-toggle" 
          onClick={() => setShowAnalysis(!showAnalysis)}
        >
          {showAnalysis ? 'Hide Analysis Details' : 'Show AWS Rekognition Analysis'}
        </button>
        
        {showAnalysis && (
          <div className="analysis-details">
            <h3>AWS Rekognition Image Analysis</h3>
            
            {/* Labels Section */}
            {formatLabels().length > 0 && (
              <div className="analysis-subsection">
                <h4>Detected Objects and Scenes</h4>
                <div className="label-list">
                  {formatLabels().map((label, index) => (
                    <div key={index} className="label-item">
                      <span className="label-name">{label.name}</span>
                      <span className="label-confidence">{label.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Face Analysis Section */}
            {analysisData.FaceDetails?.length > 0 && (
              <div className="analysis-subsection">
                <h4>Face Analysis</h4>
                <div className="face-details">
                  <div className="face-summary">
                    <strong>Faces Detected:</strong> {analysisData.FaceDetails.length}
                  </div>
                  
                  {analysisData.FaceDetails.map((face, index) => (
                    <div key={index} className="face-item">
                      <h5>Face #{index + 1}</h5>
                      <div className="face-attributes">
                        {face.Gender && (
                          <p>
                            <strong>Gender:</strong> {face.Gender.Value} 
                            <span className="confidence-value">({face.Gender.Confidence.toFixed(1)}%)</span>
                          </p>
                        )}
                        
                        {face.AgeRange && (
                          <p>
                            <strong>Age range:</strong> {face.AgeRange.Low} - {face.AgeRange.High}
                          </p>
                        )}
                        
                        {face.Emotions?.length > 0 && (
                          <p>
                            <strong>Primary emotion:</strong> {face.Emotions[0].Type} 
                            <span className="confidence-value">({face.Emotions[0].Confidence.toFixed(1)}%)</span>
                          </p>
                        )}
                        
                        {face.Smile && (
                          <p>
                            <strong>Smiling:</strong> {face.Smile.Value ? 'Yes' : 'No'}
                            <span className="confidence-value">({face.Smile.Confidence.toFixed(1)}%)</span>
                          </p>
                        )}
                        
                        {face.Eyeglasses && (
                          <p>
                            <strong>Eyeglasses:</strong> {face.Eyeglasses.Value ? 'Yes' : 'No'}
                            <span className="confidence-value">({face.Eyeglasses.Confidence.toFixed(1)}%)</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Celebrity Recognition Section */}
            {analysisData.CelebrityFaces?.length > 0 && (
              <div className="analysis-subsection">
                <h4>Celebrity Recognition</h4>
                <div className="celebrity-faces">
                  <ul>
                    {analysisData.CelebrityFaces.map((celeb, index) => (
                      <li key={index}>
                        <strong>{celeb.Name}</strong> 
                        <span className="confidence-value">({celeb.MatchConfidence.toFixed(1)}%)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Text Detection Section - Add if your data includes this */}
            {analysisData.TextDetections?.length > 0 && (
              <div className="analysis-subsection">
                <h4>Text Detection</h4>
                <div className="text-detections">
                  <ul>
                    {analysisData.TextDetections.map((text, index) => (
                      <li key={index}>
                        <span className="detected-text">"{text.DetectedText}"</span>
                        <span className="confidence-value">({text.Confidence.toFixed(1)}%)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Analysis Timestamp */}
            <div className="analysis-footer">
              <p className="timestamp">
                Analysis performed using AWS Rekognition
                {analysisData.timestamp && ` on ${new Date(analysisData.timestamp).toLocaleString()}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsArticleUI;