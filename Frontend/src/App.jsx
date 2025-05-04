import React from 'react';
import { ClipLoader } from 'react-spinners';
import './App.css';
import './styles/ImageUpload.css';
import './styles/NewsArticleUI.css';
import './styles/LoadingSpinner.css';


function App() {
    const [preview, setPreview] = useState(null);
    const [articleText, setArticleText] = useState(
      'Upload an image to view a related news article here. This section will dynamically update based on the uploaded file.'
    );
    const [isLoading, setIsLoading] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      setIsLoading(true);
  
      reader.onload = (event) => {
        const imageData = event.target.result;
        setPreview(imageData);
  
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
  
        // Simulate analysis (e.g., AWS Rekognition)
        setTimeout(() => {
          const fakeAnalysis = {
            Labels: [
              { Name: "Computer", Confidence: 98.6 },
              { Name: "Technology", Confidence: 93.2 },
              { Name: "Electronics", Confidence: 89.5 }
            ],
            FaceDetails: [
              {
                Gender: { Value: "Male", Confidence: 99.1 },
                AgeRange: { Low: 25, High: 35 },
                Emotions: [{ Type: "Happy", Confidence: 87.3 }]
              }
            ]
          };
          setAnalysisData(fakeAnalysis);
          setIsLoading(false);
        }, 2000); // Simulate 2s delay
      };
  
      reader.readAsDataURL(file);
    };
  
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
  
        {/* Loading Spinner */}
        {isLoading && (
          <div className="loading-container">
            <ClipLoader color="#007bff" size={60} />
            <p className="loading-text">Processing your image...</p>
            <p className="loading-subtext">This may take a few moments</p>
          </div>
        )}
  
        {/* Image Preview and Article */}
        {!isLoading && (
          <>
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
  
            <div className="container news-article">
              <div className="label">News Article</div>
              <p id="newsContent">{articleText}</p>
            </div>
  
            {/* Analysis */}
            {analysisData && (
              <div className="analysis-details container">
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
              </div>
            )}
          </>
        )}
      </div>
    );
  }

//   return (
//     <div className="App">
//       <h1>IS215 - Advanced Computer Systems</h1>
//       <h2>Group C - Final Project</h2>
//       <ImageUpload />
//     </div>
//   );
// }

export default App;
