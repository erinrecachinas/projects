var Util = {}

Util.getHomeDirectory = function() {
    switch(process.platform) {
        case "win32":
            return process.env.USERPROFILE
        case "darwin":
        case "linux":
                return process.env.HOME
    }
}

Util.getDataPath = function() {
    var path = require('path')
    return path.join(this.getHomeDirectory(), "data.json")
}

module.exports = Util
