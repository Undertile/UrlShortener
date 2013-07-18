var http = require("http");

function iniciar() {
  function onRequest(request, response) {
    console.log("Petició Rebuda.");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Tot a punt");
    response.end();
  }

  http.createServer(onRequest).listen(8080);
  console.log("Servidor Iniciat.");
}

exports.iniciar = iniciar;