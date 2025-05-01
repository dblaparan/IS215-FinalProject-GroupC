import aws from 'aws-sdk'

const region = "us-east-1"
const bucketName = "directupload-s3bucket"
const accessKeyId = ""
const secretAccessKey = ""

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})