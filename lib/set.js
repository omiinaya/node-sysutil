const { execSync } = require('child_process')
const elevated = require('@mh-cbon/aghfabsowecwn').exec
const run = require('./run')
const get = require('./get')
const core = require('./core')

var opts = {
    bridgeTimeout: 5000,
    stdio: 'pipe',
    env: {
        'FORCE_COLOR': 1,
        'DEBUG': '*'
    }
}

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

    PowerPlan: function (a) {
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
        //reg.exe ADD HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v EnableLUA /t REG_DWORD /d 0 /f
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

    UAC: async function (a) {
        //v = value, t = type, d = data, f = force
        const key = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System'
        const value = 'EnableLUA'
        const type = 'REG_DWORD'

        const query = await core.regQuery(key, value)
        const result = query.toString().trim().split('    ')
        const parsedResult = result[result.length - 1].replace('0x', '')
        const booleanState = Boolean(parseInt(parsedResult)) // <- use this to get and use opposite boolean value
        const data = Number(!booleanState)
        const command = `reg.exe ADD ${key} /v ${value} /t ${type} /d ${data} /f`
        elevated(command, opts)
    },

    Webcam: async function () {
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam'
        const value = 'Value'
        const type = 'REG_SZ'

        const query = await core.regQuery(key, value)
        const result = query.toString().trim().split('    ')
        const parsedResult = result[result.length - 1]
        const booleanState = core.parseAcToBool(parsedResult)
        const data = core.parseBoolToAc(!booleanState)
        const command = `reg.exe ADD ${key} /v ${value} /t ${type} /d ${data} /f`
        elevated(command, opts)
        
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

    Transparency: function (a) {
        var location = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize'
        var value = 'EnableTransparency'
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
    },

    CoreParking: function () {
        //HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583
    }
}

module.exports = set