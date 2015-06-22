var Server = {}

var http = require('http')

function handleRequest(req, res) {
    //req is object with all info from browser
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello!')
}
var server = http.createServer(handleRequest)

server.listen(3000, '127.0.0.1');
module.exports = server
