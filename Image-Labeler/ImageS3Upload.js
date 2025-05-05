const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  try {
    const base64Image = event.body;
    const buffer = Buffer.from(base64Image, 'base64');

    const contentType = event.headers['Content-Type'] || 'image/jpeg';
    const key = `uploads/${uuidv4()}.jpg`;

    await s3.putObject({
      Bucket: 'your-s3-bucket-name',
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Image uploaded to S3', key }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to upload image' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
