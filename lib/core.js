const { execSync, spawn } = require('child_process')

var core = {

    isEmpty: function (a) {
        return a.indexOf(' ') > 0
    },

    getAdminStatus: function() {
        //get administrator account data
        var x = execSync('net user administrator').toString().trim()
        //split that data by lines, filter out the line that say sactive and divide that line by spaces.
        var y = x.split(/\r?\n/).filter(line => line.includes('active'))[0].split('               ')
        //y becomes an array of 2 elements. the 2nd element contains our admin active status.
        var z = y[1]
        return z
    }

}

module.exports = core