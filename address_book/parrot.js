var Parrot = {}

Parrot.speakEnglish = function() { return 'Hello!' }
Parrot.speakSpanish = function() { return 'Ola!' }

//contains by default module.exports
//if we want the parent module to have access, we must assign it to module.exports

module.exports = Parrot

