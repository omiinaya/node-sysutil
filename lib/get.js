const { execSync } = require('child_process')
const { isEmpty, nearestPowerOf2 } = require('./core')

var get = {

    MBName: function () {
        return execSync('wmic baseboard get product').toString().replace("Product", "").trim()
    },

    MBSerial: function () {
        return execSync('wmic baseboard get serialnumber').toString().replace("SerialNumber", "").trim()
    },

    MBRevision: function () {
        return execSync('wmic baseboard get version').toString().replace("Version", "").trim()
    },

    User: function () {
        return execSync('echo %USERNAME%').toString().trim()
    },

    PCName: function () {
        return execSync('echo %computername%').toString().trim()
    },

    MemSpeed: function () {
        var output = execSync('wmic memorychip get Configuredclockspeed').toString().replace('ConfiguredClockSpeed', '').trim()
        var speed = output.split(' ')[0] + " MHz"
        return speed
    },

    MemSize: function () {
        var output = execSync('wmic computersystem get TotalPhysicalMemory').toString().replace('TotalPhysicalMemory', '').trim()
        var gb = parseInt(output) / 1000000000
        var size = nearestPowerOf2(gb)
        return size
    },

    GPUName: function () {
        var x = execSync('wmic path win32_VideoController get name').toString().replace('Name', '')
        var y = x.split('\n').filter(str => isEmpty(str))
        if (y.length > 1) {
            return y[1].trim()
        } else {
            return x.trim()
        }
    },

    CPUName: function () {
        return execSync('wmic cpu get name').toString().replace('Name', '').trim()
    },

    OSName: function () {
        return execSync('wmic os get Caption').toString().replace('Caption', '').trim()
    },

    Drives: function () {
        var output = execSync('wmic logicaldisk get name, size, volumename, description').toString().split('\n')
        output.shift()
        var drives = output.filter(lines => isEmpty(lines))
        return drives
    },

    PowerGUID: function (a) {
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

    PowerScheme: function () {
        var output = execSync('powercfg /getactivescheme').toString().trim()
        var scheme = output.substring(
            output.lastIndexOf(":") + 1,
            output.lastIndexOf("(")
        ).trim()
        return scheme
    },

    SystemDate: function () {
        return execSync('date /t').toString().trim()
    },

    AdminStatus: function() {
        //get administrator account data
        var x = execSync('net user administrator').toString().trim()
        //split that data by lines, filter out the line that say sactive and divide that line by spaces.
        var y = x.split(/\r?\n/).filter(line => line.includes('active'))[0].split('               ')
        //y becomes an array of 2 elements. the 2nd element contains our admin active status.
        var z = y[1]
        return z
    },

    HibernateStatus: function() {
        //check root for hiberfil.sys to confirm status of hibernation
    },

    ScreenResolution: function() {
        var x = execSync('wmic desktopmonitor get screenheight, screenwidth').toString().trim()
        var y = x.replace('ScreenHeight  ScreenWidth', '').trim()
        var z = y.split('          ')
        var resolution = z[1] + 'x' + z[0]
        return resolution
    }
}

module.exports = get