const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    console.log(`Processing image: s3://${bucket}/${key}`);

    // Step 1: Detect labels using Rekognition
    const detectLabelsResponse = await rekognition.detectLabels({
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: key
        }
      },
      MaxLabels: 10,
      MinConfidence: 70
    }).promise();

    const labels = detectLabelsResponse.Labels.map(label => ({
      Name: label.Name,
      Confidence: label.Confidence
    }));

    console.log('Detected labels:', labels);

    // Step 2: Save labels to a new JSON file in S3
    const outputKey = key.replace(/\.[^/.]+$/, '') + '_labels.json'; // e.g., photo.jpg → photo_labels.json

    const putResult = await s3.putObject({
      Bucket: bucket,
      Key: outputKey,
      Body: JSON.stringify(labels, null, 2),
      ContentType: 'application/json'
    }).promise();

    console.log(`Labels saved to s3://${bucket}/${outputKey}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Image processed and labels saved',
        outputKey: outputKey
      })
    };

  } catch (error) {
    console.error('Error processing image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
