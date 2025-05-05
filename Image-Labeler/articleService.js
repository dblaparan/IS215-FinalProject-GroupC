import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://4o536nhnq5.execute-api.us-east-1.amazonaws.com/';

export const uploadImage = async (imageFile) => {
  try {
    const base64Image = await fileToBase64(imageFile);
    const response = await axios.post(
      `${API_URL}/upload`,
      { image: base64Image },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const checkProcessingStatus = async (imageId) => {
  try {
    const response = await axios.get(`${API_URL}/status/${imageId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking processing status:', error);
    throw error;
  }
};

export const getArticle = async (imageId) => {
  try {
    const response = await axios.get(`${API_URL}/article/${imageId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

export const getAnalysis = async (imageId) => {
  try {
    const response = await axios.get(`${API_URL}/analysis/${imageId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    throw error;
  }
};

export const getArticleAndAnalysis = async (imageId) => {
  try {
    const [articleResponse, analysisResponse] = await Promise.all([
      getArticle(imageId),
      getAnalysis(imageId)
    ]);
    const imageUrl = `https://is215-image-labeling.s3.amazonaws.com/uploads/${imageId}.jpg`;
    return {
      article: articleResponse,
      analysisData: analysisResponse,
      imageUrl
    };
  } catch (error) {
    console.error('Error fetching article and analysis:', error);
    throw error;
  }
};
