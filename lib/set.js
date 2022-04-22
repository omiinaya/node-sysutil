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

    Location: async function () {
        //v = value, t = type, d = data, f = force
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location'
        const value = 'Value'
        const type = 'REG_SZ'
        const command = await core.regPutSZ(key, value, type)
        core.elevate(command)
    },

    UAC: async function () {
        //v = value, t = type, d = data, f = force
        const key = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System'
        const value = 'EnableLUA'
        const type = 'REG_DWORD'
        const command = await core.regPutDWORD(key, value, type)
        core.elevate(command)
    },

    Webcam: async function () {
        //v = value, t = type, d = data, f = force
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam'
        const value = 'Value'
        const type = 'REG_SZ'
        const command = await core.regPutSZ(key, value, type)
        core.elevate(command)
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

    Hibernation: async function () {
        const key = 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power'
        const value = 'HibernateEnabled'
        const type = 'REG_DWORD'
        const command = await core.regPutDWORD(key, value, type)
        core.elevate(command)
    },

    Microphone: async function () {
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone'
        const value = 'Value'
        const type = 'REG_SZ'
        const command = await core.regPutSZ(key, value, type)
        core.elevate(command)
    },

    Activity: async function () {
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\activity'
        const value = 'Value'
        const type = 'REG_SZ'
        const command = await core.regPutSZ(key, value, type)
        core.elevate(command)
    },

    AppDiagnostics: async function () {
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\appDiagnostics'
        const value = 'Value'
        const type = 'REG_SZ'
        const command = await core.regPutSZ(key, value, type)
        core.elevate(command)
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

    Transparency: async function () {
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize'
        const value = 'EnableTransparency'
        const type = 'REG_DWORD'
        const command = await core.regPutDWORD(key, value, type)
        core.elevate(command)
    },

    CoreParking: function () {
        const key = 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583'
        const value1 = 'ValueMin'
        const value2 = 'ValueMax'
        const type = 'REG_DWORD'
        const data = '0'
        const command1 = `reg.exe ADD "${key}" /v ${value1} /t ${type} /d ${data} /f`
        const command2 = `reg.exe ADD "${key}" /v ${value2} /t ${type} /d ${data} /f`
        const command3 = `${command1} & ${command2}`
        core.elevate(command3)
    },

    GameDVR: async function () {
        const key = 'HKLM\\SOFTWARE\\Microsoft\\PolicyManager\\default\\ApplicationManagement\\AllowGameDVR'
        const value = 'value'
        const type = 'REG_DWORD'
        const command = await core.regPutDWORD(key, value, type)
        core.elevate(command)
    },

    NetworkThrottling: async function () {
        const key = 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile'
        const value1 = 'NetworkThrottlingIndex'
        const value2 = 'SystemResponsiveness'
        const type = 'REG_DWORD'
        const data1 = '0xffffffff'
        const data2 = '0'
        const command1 = `reg.exe ADD "${key}" /v ${value1} /t ${type} /d ${data1} /f`
        const command2 = `reg.exe ADD "${key}" /v ${value2} /t ${type} /d ${data2} /f`
        const command3 = `${command1} & ${command2}`
        core.elevate(command3)
    }
}

module.exports = set