var http = require("http");

var url = require('url');

var md5 = require("./md5");

var AWS = require('aws-sdk');

AWS.config.loadFromPath("/etc/UrlShortener/credencialsS3.json");

var s3 = new AWS.S3();



function start() {	
  
	
	function onRequest(request, response) {
	  
	  if (request.url != '/favicon.ico') {
		  
		  var pathname = url.parse(request.url).href;
		  console.log("captured URL: "+ pathname);
		  var params = getParams(pathname);
		  var lurl= params["url"];
		  
		  console.log("Petition for " + lurl + " received.");
		  		  
		  var shash = getKeys(lurl);
		  
		  getValidHash(shash, lurl, function (shash,e) {
			  
			  if (e==0) {
				  createObject(shash, lurl);
				  
			  }		
			 
			  console.log("Link: http://undertile-urlshort.s3-website-eu-west-1.amazonaws.com/"+shash);
		       
			  response.writeHead(200, {"Content-Type": "text/html"});
			  response.write("System ready...<br>");
			  response.write('Link: http://undertile-urlshort.s3-website-eu-west-1.amazonaws.com/'+shash);
			  response.end();
			 
		  });
		  
		  //llistar();
  }}
  
	/*
	 * This function returns a valid hash with e parameter to indicate if object should be created.
	 */
	function getValidHash(shash, lurl, callback) {
			exists(shash, lurl, function (e) {
			  console.log ('valor de exist=' +e);  
		  
			  if (e==0) {
				  callback(shash,0);  
			  } 				 
			  else if (e==1) {
				  callback(shash,1);
			  }
			  else if (e==2){
				  shash=shash+'1';
				  console.log ('el nou hash és '+shash);
				  getValidHash(shash, lurl, callback);
			  }
			  
		  });
		  
	}
	
	
/*
 * This function returns 8 digits hash code of passed value
 */
function getKeys(obj){
  	console.log("calculating hash of "+obj);
    var key;
    key= md5.md5(obj);
           var key2; 
           key2 = key.substring(0, 8);
    console.log("8 digits hash is " + key2);
    return key2;
	}

	
/*
 * This function creates s3 object. It defines s3 parameters on 'params' variable.
 */
  function createObject(shash, lurl){

	  console.log("ready to create object... ");
	  
	  var params = null;
	  
	  params = {Bucket:'undertile-urlshort', Key:shash, WebsiteRedirectLocation:lurl,
				  ContentType:'text/html', CacheControl:'no-cache'};

	  s3.putObject(params, function(err, data){
			if (err) {
				console.log(err);
			}
			else {
				console.log("Objects ", data);
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
  	  console.log("reading object...");
  	  var params = {Bucket:'undertile-urlshort', Key:shash};
  	  

  	 s3.headObject(params, function(err, data){
  		  
  			if (err) {
  				console.log("No existeix");
  				callback(0);
  				  			}
  			else {
  				
  				if (data.WebsiteRedirectLocation == lurl) {
  					console.log("Existeix i té la mateixa URL. No cal fer res... ");
  					callback(1);
  				} else {
  					console.log("Existeix però té diferent URL. Cal crear un hash nou.");
  					callback(2);
  				}
  			}
  			
  		});
    }
    
    
 /*Function Not used at this time.....
  * 
  */
  function llistar(){
			var params = {Bucket:'undertile-urlshort'};

			s3.listObjects(params, function(err, data){
				if (err) {
					console.log(err);
				}
				else {
					console.log("Objects ", data);
				}
			});}
	  
 
  http.createServer(onRequest).listen(8080);
  console.log("Server is started... ");
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




exports.start = start;



