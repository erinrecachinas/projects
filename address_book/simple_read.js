var fs = require('fs')

var options = { encoding: 'utf-8' }
function notifyReadComplete(err, data) {
    console.log(data)
}
var data = fs.readFile("data.json", "utf-8", notifyReadComplete)

