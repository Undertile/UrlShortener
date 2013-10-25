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
		  var hashLen = config.local.LongHash;
		  var pathname = paramsUrl;
		  var params = getParams(pathname);
		  var lurl= params["url"];
		  var shash = getKeys(lurl, hashLen);
		  
		  function _callback(r) {
			  if (r) { 
				  callback(shash); 
			  }	else {
				  hashLen++;
				  console.log('Long hash to:'+hashLen);
				  shash = getKeys(lurl, hashLen);
				  getValidHash(shash, lurl, _callback);
			  }
		  }
		  
		  getValidHash(shash, lurl, _callback);
}

	/*
	 * This function returns a valid hash with e parameter to indicate if object should be created.
	 */
	function getValidHash(shash, lurl, callback) {
		  createObject(shash, lurl, function (vers){
			  checkOthersVersions(shash, lurl, vers, callback);
		  });
	}
	
/*
 * This function creates s3 object. It defines s3 parameters on 'params' variable.
 */
  function createObject(shash, lurl, callback){
	  var params = null;
	  
	  params = {Bucket:config.S3.Bucket, Key:shash, WebsiteRedirectLocation:lurl,
				  ContentType:'text/html', CacheControl:'no-cache'};

	  s3.putObject(params, function(err, data){
			if (err) {
				console.log(err);
				callback(err);
			}
			else {
					callback(data.VersionId)}
		});
  }

  /*This function check if there are others versions of the object
   * Return true when any error.
   * Return false when the object must be changed.
   * 
   */
  
  function checkOthersVersions(shash, lurl, vers, callback){
	  var params = {Bucket:config.S3.Bucket, Prefix:shash};
	  s3.listObjectVersions(params, function(err, data){
			if (err) {
				console.log(err);
				callback(false);
			}
			else {
				if (data.Versions.length == 1){
					if (data.Versions[0].VersionId == vers){
						callback(true);
						}
					else {
						console.log('Only one, but not same version');
						callback(false);
						}
					}
				else {
					var pos=0;
					var keyObject='';
					console.log('Count of versions:'+data.Versions.length);
					var dataVer = data.Versions[0].LastModified;
					for (var i = 0; i < data.Versions.length; i++) {
						if (data.Versions[i].LastModified < dataVer) {
							dataVer = data.Versions[i].LastModified;
							keyObject = data.Versions[i].Key;
							pos=i;
						}
					}
					if (data.Versions[pos].VersionId == vers){
						callback(true);
					}
					else {
						var versFirst = data.Versions[pos].VersionId;
						deleteObject(shash, vers, function(e){
							existURLVersion(shash, lurl, versFirst, callback);
						});
					}
				}
			}
		});
  }

  /*
   * This function delete s3 object with a specify versionId 
   */
    function deleteObject(shash, vers, callback){
      	
  	  var params = null;
  	  
  	  params = {Bucket:config.S3.Bucket, Key:shash, VersionId:vers};
  	  	  s3.deleteObject(params, function(err, data){
    			if (err) {
    				console.log("ErrorDeleteObject: ", params, err);
    				callback(false);
    			}
    			else {
    					callback(true);
    					}
    		});
    }
    
    /*This Function is used to know if url redirect with version already exists:
     * Return true when this object exist with the same redirect.
     * Return false when error or when this object exists and haven't the 
     * same redirect.
     * 
     */
     function existURLVersion(shash, lurl, vers, callback){
   	  var params = {Bucket:config.S3.Bucket, Key:shash, VersionId:vers};
   	  s3.headObject(params, function(err, data){
   			if (err) {
   				callback(false);
   				  			}
   			else {
   				if (data.WebsiteRedirectLocation == lurl) {
   					callback(true);
   				} else {
   					callback(false);
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

/*
 * This function returns X digits hash code (dependening of len parameter) 
 * of passed value
 */
function getKeys(obj, len){
    var key;
    key= md5.md5(obj);
    var key2; 
    key2 = key.substring(0, len);
    return key2;
}


exports.shorten = shorten;
