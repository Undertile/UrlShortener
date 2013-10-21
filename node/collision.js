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

function collision(paramsUrl, callback) {
		  var pathname = paramsUrl;
		  var params = getParams(pathname);
		  var lurl= params["url"];
		  var shash = getKeys(lurl);
		  var shash = "aL72JYmu";
		  getValidHash(shash, lurl, function (shash,e) {
			  
//			  if (e==0) {
//				  createObject(shash, lurl);
//			  }		
			  callback(shash);
		  });
}

	/*
	 * This function returns a valid hash with e parameter to indicate if object should be created.
	 */
	function getValidHash(shash, lurl, callback) {
			existURL(shash, lurl, function (e) {
			  if (e==0) {
				  // crea directament sense mirar res
				  createObject(shash, lurl, function (vers){
					  // mira si existeix una altra versio
					  checkOthersVersions(shash, lurl, vers, function (t){
						  // si retorna 1 ja plega
						  if (t==1) {
							  callback(shash,0);}
						  // si retorna 2 suma 1 al num hash 
						  else if (t==2) {
							  shash=shash+'1';
							  getValidHash(shash, lurl, callback);}
					  });
				  	});
					  //callback(shash,0);  
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
			else {callback(data.VersionId)}
		});
  }

  /*This function check if there are others versions of the object
   * Return 0 when there is an error.
   * Return 1 when the object is the only one and with the correct URL.
   * Return 2 when the object must be changed.
   * 
   */
  
  function checkOthersVersions(shash, lurl, vers, callback){
	  var params = {Bucket:config.S3.Bucket, Prefix:shash};
	  s3.listObjectVersions(params, function(err, data){
			if (err) {
				console.log(err);
				callback(0);
				  			}
			else {
				// comprova si nomes hi ha una sola versio i retorna 1 de ok
				if (data.Versions.length == 0){
					if (data.Versions[0].VersionId == vers){
						console.log('Sols un i te la mateixa versio');
						console.log(vers);
						callback(1);
						}
					// cas d'error i retorn 0
					else {
						console.log('No coincideix versio');
						callback(0);
						}
					}
				else {
					// recorre totes les versions per trobar la mes antiga
					var pos=0;
					var keyObject='';
					var dataVer = data.Versions[0].LastModified;
					for (var i = 0; i < data.Versions.length; i++){
						if (data.Versions[i].LastModified < dataVer)
							{dataVer = data.Versions[i].LastModified;
							 keyObject = data.Versions[i].Key;
							 pos=i;}
						}
					// comprova si la versio mes vella es igual a la gravada
					// i retorna 1 de ok
					if (data.Versions[pos].VersionId == ver){
						console.log('Es el mes antic');
						callback(1);
					}
					else {
						var versFirst = data.Versions[pos].VersionId;
						// si no es la mes vella treu l'entrada
						deleteObject(shash, lurl, versFirst, function(err, data){
							if (!err){
							// mira si la URL es la mateixa
							// si es afimatiu retorna 1 de ok
							// sino retorn 2
							
							existsURLVersion(shash, lurl, callback, function (e) {
								  if(e==1){
									  callback(1);
								  }
								  else if (e==2){
									  callback(2);
								  }
							});
							}
						});
					}
				}
			}
		});
  }

  /*
   * This function delete s3 object. 
   */
    function deleteObject(shash, vers, callback){
  	  var params = null;
  	  
  	  params = {Bucket:config.S3.Bucket, Key:shash, VersionId:vers,
  				  ContentType:'text/html', CacheControl:'no-cache'};

  	  s3.deleteObject(params, function(err, data){
  			if (err) {
  				console.log(err);
  				callback(err);
  			}
  			else {console.log('Esborra' + data);
  					callback(data);}
  		});
    }

    
   /*This Function is used to know if url redirect already exists:
    * Return 0 when this object doesn't exist.
    * Return 1 when this object exists and have the same redirect.
    * Return 2 when this object exists but doesn't have the same redirect.
    * 
    */
    function existURL(shash, lurl, callback){
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
    
    /*This Function is used to know if url redirect with version already exists:
     * Return 0 when this object doesn't exist.
     * Return 1 when this object exists and have the same redirect.
     * Return 2 when this object exists but doesn't have the same redirect.
     * 
     */
     function existURLVersion(shash, lurl, vers, callback){
   	  var params = {Bucket:config.S3.Bucket, Key:shash, VersionId:vers};
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


exports.collision = collision;



