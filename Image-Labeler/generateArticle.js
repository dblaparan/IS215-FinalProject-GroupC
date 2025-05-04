require('dotenv').config();
const AWS = require('aws-sdk');
const axios = require('axios');

// Configure AWS SDK
const s3 = new AWS.S3({ region: 'us-east-1' }); // Update region if needed; I will check with the final account during the deployment. 

const BUCKET_NAME = 'is215-image-labeling'; // Shall be replaced once we deploy on the official AWS account for the group.

async function generateArticleFromJson(outputKey) {
    try {

        const baseName = imageKey.split('/').pop().split('.')[0];
        const JSON_FILE_KEY = `labels/${baseName}_labels.json`;

        // Retrieval of JSON from S3 for OpenAI endpoint query later.
        const s3Data = await s3.getObject({
            Bucket: BUCKET_NAME,
            Key: JSON_FILE_KEY
        }).promise();

        const jsonString = s3Data.Body.toString('utf-8');
        const jsonContent = JSON.parse(jsonString);

        //Extract label names from the JSON.
        const labels = jsonContent.Labels.map(label => label.Name).join(', ');

        //Build prompt or query using the extracted label
        const prompt = `Write a fictional news article based on the following image labels: ${labels}. Make it sound like a creative, short feature story. You are a creative journalist popular in making articles trending today.`;

        //Call OpenAI endpoint
        const response = await axios.post(
            'https://is215-openai.upou.io/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const article = response.data.choices[0].message.content;

        //Output the article on console too.
        console.log('\n Fictional Article:\n');
        console.log(article);

        return article;

    } catch (err) {
        console.error('Error:', err.message || err);
        return 'Error generating article.';
    }
}

// For local testing
if (require.main === module) {
    const testKey = 'uploads/cat.jpg'; // simulate uploaded file path
    generateArticleFromJson(testKey).then(console.log);
}

module.exports = generateArticleFromJson;