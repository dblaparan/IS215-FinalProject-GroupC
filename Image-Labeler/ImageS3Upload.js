const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        const { imageKey, imageData, contentType } = requestBody;
        
        if (!imageKey || !imageData) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: 'Missing required parameters: imageKey and imageData' 
                })
            };
        }

        const buffer = Buffer.from(imageData, 'base64');
    
        const key = `uploads/${imageKey}`;
        
        const params = {
            Bucket: 'is215-image-labeling',
            Key: key,
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: contentType || 'image/jpeg',
            ACL: 'public-read'
        };
        
        const uploadResult = await s3.putObject(params).promise();
        console.log('Upload result:', uploadResult);//debugging
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Image uploaded successfully',
                key: key,
                etag: uploadResult.ETag
            })
        };
    } catch (error) {
        console.error('Error uploading to S3:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                error: 'Failed to upload image to S3',
                details: error.message 
            })
        };
    }
};