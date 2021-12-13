const { execSync } = require('child_process')
const run = require('./run')
const get = require('./get')
const core = require('./core')

var set = {

    PCName: function (a) {
        execSync(`WMIC computersystem where caption='%computername%' call rename name='` + a)
    },

    PCDescription: function (a) {
        execSync('net config server /srvcomment:"' + a + '"')
    },

    MonitorTimeout: function (a) {
        execSync('powercfg /change monitor-timeout-ac ' + a) //0 = never
        execSync('powercfg /change monitor-timeout-dc ' + a)
    },

    StandbyTimeout: function (a) {
        execSync('powercfg -change -standby-timeout-ac ' + a)
        execSync('powercfg -change -standby-timeout-dc ' + a)
    },

    PowerPlan(a) {
        if (!get.PowerGUID(a)) {
            run.registerPowerPlan(a)
            execSync('powercfg /setactive ' + get.PowerGUID(a))
            console.log('Power Mode: ' + a)
        } else {
            execSync('powercfg /setactive ' + get.PowerGUID(a))
            console.log('Power Mode: ' + a)
        }
    },

    Location: function (a) {
        var location = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location'
        var value = 'Value'
        var valueType = 'REG_SZ'
        switch (a) {
            case 'on':
                core.regPut(location, value, 'Allow', valueType)
                break;
            case 'off':
                core.regPut(location, value, 'Deny', valueType)
                break;
            default:
                console.log('Please specify "on" or "off"');
                break;
        }
    },

    Webcam: function (a) {
        var location = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam'
        var value = 'Value'
        var valueType = 'REG_SZ'
        switch (a) {
            case 'on':
                core.regPut(location, value, 'Allow', valueType)
                break;
            case 'off':
                core.regPut(location, value, 'Deny', valueType)
                break;
            default:
                console.log('Please specify "on" or "off"');
                break;
        }
    },

    Administrator: function (a) {
        switch (a) {
            case 'on':
                core.elevate('net user administrator /active:yes')
                break;
            case 'off':
                core.elevate('net user administrator /active:no')
                break;
            default:
                console.log('Please specify "on" or "off"')
                break;
        }
    },

    Hibernation: function (a) {
        switch (a) {
            case 'on':
                core.elevate('powercfg.exe /hibernate on')
                break;
            case 'off':
                core.elevate('powercfg.exe /hibernate off')
                break;
            default:
                console.log('Please specify "on" or "off"')
                break;
        }
    },

    Microphone: function (a) {
        var location = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone'
        var value = 'Value'
        var valueType = 'REG_SZ'
        switch (a) {
            case 'on':
                core.regPut(location, value, 'Allow', valueType)
                break;
            case 'off':
                core.regPut(location, value, 'Deny', valueType)
                break;
            default:
                console.log('Please specify "on" or "off"');
                break;
        }
    },

    Activity: function (a) {
        var location = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\activity'
        var value = 'Value'
        var valueType = 'REG_SZ'
        switch (a) {
            case 'on':
                core.regPut(location, value, 'Allow', valueType)
                break;
            case 'off':
                core.regPut(location, value, 'Deny', valueType)
                break;
            default:
                console.log('Please specify "on" or "off"');
                break;
        }
    },

    AppDiagnostics: function (a) {
        var location = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\appDiagnostics'
        var value = 'Value'
        var valueType = 'REG_SZ'
        switch (a) {
            case 'on':
                core.regPut(location, value, 'Allow', valueType)
                break;
            case 'off':
                core.regPut(location, value, 'Deny', valueType)
                break;
            default:
                console.log('Please specify "on" or "off"');
                break;
        }
    },

    WindowsDefender: function (a) {
        switch (a) {
            case 'on':
                core.elevate('sc config WinDefend start = enabled')
                core.elevate('sc start WinDefend')
                break;
            case 'off':
                core.elevate('sc config WinDefend start = disabled')
                core.elevate('sc stop WinDefend')
                break;
            default:
                console.log('Please specify "on" or "off"');
                break;
        }
    },

    UAC: function (a) {
        var location = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System'
        var value = 'EnableLUA'
        var valueType = 'REG_DWORD'
        switch (a) {
            case 'on':
                core.regPut(location, value, 1, valueType)
                break;
            case 'off':
                core.regPut(location, value, 0, valueType)
                break;
            default:
                console.log('Please specify "on" or "off"');
                break;
        }
    }
}

module.exports = set