var http = require("http");

var md5 = require("./md5");

//var credentials = require ("/etc/UrlShortener/credentials.json");

var AWS = require('aws-sdk');

AWS.config.loadFromPath("/etc/UrlShortener/credencialsS3.json");

var s3 = new AWS.S3();



function iniciar(route) {
  function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname;
    
	if (request.url != '/favicon.ico') {
	console.log("Petició per "+pathname + " rebuda.");
	

	
	//console.log(s3.listObjects({params: {Bucket:'undertile-urlshort'}}));
    var shash = getKeys(pathname);
    createObject(shash, 'http://undertile.com');
    llistar();

   // route(pathname);
    
    
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Tot a punt");
    
    response.end();
  }}
  
  function getKeys(obj){
	  	console.log("calculant el hash de"+obj);
	    var key;
	    key= md5.md5(obj);
            var key2; 
            key2 = key.substring(0, 8);
	    console.log("el hash es " + key2);
	    return key2;
	    
	}

  function createObject(shash,url){
	  console.log("a punt per crear l'objecte");
	  var params = {Bucket:'undertile-urlshort',Key:shash,WebsiteRedirectLocation:url, ContentType:'txt/html', CacheControl:'no-cache'};

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

