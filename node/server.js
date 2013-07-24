var http = require("http");

var url = require('url');

var md5 = require("./md5");

var AWS = require('aws-sdk');

AWS.config.loadFromPath("/etc/UrlShortener/credencialsS3.json");

var s3 = new AWS.S3();



function iniciar(route) {
  
	
	function onRequest(request, response) {
	  
	  
	  
	  if (request.url != '/favicon.ico') {
		  
		  var pathname = url.parse(request.url).href;
		  console.log("captured URL: "+ pathname);
		  var params = getParams(pathname);
		  var lurl= params["url"];
		  var expires=params['expires'];
		  
		  
		  
		  console.log("Petition for "+lurl + " received.");
		  console.log("this ShortUrl expires on  "+expires);
		
		  var shash = getKeys(lurl);
		  
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
	
		  
		  
		  
    createObject(shash, lurl,expires);
   
    // llistar();
    
    console.log("Link: http://undertile-urlshort.s3-website-eu-west-1.amazonaws.com/"+shash);
       
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("System ready...<br>");
    response.write('Link: http://undertile-urlshort.s3-website-eu-west-1.amazonaws.com/'+shash);
    response.end();
  }}
  
  
	
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
 * If there is a expiration date, it creates s3 object with this expiration.
 */
  function createObject(shash,url,expires){
	  
	  
	  console.log("ready to create object... ");
	  
	  var params = null;
	  
	  if ( expires == null) {
		  params = {Bucket:'undertile-urlshort', Key:shash, WebsiteRedirectLocation:url,
ContentType:'text/html', CacheControl:'no-cache'};
	  }
	  
	  else {
		//TODO si el paràmetre expires té valor, s'ha de convertir aquesta data al format vàlid
		  //http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
		  
		  params = {Bucket:'undertile-urlshort', Key:shash, WebsiteRedirectLocation:url, 
					
			  		ContentType:'text/html', CacheControl:'no-cache', Expires:'expires'};
	  };

		s3.putObject(params, function(err, data){
			if (err) {
				console.log(err);
			}
			else {
				console.log("Objects ", data);
			}
		});
  }
  
  
  
 /*Function Not used at this time.....
  * 
  */
  function readObject(shash,url){
	  console.log("reading object");
	  var params = {Bucket:'undertile-urlshort', Key:shash};
//TODO mirar si és millor la funció headObject que sembla ser que llegeix només capçalera
		s3.getObject(params, function(err, data){
			if (err) {
				console.log(err);
			}
			else {
				console.log("Objects ", data);
			}
		});
	// Si existeix
	//     Si data.WebsiteRediectLocation és igual a url enviada llavors retornar existeix=fals
	//        													sino retorna existeix=cert
	// Si no existeix l'objecte retorna existeix=fals 
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
 * Example: http://localhost:8080/?url=http://undertile.com&expires=31122015 returns an array
 * with url->http://undertile.com and expiration date->31122015
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

exports.iniciar = iniciar;



