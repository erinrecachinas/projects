var Command = {}

Command.getOperation = function() {
    return process.argv[2]
}

Command.getOperationData = function() {
    return process.argv[3]
}

Command.executeCurrentOperation = function(done) {
    var op = this.getOperation()
    var command = Command[op] || function(done) {
        done('Invalid command!')
    }
    command.bind(this)(done);
}

Command.add = function(done) {
    var Contact = require('./contact')
    var contactStr = this.getOperationData()
    var contact = Contact.createContact(contactStr)
    Contact.saveContact(contact, done)
}

Command.find = function(done) {
    var Contact = require('./contact')
    var nameStr = this.getOperationData()
    Contact.findContacts(nameStr, function(err, result) {
        result.forEach(function(contact, index, array) {
            console.log(contact.name + " " + contact.number)
        })
        done(err,result)
    })
}
module.exports = Command 
