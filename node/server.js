var http = require("http");

function iniciar(route) {
  function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname;
    console.log("Petició per "+pathname + " rebuda.");
    

    route(pathname);
    
    
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Tot a punt");
    response.end();
  }

  http.createServer(onRequest).listen(8080);
  console.log("Servidor Iniciat.");
}

exports.iniciar = iniciar;

var http = require("http");
var url = require("url");

