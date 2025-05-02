const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event, null, 2));
  
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  
  const params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    },
    MaxLabels: 10,
    MinConfidence: 70
  };

  try {
    const data = await rekognition.detectLabels(params).promise();

    const labelText = data.Labels.map(label =>
      `${label.Name}: ${label.Confidence.toFixed(2)}%`
    ).join('\n');

    const labelFileKey = key.replace(/\.[^.]+$/, '') + '_labels.txt'; // replaces extension with _labels.txt

    const uploadParams = {
      Bucket: bucket,
      Key: `labels/${labelFileKey}`, // stores in a "labels/" folder
      Body: labelText,
      ContentType: 'text/plain'
    };

    await s3.putObject(uploadParams).promise();

    console.log(`Labels written to: labels/${labelFileKey}`);

    return {
      statusCode: 200,
      body: JSON.stringify('Labeling and upload complete')
    };

  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify('Error processing image')
    };
  }
};
