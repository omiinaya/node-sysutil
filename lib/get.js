const { execSync } = require('child_process')
const { isEmpty, nearestPowerOf2 } = require('./core')

var get = {

    MBName: function () {
        return execSync('wmic baseboard get product').toString().replace("Product", "").trim();
    },

    MBSerial: function () {
        return execSync('wmic baseboard get serialnumber').toString().replace("SerialNumber", "").trim();
    },

    MBRevision: function () {
        return execSync('wmic baseboard get version').toString().replace("Version", "").trim();
    },

    User: function () {
        return execSync('echo %USERNAME%').toString().trim();
    },

    PCName: function () {
        return execSync('echo %computername%').toString().trim();
    },

    MemSpeed: function () {
        var output = execSync('wmic memorychip get Configuredclockspeed').toString().replace('ConfiguredClockSpeed', '').trim();
        var speed = `${output.split(' ')[0]} MHz`;
        return speed;
    },

    MemSize: function () {
        var output = execSync('wmic computersystem get TotalPhysicalMemory').toString().replace('TotalPhysicalMemory', '').trim();
        var gb = parseInt(output) / 1000000000;
        var size = `${nearestPowerOf2(gb)}.0 GB`;
        return size;
    },

    GPUName: function () {
        var x = execSync('wmic path win32_VideoController get name').toString().replace('Name', '');
        var y = x.split('\n').filter(str => isEmpty(str));
        if (y.length > 1) {
            return y[1].trim();
        } else {
            return x.trim();
        }
    },

    CPUName: function () {
        return execSync('wmic cpu get name').toString().replace('Name', '').trim();
    },

    OSName: function () {
        return execSync('wmic os get Caption').toString().replace('Caption', '').trim();
    },

    Drives: function () {
        var output = execSync('wmic logicaldisk get name, size, volumename, description').toString().split('\n');
        output.shift();
        var drives = output.filter(lines => isEmpty(lines));
        return drives;
    },

    PowerGUID: function (a) {
        let option;
        switch (a) {
            case 'Low' || 'low':
                option = 'Power saver';
                break;
            case 'Balanced' || 'balanced':
                option = 'Balanced';
                break;
            case 'High' || 'high':
                option = 'High performance';
                break;
            case 'Ultimate' || 'ultimate':
                option = 'Ultimate performance';
                break;
        }

        var raw = execSync('powercfg /list').toString().trim();
        var bloated = raw.split('\n');
        var list = bloated.splice(2, bloated.length - 1);
        var guid;

        for (var i = 0; i < list.length; i++) {
            if (list[i].includes(option)) {
                guid = list[i].substring(
                    list[i].lastIndexOf(":") + 1,
                    list[i].lastIndexOf("(")
                ).trim();
            }
        }

        return guid;
    },

    PowerScheme: function () {
        var output = execSync('powercfg /getactivescheme').toString().trim();
        var scheme = output.substring(
            output.lastIndexOf(":") + 1,
            output.lastIndexOf("(")
        ).trim();
        return scheme;
    },

    SystemDate: function () {
        return execSync('date /t').toString().trim();
    },

    ScreenResolution: function () {
        var x = execSync('wmic desktopmonitor get screenheight, screenwidth').toString().trim();
        var y = x.replace('ScreenHeight  ScreenWidth', '').trim();
        var z = y.split('          ');
        var resolution = `${z[1]}x${z[0]}`;
        return resolution;
    },

    Users: function () {
        var x = execSync('net user').toString().trim()
        var y = x.split('\r\n')
        var z = y.filter(line =>
            !line.includes('User accounts for') &&
            !line.includes('The command completed successfully.') &&
            !line.includes('-') &&
            isEmpty(line)
        )
        var results = [];
        for (var i = 0; i < z.length; i++) {
            results.push(z[i].split(' ')[0])
        }
        return results;
    },

    PublicIP: function () {
        var x = execSync('nslookup myip.opendns.com resolver1.opendns.com').toString().trim()
        var y = x.split('\r\n')
        var z = y[y.length - 1].replace('Address:  ', '')
        return z
    },

    SerialKey: function () {
        var x = execSync('wmic path softwareLicensingService get OA3xOriginalProductKey').toString().trim()
        var y = x.split('\r\n')
        var z = y[y.length - 1]
        return z
    }
}

module.exports = get