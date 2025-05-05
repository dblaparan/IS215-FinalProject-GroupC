const AWS = require('aws-sdk');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const s3 = new AWS.S3({ region: 'us-east-1' });
const rekognition = new AWS.Rekognition({ region: 'us-east-1' });

const BUCKET_NAME = 'is215-image-labeling';

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    const httpMethod = event.httpMethod || event.requestContext?.http?.method;
    const path = event.path || event.rawPath;

    const route = getRoute(path, httpMethod);
    console.log(`Processing route: ${route}`);

    switch (route) {
      case 'upload-image':
        return await handleImageUpload(event);
      case 'process-image':
        return await handleImageProcessing(event);
      case 'generate-article':
        return await handleArticleGeneration(event);
      case 'get-status':
        return await handleGetStatus(event);
      case 'get-article':
        return await handleGetArticle(event);
      case 'get-analysis':
        return await handleGetAnalysis(event);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid operation' }),
          headers: corsHeaders()
        };
    }
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: err.message 
      }),
      headers: corsHeaders()
    };
  }
};

function getRoute(path, method) {
  if (!path) return 'unknown';

  const pathParts = path.split('/').filter(part => part.length > 0);

  if (method === 'POST' && (path.includes('/upload') || pathParts[0] === 'upload')) return 'upload-image';
  if (method === 'POST' && path.includes('/process') && pathParts.length >= 2) return 'process-image';
  if (method === 'POST' && path.includes('/generate') && pathParts.length >= 2) return 'generate-article';
  if (method === 'GET' && path.includes('/status') && pathParts.length >= 2) return 'get-status';
  if (method === 'GET' && path.includes('/article') && pathParts.length >= 2) return 'get-article';
  if (method === 'GET' && path.includes('/analysis') && pathParts.length >= 2) return 'get-analysis';

  if (!method) {
    if (event.operation === 'upload') return 'upload-image';
    if (event.operation === 'process') return 'process-image';
    if (event.operation === 'generate') return 'generate-article';
    if (event.operation === 'status') return 'get-status';
    if (event.operation === 'article') return 'get-article';
    if (event.operation === 'analysis') return 'get-analysis';
  }

  return 'unknown';
}

function getImageId(event) {
  if (event.pathParameters && event.pathParameters.imageId) {
    return event.pathParameters.imageId;
  }

  const path = event.path || event.rawPath || '';
  const pathParts = path.split('/').filter(part => part.length > 0);

  for (let i = 0; i < pathParts.length - 1; i++) {
    if (['status', 'article', 'analysis', 'process', 'generate'].includes(pathParts[i])) {
      return pathParts[i + 1];
    }
  }

  if (event.body) {
    try {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      if (body.imageId) return body.imageId;
    } catch (e) {
      console.log('Error parsing body:', e);
    }
  }

  return event.imageId || null;
}

async function handleImageUpload(event) {
  try {
    let base64Image;
    const body = parseBody(event);

    if (body.image) {
      base64Image = body.image;
    } else if (body.base64Image) {
      base64Image = body.base64Image;
    } else if (typeof body === 'string' && body.includes('base64')) {
      base64Image = body;
    }

    if (!base64Image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No image data provided' }),
        headers: corsHeaders()
      };
    }

    if (base64Image.includes(',')) {
      base64Image = base64Image.split(',')[1];
    }

    const buffer = Buffer.from(base64Image, 'base64');
    const imageId = uuidv4();
    const imageKey = `uploads/${imageId}.jpg`;
    const contentType = getContentType(event) || 'image/jpeg';

    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: imageKey,
      Body: buffer,
      ContentType: contentType
    }).promise();

    processImage(imageId, imageKey).catch(err => {
      console.error('Background processing error:', err);
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Image uploaded successfully',
        imageId,
        status: 'processing',
        progress: 0
      }),
      headers: corsHeaders()
    };
  } catch (err) {
    console.error('Upload error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Failed to upload image',
        error: err.message 
      }),
      headers: corsHeaders()
    };
  }
}

async function processImage(imageId, imageKey) {
  try {
    const rekognitionParams = {
      Image: { S3Object: { Bucket: BUCKET_NAME, Name: imageKey } },
      MaxLabels: 50,
      MinConfidence: 70
    };

    const detectLabelsResponse = await rekognition.detectLabels(rekognitionParams).promise();

    const hasPersonLabel = detectLabelsResponse.Labels.some(
      label => label.Name === 'Person' && label.Confidence > 80
    );

    let detectFacesResponse = null;
    if (hasPersonLabel) {
      const faceParams = {
        Image: { S3Object: { Bucket: BUCKET_NAME, Name: imageKey } },
        Attributes: ['ALL']
      };

      detectFacesResponse = await rekognition.detectFaces(faceParams).promise();
    }

    const analysisData = {
      Labels: detectLabelsResponse.Labels,
      FaceDetails: detectFacesResponse ? detectFacesResponse.FaceDetails : [],
      timestamp: new Date().toISOString()
    };

    const analysisKey = `analysis/${imageId}_analysis.json`;

    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: analysisKey,
      Body: JSON.stringify(analysisData, null, 2),
      ContentType: 'application/json'
    }).promise();

    await generateArticle(imageId, analysisKey, analysisData);
  } catch (err) {
    console.error('Error processing image:', err);
    throw err;
  }
}