var fs    = require('fs'),
    nconf = require('nconf'),
    path = require('path');
if(process.env.NODE_ENV) {
	nconf.file(path.join(__dirname,'/config-' + process.env.NODE_ENV + '.json'));
}
module.exports = nconf;