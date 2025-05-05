const AWS = require('aws-sdk');
const generateArticleFromJson = require('./generateArticle.js');
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const record = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

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
    const jsonToSave = { Labels: labels };

    console.log('Detected labels:', labels);

    // Generate output file name
    const baseName = key.split('/').pop().split('.')[0];
    const outputKey = `labels/${baseName}_labels.json`;

    // Upload the JSON file to S3
    await s3.putObject({
      Bucket: bucket,
      Key: outputKey,
      Body: JSON.stringify(jsonToSave, null, 2),
      ContentType: 'application/json'
    }).promise();

   await generateArticleFromJson(outputKey) //added Parameter to be passed
    
    console.log(`✅ Labels file written to ${outputKey}`);
    return {
      statusCode: 200,
      body: `Successfully labeled ${key}`
    };

  } catch (err) {
    console.error('❌ Error:', err);
    return {
      statusCode: 500,
      body: 'Error processing image'
    };
  }
};
