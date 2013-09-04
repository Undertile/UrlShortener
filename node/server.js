var http = require("http");
var url = require('url');
var shorten = require('./shorten.js');
var config = require('./config');

function start() {	

	function onRequest(request, response) {

		if (request.url != '/favicon.ico') {

			var pathname = url.parse(request.url).href;
			var method = pathname.split('?');
			//var numhash;

			switch(method[0])
			{
			case "/shorten":
				shorten.shorten(pathname, function(numhash){
					response.writeHead(200, {"Content-Type": "text/html"});
					response.write("System ready...<br>");
					response.write(config.local.Link+numhash);
					response.end();
				});
				break;
			default:
				console.log("It has a incorrect URL");
			break;
			}
		};

	}
	http.createServer(onRequest).listen(config.servidor.Port);
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



