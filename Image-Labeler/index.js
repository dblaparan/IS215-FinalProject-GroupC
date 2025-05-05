require('dotenv').config();
const AWS = require('aws-sdk');
const axios = require('axios');

// Configure AWS SDK
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3({ region: 'us-east-1' }); // Update region if needed
const BUCKET_NAME = process.env.BUCKET_NAME; // S3 Bucket Name

async function generateArticleFromJson(outputKey) {
    console.log('Output Key:', outputKey)
    try {
        console.log('Output Key:', outputKey)
        const JSON_FILE_KEY = outputKey;

        // Retrieve JSON from S3 for OpenAI endpoint query
        const s3Data = await s3.getObject({
            Bucket: BUCKET_NAME,
            Key: JSON_FILE_KEY
        }).promise();

        const jsonString = s3Data.Body.toString('utf-8');
        const jsonContent = JSON.parse(jsonString);

        // Extract label names from the JSON
        const labels = jsonContent.Labels.map(label => label.Name).join(', ');

        // Build prompt or query using the extracted labels
        const prompt = `Write a fictional news article based on the following image labels: ${labels}. Make it sound like a creative, short feature story. You are a creative journalist popular in making articles trending today.`;

        console.log('Prompt:', prompt);
        // Call OpenAI endpoint
        const response = await axios.post(
            'https://is215-openai.upou.io/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }]
            },
            {
                headers: {
                    Authorization: `${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        console.log('OpenAI Response:', response);

        const article = response.data.choices[0].message.content;

        // Output the article to the console
        console.log('\n Fictional Article:\n');
        console.log(article);

        // Add article to S3 as JSON
        const articleKey = `articles/${outputKey.split('/').pop().split('_')[0]}_article.json`;

        await s3.putObject({
            Bucket: BUCKET_NAME,
            Key: articleKey,
            Body: JSON.stringify({ article }, null, 2),
            ContentType: 'application/json'
        }).promise();

    } catch (err) {
        console.error('Error:', err.message || err);
        return 'Error generating article.';
    }
}

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

        console.log('Detected labels:', labels);

        // Generate output file name
        const baseName = key.split('/').pop().split('.')[0];
        const outputKey = `labels/${baseName}_labels.json`;

        // Upload the JSON file to S3
        await s3.putObject({
            Bucket: bucket,
            Key: outputKey,
            Body: JSON.stringify({ Labels: labels }, null, 2),
            ContentType: 'application/json'
        }).promise();

        // Generate article from the uploaded JSON
        console.log('Generating article from JSON...');
        await generateArticleFromJson(outputKey);

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