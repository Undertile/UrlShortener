var http = require("http");

var url = require('url');

var shorten = require('./shorten.js');

var list = require('./list.js');

function start() {	
	
	function onRequest(request, response) {
	  
	  if (request.url != '/favicon.ico') {
		  
		  var pathname = url.parse(request.url).href;
		  var method = pathname.split('?');
		  
		  switch(method[0])
		  {
		  	case "/shorten":
		  		console.log("has "+ method[0]);
		  		//var shash = shorten.shorten(pathname);
		  		var numhash;
		  		shorten.shorten(pathname, function(numhash){
		  			console.log("Ha fet servir el hash "+numhash);});	
		  		break;
		  	case "/list":
		  		console.log("has "+ method[0]);
		  		list.list();
		  		break;
		  	default:
		  		console.log("It has a incorrect URL");
		  		break;
		  }
		  
			  //console.log("Link: http://undertile-urlshort.s3-website-eu-west-1.amazonaws.com/"+shash);
		       
			  response.writeHead(200, {"Content-Type": "text/html"});
			  response.write("System ready...<br>");
			  response.write('Link: http://undertile-urlshort.s3-website-eu-west-1.amazonaws.com/'+numhash);
			  response.end();
			 
		  };
		  
  }
	
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



