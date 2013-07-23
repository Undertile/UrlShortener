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
	//TODO abans de crear l'objecte s'ha de mirar si ja existeix i comprovar que tingui
	//     la mateixa WebsiteRedirectLocation
	// existeix = fals
	// count = null
	// 		readObject(shash, pathname)
	// bucle:
	//      while existeix=cert
	//      shash = shash+count(afegit com a text)
	// 		readObject(shash, pathname)	
	// fi bucle
	// Si existeix=fals or count not null llavors fer un createObject 
	
    createObject(shash, pathname);
   // llistar();
    
    console.log("Link és: http://undertile-urlshort.s3-website-eu-west-1.amazonaws.com/"+shash);
       
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Tot a punt...<br>");
    response.write('Link: http://undertile-urlshort.s3-website-eu-west-1.amazonaws.com/'+shash);
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
  function readObject(shash,url){
	  console.log("llegint l'objecte");
	  var params = {Bucket:'undertile-urlshort', Key:shash};
//TODO mirar si és millor la funció headObject que sembla ser que llegeix només capçalera
		s3.getObject(params, function(err, data){
			if (err) {
				console.log(err);
			}
			else {
				console.log("Objectes ", data);
			}
		});
	// Si existeix
	//     Si data.WebsiteRediectLocation és igual a url enviada llavors retornar existeix=fals
	//        													sino retorna existeix=cert
	// Si no existeix l'objecte retorna existeix=fals 
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

