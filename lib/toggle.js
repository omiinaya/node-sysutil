const { execSync } = require('child_process')
const core = require('./core')

var set = {
    Location: async function () {
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location'
        const value = 'Value'
        const command = await core.regPutSZ(key, value)
        core.elevate(command)
    },

    UAC: async function () {
        const key = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System'
        const value = 'EnableLUA'
        const command = await core.regPutDWORD(key, value)
        core.elevate(command)
    },

    Webcam: async function () {
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam'
        const value = 'Value'
        const command = await core.regPutSZ(key, value)
        core.elevate(command)
    },

    Administrator: async function () {
        const query = execSync('net user administrator').toString().trim()
        const lines = await query.split('\r')
        const active = lines.filter(line => line.includes('Account active'))
        const parsed = active[0].split('               ')
        if (parsed[1] === 'Yes') return core.elevate('net user administrator /active:no')
        return core.elevate('net user administrator /active:yes')
    },

    Hibernation: async function () {
        const key = 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power'
        const value = 'HibernateEnabled'
        const command = await core.regPutDWORD(key, value)
        core.elevate(command)
    },

    Microphone: async function () {
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone'
        const value = 'Value'
        const command = await core.regPutSZ(key, value)
        core.elevate(command)
    },

    Activity: async function () {
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\activity'
        const value = 'Value'
        const command = await core.regPutSZ(key, value)
        core.elevate(command)
    },

    AppDiagnostics: async function () {
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\appDiagnostics'
        const value = 'Value'
        const command = await core.regPutSZ(key, value)
        core.elevate(command)
    },

    WindowsDefender: async function () {
        /*
        const key1 = 'HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender'
        const key2 = 'HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender\\Real-Time Protection'
        const value1 = 'DisableAntiSpyware'
        const value2 = 'DisableBehaviorMonitoring'
        const value3 = 'DisableOnAccessProtection'
        const value4 = 'DisableScanOnRealtimeEnable'
        const command1 = await core.regPutDWORD(key1, value1)
        const command2 = await core.regPutDWORD(key2, value2)
        const command3 = await core.regPutDWORD(key2, value3)
        const command4 = await core.regPutDWORD(key2, value4)
        core.elevate(`${command1} & ${command2} & ${command3} & ${command4}`)
        */
        
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
        const command = await core.regPutDWORD(key, value)
        core.elevate(command)
    },

    GameDVR: async function () {
        const key = 'HKLM\\SOFTWARE\\Microsoft\\PolicyManager\\default\\ApplicationManagement\\AllowGameDVR'
        const value = 'value'
        const command = await core.regPutDWORD(key, value)
        core.elevate(command)
    },

    WindowsTips: function () {
        const key = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager'
        //const value = 'StateFlags0001'
        const type = 'REG_DWORD'
        //const data = '2'
    }
}

module.exports = set