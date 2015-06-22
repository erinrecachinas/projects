var Contact = {}

Contact.parseName = function(str) {
    return str.split(',')[0].trim()
}

Contact.parseNumber = function(str) {
    return str.split(',')[1].trim()
}

Contact.createContact = function(str) {
    var contactObject = {
        name: this.parseName(str),
        number: this.parseNumber(str)
    }
    return contactObject
}

Contact.loadContacts = function(done) {
    var jf = require('jsonfile')
    var util = require('./util')
    var file = util.getDataPath()
    jf.readFile(file, done) 
}

Contact.saveContacts = function(contacts, done) {
    var jf = require('jsonfile')
    var util = require('./util')
    var file = util.getDataPath()
    jf.writeFile(file, contacts, done)
}

Contact.saveContact = function(contact, done) {
    //appends a contact to the existing contacts list
    var _this = this
    var jf = require('jsonfile')
    var existingContacts = this.loadContacts(function(err, contacts) {
    if(err) {return done(err)}
    contacts.push(contact)
    _this.saveContacts(contacts, done)
    })
}

Contact.findContacts = function(name, done) {
    this.loadContacts(function(err, contacts) {
        if(err) {return done(err)}
        return done(err, contacts.filter(function(contact) {
            if ('name' in contact && contact.name === name ) {
                return true
            } else {
                return false
            }
        }))
    })
}
module.exports = Contact
