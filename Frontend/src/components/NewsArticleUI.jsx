import React, { useState } from 'react';
import '../styles/NewsArticleUI.css';

const ModernNewsArticleUI = ({ article, imageUrl, analysisData }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

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

  const renderLabelsByCategory = () => {
    const grouped = groupLabelsByCategory();
    
    if (activeTab !== 'all') {
      return (
        <div className="label-grid">
          {grouped[activeTab].map((label, index) => (
            <div key={index} className="label-card">
              <span className="label-name">{label.name}</span>
              <span className="label-confidence">{label.confidence}%</span>
            </div>
          ))}
        </div>
      );
    }
    
    return Object.entries(grouped).map(([category, labels]) => {
      if (labels.length === 0) return null;
      
      return (
        <div key={category} className="category-section">
          <h5 className="category-title">
            {category.charAt(0).toUpperCase() + category.slice(1)}
            <span className="category-count">{labels.length}</span>
          </h5>
          <div className="label-grid">
            {labels.map((label, index) => (
              <div key={index} className="label-card">
                <span className="label-name">{label.name}</span>
                <span className="label-confidence">{label.confidence}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  const getCategoryCount = (categoryName) => {
    const grouped = groupLabelsByCategory();
    return grouped[categoryName]?.length || 0;
  };

  const renderFaceDetails = () => {
    if (!analysisData.FaceDetails?.length) return null;
    
    return analysisData.FaceDetails.map((face, index) => (
      <div key={index} className="face-card">
        <div className="face-header">
          <h5>Face #{index + 1}</h5>
        </div>
        
        <div className="face-attributes">
          <div className="attribute-row">
            {face.Gender && (
              <div className="attribute">
                <span className="attribute-label">Gender</span>
                <span className="attribute-value">{face.Gender.Value}</span>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${face.Gender.Confidence}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {face.AgeRange && (
              <div className="attribute">
                <span className="attribute-label">Age Range</span>
                <span className="attribute-value">{face.AgeRange.Low} - {face.AgeRange.High} years</span>
              </div>
            )}
          </div>
          
          <div className="attribute-row">
            {face.Emotions?.length > 0 && (
              <div className="attribute">
                <span className="attribute-label">Primary Emotion</span>
                <span className="attribute-value">{face.Emotions[0].Type.toLowerCase()}</span>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${face.Emotions[0].Confidence}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="attribute-row">
            {face.Smile && (
              <div className="attribute">
                <span className="attribute-label">Smiling</span>
                <span className="attribute-value">{face.Smile.Value ? 'Yes' : 'No'}</span>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${face.Smile.Confidence}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {face.Eyeglasses && (
              <div className="attribute">
                <span className="attribute-label">Eyeglasses</span>
                <span className="attribute-value">{face.Eyeglasses.Value ? 'Yes' : 'No'}</span>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${face.Eyeglasses.Confidence}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="modern-news-article">
      {/* Header */}
      <header className="article-header">
        <div className="article-meta">
          <span className="article-category">{article.category}</span>
          <span className="article-date">{article.date}</span>
        </div>
        <h1 className="article-title">{article.title}</h1>
        <div className="article-byline">
          <div className="author-avatar">
            {article.author.charAt(0).toUpperCase()}
          </div>
          <span>By {article.author}</span>
        </div>
      </header>
      
      {/* Content */}
      <div className="article-content">
        {/* Main Content Column */}
        <div className="article-main">
          {imageUrl && (
            <div className="article-image-container">
              <img src={imageUrl} alt={article.title} className="article-image" />
              {analysisData && (
                <div className="image-analysis-badge" onClick={() => setShowAnalysis(!showAnalysis)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  AI Analysis Available
                </div>
              )}
            </div>
          )}
          
          <div className="article-body">
            {article.content.split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>
      </div>
      
      {/* Analysis Section */}
      <div className={`analysis-section ${showAnalysis ? 'expanded' : ''}`}>
        <div className="analysis-toggle-container">
          <button 
            className="analysis-toggle" 
            onClick={() => setShowAnalysis(!showAnalysis)}
          >
            <span className="toggle-icon">
              {showAnalysis ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </span>
            {showAnalysis ? 'Hide Analysis Details' : 'Show AI Image Analysis'}
          </button>
        </div>
        
        {showAnalysis && (
          <div className="analysis-details">
            <div className="analysis-header">
              <h3>
                <span className="aws-logo">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M9.8 11.83l1.5-1.5 1.5 1.5 1.2-1.2-2.7-2.7-2.7 2.7 1.2 1.2z M3 12l1.5-1.5L6 12l1.2-1.2-2.7-2.7-2.7 2.7L3 12z M16.8 12l1.5-1.5 1.5 1.5 1.2-1.2-2.7-2.7-2.7 2.7 1.2 1.2z M9.8 5.8l1.5-1.5 1.5 1.5 1.2-1.2-2.7-2.7-2.7 2.7 1.2 1.2z M16.8 5.8l1.5-1.5 1.5 1.5 1.2-1.2-2.7-2.7-2.7 2.7 1.2 1.2z M9.8 17.8l1.5-1.5 1.5 1.5 1.2-1.2-2.7-2.7-2.7 2.7 1.2 1.2z M3 18l1.5-1.5L6 18l1.2-1.2-2.7-2.7-2.7 2.7L3 18z M16.8 18l1.5-1.5 1.5 1.5 1.2-1.2-2.7-2.7-2.7 2.7 1.2 1.2z" />
                  </svg>
                </span>
                AWS Rekognition Analysis
              </h3>
            </div>
            
            {/* Labels Section with Tabs */}
            {formatLabels().length > 0 && (
              <div className="analysis-card">
                <div className="card-header">
                  <h4>Detected Objects and Scenes</h4>
                  <div className="category-tabs">
                    <button 
                      className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveTab('all')}
                    >
                      All <span className="tab-count">{formatLabels().length}</span>
                    </button>
                    
                    {['objects', 'nature', 'scenes', 'activities'].map(category => {
                      const count = getCategoryCount(category);
                      if (count === 0) return null;
                      
                      return (
                        <button 
                          key={category}
                          className={`tab-button ${activeTab === category ? 'active' : ''}`}
                          onClick={() => setActiveTab(category)}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                          <span className="tab-count">{count}</span>
                        </button>
                      );
                    })}
                    
                    {getCategoryCount('other') > 0 && (
                      <button 
                        className={`tab-button ${activeTab === 'other' ? 'active' : ''}`}
                        onClick={() => setActiveTab('other')}
                      >
                        Other <span className="tab-count">{getCategoryCount('other')}</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="card-content">
                  {renderLabelsByCategory()}
                </div>
              </div>
            )}

            {/* Face Analysis Section */}
            {analysisData.FaceDetails?.length > 0 && (
              <div className="analysis-card">
                <div className="card-header">
                  <h4>Face Analysis</h4>
                  <span className="badge">
                    {analysisData.FaceDetails.length} {analysisData.FaceDetails.length === 1 ? 'face' : 'faces'} detected
                  </span>
                </div>
                
                <div className="card-content">
                  <div className="face-grid">
                    {renderFaceDetails()}
                  </div>
                </div>
              </div>
            )}

            {/* Celebrity Recognition Section */}
            {analysisData.CelebrityFaces?.length > 0 && (
              <div className="analysis-card">
                <div className="card-header">
                  <h4>Celebrity Recognition</h4>
                  <span className="badge">
                    {analysisData.CelebrityFaces.length} {analysisData.CelebrityFaces.length === 1 ? 'celebrity' : 'celebrities'}
                  </span>
                </div>
                
                <div className="card-content">
                  <div className="celebrity-grid">
                    {analysisData.CelebrityFaces.map((celeb, index) => (
                      <div key={index} className="celebrity-card">
                        <div className="celebrity-icon">👤</div>
                        <div className="celebrity-info">
                          <h5>{celeb.Name}</h5>
                          <div className="confidence-bar">
                            <div 
                              className="confidence-fill" 
                              style={{ width: `${celeb.MatchConfidence}%` }}
                            ></div>
                            <span className="confidence-label">{celeb.MatchConfidence.toFixed(1)}% match</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Text Detection Section */}
            {analysisData.TextDetections?.length > 0 && (
              <div className="analysis-card">
                <div className="card-header">
                  <h4>Text Detection</h4>
                  <span className="badge">
                    {analysisData.TextDetections.length} {analysisData.TextDetections.length === 1 ? 'text' : 'texts'} found
                  </span>
                </div>
                
                <div className="card-content">
                  <div className="text-grid">
                    {analysisData.TextDetections.map((text, index) => (
                      <div key={index} className="text-card">
                        <span className="detected-text">"{text.DetectedText}"</span>
                        <div className="confidence-pill">
                          {text.Confidence.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Analysis Timestamp */}
            <div className="analysis-footer">
              <div className="aws-badge">
                <span className="aws-logo-small">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M9.8 11.83l1.5-1.5 1.5 1.5 1.2-1.2-2.7-2.7-2.7 2.7 1.2 1.2z M3 12l1.5-1.5L6 12l1.2-1.2-2.7-2.7-2.7 2.7L3 12z M16.8 12l1.5-1.5 1.5 1.5 1.2-1.2-2.7-2.7-2.7 2.7 1.2 1.2z" />
                  </svg>
                </span>
                Powered by AWS Rekognition
              </div>
              
              {analysisData.timestamp && (
                <div className="timestamp">
                  Analysis performed on {new Date(analysisData.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernNewsArticleUI;