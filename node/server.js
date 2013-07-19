var http = require("http");

var md5 = require("./md5");

function iniciar(route) {
  function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname;
    
	if (request.url != '/favicon.ico') {
	console.log("Petició per "+pathname + " rebuda.");
    getKeys(pathname);

   // route(pathname);
    
    
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Tot a punt");
    response.end();
  }}
  
  function getKeys(obj){
	  	console.log("calculant el hash de"+obj);
	    var key;
	    key=hex_md5(obj);
	    console.log("el hash es" + key);
	    return key;
	    
	}

  http.createServer(onRequest).listen(8080);
  console.log("Servidor Iniciat.");
}

exports.iniciar = iniciar;

var http = require("http");
var url = require("url");

