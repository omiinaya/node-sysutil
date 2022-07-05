const { execSync } = require('child_process')
const core = require('./core')
const powershell = core.psDir();
const powercfg = core.pCfgDir();
const nslookup = core.nsLDir();

var get = {

    MBName: function () {
        const x = execSync(`${powershell} -command "Get-CimInstance -Query 'Select * from Win32_BaseBoard'"`).toString().trim();
        const y = x.split('\r\n').filter(line => line.includes('Product'))[0];
        const z = y.split(' : ')[1];
        return z;
    },

    MBSerial: function () {
        const x = execSync(`${powershell} -command "Get-CimInstance -Query 'Select * from Win32_BaseBoard'"`).toString().trim();
        const y = x.split('\r\n').filter(line => line.includes('SerialNumber'))[0];
        const z = y.split(' : ')[1];
        return z;
    },

    User: function () {
        return execSync('echo %USERNAME%').toString().trim();
    },

    PCName: function () {
        return execSync('echo %computername%').toString().trim();
    },

    MemSpeed: function () {
        const x = execSync(`${powershell} -command "Get-CimInstance -Query 'Select * from Win32_PhysicalMemory'"`).toString().trim();
        const y = x.split('\r\n').filter(line => line.includes('ConfiguredClockSpeed'))[0];
        const z = y.split(' : ')[1];
        const speed = `${z} MHz`;
        return speed;
    },

    MemSize: function () {
        const x = execSync(`${powershell} -command "(Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property capacity -Sum).sum /1gb"`).toString().trim();
        const y = `${x} GB`;
        return y;
    },

    GPUName: function () {
        const x = execSync(`${powershell} -command "Get-CimInstance -Query 'Select * from win32_VideoController'"`).toString().trim();
        const y = x.split('\r\n').filter(line => line.includes('VideoProcessor'));
        if (y.length > 1) {
            return y[1].split(' : ')[1];
        } else {
            return y[0].split(' : ')[1];
        }
    },

    CPUName: function () {
        const x = execSync(`${powershell} -command "Get-CimInstance -Query 'Select * from Win32_Processor'"`).toString().trim();
        const y = x.split('\r\n').filter(line => line.includes('CPU0'))[0];
        const z = y.split('     ')[1]
        const cpu = z.substring(0, z.indexOf('GHz') + 3);
        return cpu;
    },

    OSName: function () {
        return execSync(`${powershell} -command "(Get-WMIObject win32_operatingsystem).caption"`).toString().trim();
    },

    Drives: function () {
        const x = execSync(`${powershell} -command "Get-CimInstance -Query 'Select * from Win32_LogicalDisk'"`).toString().trim();
        const y = x.split('\r\n').filter(line => !line.includes('-') && !line.includes('DeviceID'));
        return y;
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

        var raw = execSync(`${powercfg} /list`).toString().trim();
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
        var output = execSync(`${powercfg} /getactivescheme`).toString().trim();
        var scheme = output.substring(
            output.lastIndexOf(":") + 1,
            output.lastIndexOf("(")
        ).trim();
        return scheme;
    },

    SystemDate: function () {
        return execSync('date /t').toString().trim();
    },
    /*
    ScreenResolution: function () {
        const x = execSync(`${powershell} -command "Get-CimInstance -Query 'Select * from Win32_DesktopMonitor'"`).toString().trim();
        const y = x.split('\r\n').filter(line => line.includes('Default Monitor'));
        const z = y[0].split('  ').filter(line => line != '');
        const res = `${z[2]}x${z[1]}`.trim();
        return res;
    },
    */
    Users: function () {
        var x = execSync('net user').toString().trim()
        var y = x.split('\r\n').filter(line =>
            !line.includes('User accounts for') &&
            !line.includes('The command completed successfully.') &&
            !line.includes('-') &&
            core.isEmpty(line)
        );
        var z = [];
        for (var i = 0; i < y.length; i++) {
            z.push(y[i].split(' ')[0]);
        }
        return z;
    },

    PublicIP: function () {
        var x = execSync(`${nslookup} myip.opendns.com resolver1.opendns.com`).toString().trim();
        var y = x.split('\r\n');
        var z = y[y.length - 1].replace('Address:  ', '');
        return z;
    },

    SerialKey: function () {
        const x = execSync(`${powershell} -command "Get-WmiObject -query 'select * from SoftwareLicensingService' | Select OA3xOriginalProductKey"`).toString().trim();
        const y = x.split('\r\n').filter(line => !line.includes('--') && !line.includes('OA3xOriginalProductKey'))[0];
        if (y) {
            return y;
        } else {
            return "This system is either activated with a digital license or is not activated."
        }
    },

    Model: function () {
        const x = execSync(`${powershell} -command "Get-CimInstance -Query 'Select * from Win32_ComputerSystemProduct'"`).toString().trim();
        const y = x.split('\r\n').filter(line => line.includes('Name'))[0];
        const z = y.split(' : ')[1];
        return z;
    },

    Test: function () {
        return "this is a test function."
    }
}

module.exports = get