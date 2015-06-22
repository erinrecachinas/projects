#!/usr/bin/env node
var Command = require('./command')

function handleResult(err) {
    if(err) {
        console.log("Error!")
    } else {
        console.log("OK! The command ran successfully")
    }
}
Command.executeCurrentOperation(handleResult)
/*var op = Command.getOperation()
if(op === 'add') {
    Command.add(handleResult)
} else if (op === 'find') {
    Command.find(handleResult)
} else {
    console.log("Unknown Command!")
}*/
