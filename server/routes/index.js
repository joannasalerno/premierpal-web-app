var express = require('express');
var router = express.Router();

const AWS = require('aws-sdk');
require('dotenv').config();

// configure aws sdk
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: 'ap-southeast-2',
});

// create S3 client
const s3 = new AWS.S3();

// specify S3 bucket & object key
const bucketName = 'premierpal-page-counter';
const objectKey = 'counter.json';

async function createS3bucket() {
  // create new bucket if it doesn't already exist
  try {
    await s3.createBucket({Bucket: bucketName}).promise();
    console.log(`Created bucket ${bucketName}`);

    // JSON data to write to S3 bucket
    const newJsonData = {
      count: '0',
    };

    // upload counter file to bucket
    await uploadJsonToS3(newJsonData);
  
  // check if bucket already exists, and if so, return message
  } catch (err) {
    if (err.statusCode === 409) {
      console.log(`Bucket already exists: ${bucketName}`);
    } else {
      console.log(`Error creating bucket: ${err}`);
    }
  }
};

// retrieve page counter object from S3 bucket
async function getObjectFromS3() {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };
  try {
    const data = await s3.getObject(params).promise();
    const parsedData = JSON.parse(data.Body.toString('utf-8'));
    console.log('Parsed JSON data:', parsedData);

    // increment
    let parsedInt = parseInt(parsedData.count);
    let incrementedData = ++parsedInt;

    const jsonData = {
      count: incrementedData,
    };
    console.log('Incremented JSON data:', jsonData);

    // return incremented data
    return jsonData;

  } catch (err) {
    console.error('Error:', err);
  }
};

// upload JSON data to S3 bucket
async function uploadJsonToS3(data) {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Body: JSON.stringify(data),
    ContentType: 'application/json',
  };
  try {
    await s3.putObject(params).promise();
    console.log('Successfully updated bucket');
    return JSON.stringify(data);
  } catch (err) {
    console.error('Error updating bucket:', err);
  }
};

// page counter route
router.get('/', function(req, res, next) {

  // call the upload
  (async () => {
    await createS3bucket();
    const data = await getObjectFromS3();
    await uploadJsonToS3(data);
    res.json(data);
  })();
});

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'PremierPal Server' });
// });

module.exports = router;
