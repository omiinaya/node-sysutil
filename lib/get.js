const { execSync } = require('child_process')
const path = require('path');
const core = require('./core');
const powershell = core.psDir();
const powercfg = core.pCfgDir();
const nslookup = core.nsLDir();

const get = {

    MBName: function () {
        const x = execSync(`${powershell} -command "Get-CimInstance -Query 'Select * from Win32_BaseBoard'"`).toString().trim();
        const y = x.split('\r\n').filter(line => line.includes('Product'))[0];
        if (!y) {
            return 'Unknown Motherboard';
        }
        const z = y.split(' : ')[1];
        if (!z) {
            return 'Unknown Motherboard';
        }
        return z;
    },

    MBSerial: function () {
        const x = execSync(`${powershell} -command "Get-CimInstance -Query 'Select * from Win32_BaseBoard'"`).toString().trim();
        const y = x.split('\r\n').filter(line => line.includes('SerialNumber'))[0];
        if (!y) {
            return 'Unknown Serial';
        }
        const z = y.split(' : ')[1];
        if (!z) {
            return 'Unknown Serial';
        }
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
        if (!y) {
            return 'Unknown Memory Speed';
        }
        const z = y.split(' : ')[1];
        if (!z) {
            return 'Unknown Memory Speed';
        }
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
        if (y.length === 0) {
            return 'Unknown GPU';
        }
        const getGpu = (line) => {
            const parts = line.split(' : ');
            return parts[1] ? parts[1].trim() : 'Unknown GPU';
        };
        if (y.length > 1) {
            return getGpu(y[1]);
        }
        return getGpu(y[0]);
    },

    CPUName: function () {
        const x = execSync(`${powershell} -command "Get-CimInstance -Query 'Select * from Win32_Processor'"`).toString().trim();
        const y = x.split('\r\n').filter(line => line.includes('CPU0'))[0];
        if (!y) {
            return 'Unknown CPU';
        }
        const z = y.split('     ')[1];
        if (!z) {
            return 'Unknown CPU';
        }
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
            case 'Low':
            case 'low':
                option = 'Power saver';
                break;
            case 'Balanced':
            case 'balanced':
                option = 'Balanced';
                break;
            case 'High':
            case 'high':
                option = 'High performance';
                break;
            case 'Ultimate':
            case 'ultimate':
                option = 'Ultimate performance';
                break;
            default:
                throw new Error(`Unknown power scheme: ${a}. Valid options: Low, Balanced, High, Ultimate`);
        }

        const raw = execSync(`${powercfg} /list`).toString().trim();
        const bloated = raw.split('\n');
        const list = bloated.splice(2, bloated.length - 1);
        let guid;

        for (let i = 0; i < list.length; i++) {
            if (list[i].includes(option)) {
                guid = list[i].substring(
                    list[i].lastIndexOf(":") + 1,
                    list[i].lastIndexOf("(")
                ).trim();
            }
        }

        if (!guid) {
            throw new Error(`Power scheme "${option}" not found in powercfg list`);
        }

        return guid;
    },

    PowerScheme: function () {
        const output = execSync(`${powercfg} /getactivescheme`).toString().trim();
        const scheme = output.substring(
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
        const x = execSync('net user').toString().trim()
        const y = x.split('\r\n').filter(line =>
            !line.includes('User accounts for') &&
            !line.includes('The command completed successfully.') &&
            !line.includes('-') &&
            core.isNotEmpty(line)
        );
        const z = [];
        for (let i = 0; i < y.length; i++) {
            z.push(y[i].split(' ')[0]);
        }
        return z;
    },

    PublicIP: function () {
        const x = execSync(`${nslookup} myip.opendns.com resolver1.opendns.com`).toString().trim();
        const y = x.split('\r\n');
        if (y.length === 0) {
            return 'Unknown IP';
        }
        const z = y[y.length - 1].replace('Address:  ', '');
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
        if (!y) {
            return 'Unknown Model';
        }
        const z = y.split(' : ')[1];
        return z;
    },

    Test: function () {
        return "this is a test function."
    },

    Dependencies: function () {
        return path.join(__dirname, '..', 'dependencies')
    }
}

module.exports = get
