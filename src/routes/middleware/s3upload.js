const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const aws = require('aws-sdk');
const awsConfig = require('../../config/aws/awsConfig');
aws.config.update(awsConfig.config);


const s3upload = multer({
    storage: multerS3({
        s3: new aws.S3(),
        bucket: 'bluekim',
        key: function(req, file, cb){
            let extension = path.extname(file.originalname);
            cb(null, `music/${Date.now().toString()}${extension}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read-write"
    })
},'NONE');

module.exports = s3upload;