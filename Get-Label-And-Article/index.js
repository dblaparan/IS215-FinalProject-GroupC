const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const bucket = process.env.BUCKET_NAME;
  const imageKey = event.queryStringParameters?.imageKey;

  if (!imageKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing 'imageKey' parameter" }),
    };
  }

  const baseName = imageKey.split('/').pop().split('.')[0];
  const labelKey = `labels/${baseName}_labels.json`;
  const articleKey = `articles/${baseName}_article.json`;

  const result = {};

  try {
    const labelData = await s3.getObject({ Bucket: bucket, Key: labelKey }).promise();
    result.labels = JSON.parse(labelData.Body.toString());
  } catch (err) {
    if (err.code === 'NoSuchKey') {
      console.warn(`Label file not found: ${labelKey}`);
    } else {
      console.error('Label file error:', err);
    }
  }

  try {
    const articleData = await s3.getObject({ Bucket: bucket, Key: articleKey }).promise();
    result.article = JSON.parse(articleData.Body.toString());
  } catch (err) {
    if (err.code === 'NoSuchKey') {
      console.warn(`Article file not found: ${articleKey}`);
    } else {
      console.error('Article file error:', err);
    }
  }

  if (!result.labels && !result.article) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'No label or article data found for the given imageKey.' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
