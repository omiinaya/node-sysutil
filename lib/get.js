const { execSync } = require('child_process')

var get = {

    getMBName: function () {
        return execSync('wmic baseboard get product').toString().replace("Product", "").trim()
    },
    
    getMBSerial: function () {
        return execSync('wmic baseboard get serialnumber').toString().replace("SerialNumber", "").trim()
    },

    getMBRevision: function () {
        return execSync('wmic baseboard get version').toString().replace("Version", "").trim()
    },

    getUser: function () {
        return execSync('echo %USERNAME%').toString().trim()
    },

    getPCName: function () {
        return execSync('echo %computername%').toString().trim()
    },

    getMemSpeed: function () {
        var output = execSync('wmic memorychip get Configuredclockspeed').toString().replace('ConfiguredClockSpeed', '').trim()
        var speed = output.split(' ')[0] + " MHz"
        return speed
    },

    getMemSize: function () {
        var output = execSync('wmic computersystem get TotalPhysicalMemory').toString().replace('TotalPhysicalMemory', '').trim()
        var gb = parseInt(output) / 1000000000
        var size = Math.round(gb)
        return size
    },

    getGPUName: function () {
        var x = execSync('wmic path win32_VideoController get name').toString().replace('Name', '')
        var y = x.split('\n').filter(str => isEmpty(str))
        if (y.length > 1) {
            return y[1].trim()
        } else {
            return x.trim()
        }
    },

    getCPUName: function () {
        return execSync('wmic cpu get name').toString().replace('Name', '').trim()
    },

    getOSName: function () {
        return execSync('wmic os get Caption').toString().replace('Caption', '').trim()
    },

    getDrives: function () {
        var output = execSync('wmic logicaldisk get name, size, volumename, description').toString().split('\n')
        output.shift()
        var drives = output.filter(lines => isEmpty(lines))
        return drives
    },

    getPowerGUID: function (a) {
        var raw = execSync('powercfg /list').toString().trim()
        var bloated = raw.split('\n')
        var list = bloated.splice(2, bloated.length - 1)
        var guid;
        list.forEach(line => {
            if (line.includes(a)) {
                guid = line.substring(
                    line.lastIndexOf(":") + 1,
                    line.lastIndexOf("(")
                ).trim()
            }
        })
        return guid
    },

    getPowerScheme: function () {
        var output = execSync('powercfg /getactivescheme').toString().trim()
        var scheme = output.substring(
            output.lastIndexOf(":") + 1,
            output.lastIndexOf("(")
        ).trim()
        return scheme
    },
}

module.exports = get