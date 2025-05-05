const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { imageKey, imageData } = body;

    const buffer = Buffer.from(imageData, 'base64');
    const key = imageKey ? `uploads/${imageKey}` : `uploads/${uuidv4()}.jpg`;

    await s3.putObject({
      Bucket: 'is215-image-labeling',
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Image uploaded to S3',
        key: key
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to upload image',
        error: err.message
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
