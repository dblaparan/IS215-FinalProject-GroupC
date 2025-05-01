import React, { useState } from 'react';
import '../styles/NewsArticleUI.css';

import articleImage from 'public/images/article-image-001.jpg';

const NewsArticleUI = () => {

  // Sample news articles data for demonstration purposes onli
  const [articles] = useState([
    {
      id: 1,
      title: "Enthusiastic Crowd Gathers for Intense Basketball Game with a Technological Twist",
      category: "Sports",
      author: "John Doe",
      date: "May 2, 2025",
      image: articleImage,
      summary: "In a thrilling basketball game that captivated spectators, the fervor for the sport was palpable as players showcased their skills with the precision of professionals.",
      content: "In a thrilling basketball game that captivated spectators, the fervor for the sport was palpable as players showcased their skills with the precision of professionals. With a focus on the ball, basketball, and sporting activities with high confidence levels, it was evident that the game resonated with fans of all ages. The court was filled with adult male participants, donning various clothing styles and sporting hats, while accessories like glasses added a touch of flair to the scene. Surprisingly, as the action unfolded, a notable presence of electronic devices including laptops and PCs among the crowd highlighted the modern convergence of sports and technology in today's digital age. The game not only united players and fans but also showcased the fusion of athleticism and innovation, creating an unforgettable experience for all involved."
    }
  ]);

  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleBackClick = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="news-container">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="header-title">IS215 Group C</h1>
        </div>
      </header>

      <main className="main-content container">
        {selectedArticle ? (
          // Article Full Details View
          <div className="article-detail">
            <button 
              onClick={handleBackClick}
              className="back-button"
            >
              Back to News
            </button>
            
            {/* Article Image */}
            <div className="article-image-container">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title}
                className="article-detail-image"
              />
            </div>
            
            {/* Article Category and Date */}
            <span className="article-meta">{selectedArticle.category} | {selectedArticle.date}</span>
            
            {/* Article Title */}
            <h2 className="article-title">{selectedArticle.title}</h2>
            <p className="article-author">By {selectedArticle.author}</p>
            
            <div className="article-divider"></div>
            
            {/* Article Body */}
            <p className="article-summary">{selectedArticle.summary}</p>
            <p className="article-content">{selectedArticle.content}</p>
          </div>
        ) : (
          // News List View
          <div>
            <h2 className="section-title">Latest News</h2>
            <div className="articles-grid">
              {articles.map(article => (
                <div 
                  key={article.id} 
                  className="article-card"
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="article-image-container">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="article-image"
                    />
                  </div>
                  <span className="article-category">{article.category}</span>
                  <h3 className="article-card-title">{article.title}</h3>
                  <p className="article-card-meta">{article.date} • By {article.author}</p>
                  <p className="article-card-summary">{article.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer-text">© 2025 IS215 Group C. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NewsArticleUI;