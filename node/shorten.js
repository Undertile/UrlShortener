/* This module, given a long URL, returns a short URL,
 * and it saves the object to Amazon's S3 Bucket.
 * Parameters:
 * 	- Long URL (?url and others with &).
 * Return values:
 *  - The key (name) of the object created.
 */
	var url = require('url');
	var md5 = require("./md5");
	var config = require('./config');
	var AWS = require('aws-sdk');
	AWS.config.loadFromPath(config.S3.CredentialsPath);
	var s3 = new AWS.S3();

function shorten(paramsUrl, callback) {
		  var pathname = paramsUrl;
		  var params = getParams(pathname);
		  var lurl= params["url"];
		  var shash = getKeys(lurl);
		  getValidHash(shash, lurl, function (shash,e) {
			  
			  if (e==0) {
				  createObject(shash, lurl);
			  }		
			  callback(shash);
		  });
}

	/*
	 * This function returns a valid hash with e parameter to indicate if object should be created.
	 */
	function getValidHash(shash, lurl, callback) {
			exists(shash, lurl, function (e) {
			  if (e==0) {
				  callback(shash,0);  
			  } 				 
			  else if (e==1) {
				  callback(shash,1);
			  }
			  else if (e==2){
				  shash=shash+'1';
				  getValidHash(shash, lurl, callback);
			  }
			  
		  });
		  
	}
/*
 * This function returns 8 digits hash code of passed value
 */
function getKeys(obj){
    var key;
    key= md5.md5(obj);
           var key2; 
           key2 = key.substring(0, 8);
    return key2;
	}
/*
 * This function creates s3 object. It defines s3 parameters on 'params' variable.
 */
  function createObject(shash, lurl){
	  var params = null;
	  
	  params = {Bucket:config.S3.Bucket, Key:shash, WebsiteRedirectLocation:lurl,
				  ContentType:'text/html', CacheControl:'no-cache'};

	  s3.putObject(params, function(err, data){
			if (err) {
				console.log(err);
			}
		});
  }
  
    
   /*This Function is used to know if url redirect already exists:
    * Return 0 when this object doesn't exist.
    * Return 1 when this object exists and have the same redirect.
    * Return 2 when this object exists but doesn't have the same redirect.
    * 
    */
    function exists(shash, lurl, callback){
  	  var params = {Bucket:config.S3.Bucket, Key:shash};
  	 s3.headObject(params, function(err, data){
  		  
  			if (err) {
  				callback(0);
  				  			}
  			else {
  				if (data.WebsiteRedirectLocation == lurl) {
  					callback(1);
  				} else {
  					callback(2);
  				}
  			}
  			
  		});
    }
    
    
 /*
 * This function captures parameters from the url. First parameter is behind ?, 
 * Other parameters are behind & symbol.
 * It returns an array with this parameters.
 * Example: http://localhost:8080/?url=http://undertile.com returns an array
 * with url->http://undertile.com
 */

function getParams(url)
{
	var params = [];    
	url=url.split('?')[1];
	var vrs = url.split('&');
    
	for (var x = 0, c = vrs.length; x < c; x++) 
        {
        	var param = vrs[x].split('=');
        	params[param[0]] = decodeURIComponent(param[1]);
        };
                
    return params;
};


exports.shorten = shorten;



