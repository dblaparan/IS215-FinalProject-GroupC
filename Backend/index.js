'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});
const Sharp = require('sharp');

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;

exports.handler = function(event, context, callback) {
  const key = event.Records[0].s3.object.key;
  if (key.indexOf('thumb/') >= 0) {
    return;
  }
  S3.getObject({Bucket: BUCKET, Key: key}).promise()
    .then((data) => {
      return Sharp(data.Body)
      .metadata()
      .then(({ width }) => Sharp(data.Body)
        .resize(Math.round(width * 0.5))
        .toFormat('jpeg')
        .toBuffer()
      );
    })
    .then(buffer => S3.putObject({
        Body: buffer,
        Bucket: BUCKET,
        ContentType: 'image/jpeg',
        Key: `thumb/${key}`,
      }).promise()
    )
    .then(() => callback(null, {
        statusCode: '301',
        headers: {'location': `${URL}/${key}`},
        body: '',
      })
    )
    .catch(err => callback(err))
}
