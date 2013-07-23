var http = require("http");

var md5 = require("./md5");

var AWS = require('aws-sdk');

AWS.config.loadFromPath("/etc/UrlShortener/credencialsS3.json");

var s3 = new AWS.S3();



function iniciar(route) {
  function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname;
	pathname=pathname.substring(1,pathname.lenght);
    
	if (request.url != '/favicon.ico') {
	console.log("Petició per "+pathname + " rebuda.");
	

	
	var shash = getKeys(pathname);
    createObject(shash, pathname);
   // llistar();
    
    console.log("Link és: http://undertile-urlshort.s3-website-eu-west-1.amazonaws.com/"+shash);
       
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Tot a punt");
    
    response.end();
  }}
  
  function getKeys(obj){
	  	console.log("calculant el hash de "+obj);
	    var key;
	    key= md5.md5(obj);
            var key2; 
            key2 = key.substring(0, 8);
	    console.log("el hash es " + key2);
	    return key2;
	    
	}

  function createObject(shash,url){
	  console.log("a punt per crear l'objecte");
	  var params = {Bucket:'undertile-urlshort', Key:shash, WebsiteRedirectLocation:url, 
			  		ContentType:'text/html', CacheControl:'no-cache'};

		s3.putObject(params, function(err, data){
			if (err) {
				console.log(err);
			}
			else {
				console.log("Objectes ", data);
			}
		});
  }
  
  function llistar(){
			var params = {Bucket:'undertile-urlshort'};

			s3.listObjects(params, function(err, data){
				if (err) {
					console.log(err);
				}
				else {
					console.log("Objectes ", data);
				}
			});}
	  
 
  http.createServer(onRequest).listen(8080);
  console.log("Servidor Iniciat.");
}

exports.iniciar = iniciar;

var http = require("http");
var url = require("url");

