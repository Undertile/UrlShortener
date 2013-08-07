/* This module lists the object head from S3 Bucket
 * where we have configured in the config.js file
 */
var AWS = require('aws-sdk');

var config = require('./config')

AWS.config.loadFromPath(config.S3.CredentialsPath);

var s3 = new AWS.S3();


/* Function that list all objects from a S3 Bucket
 * Read the config file and the credentials file
 */
  function list(){
			var params = {Bucket:config.S3.Bucket};

			s3.listObjects(params, function(err, data){
				if (err) {
					console.log(err);
				}
				else {
					console.log("Objects ", data);
				}
			});}

exports.list = list;



