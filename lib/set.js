const { execSync } = require('child_process')
const run = require('./run')
const get = require('./get')
const core = require('./core')

var set = {

    PCName: async function (a) {
        return core.elevate(`wmic computersystem where name="%computername%" call rename name="${a}"`);
    },

    PCDescription: function (a) {
        return core.elevate(`net config server /srvcomment:"${a}"`);
    },

    MonitorTimeout: function (a) {
        const command1 = `powercfg /change monitor-timeout-ac ${a}`
        const command2 = `powercfg /change monitor-timeout-dc ${a}`
        return execSync(`${command1} & ${command2}`);
    },

    StandbyTimeout: function (a) {
        const command1 = `powercfg -change -standby-timeout-ac ${a}`
        const command2 = `powercfg -change -standby-timeout-dc ${a}`
        return execSync(`${command1} & ${command2}`);
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

    Administrator: async function () {
        const query = execSync('net user administrator').toString().trim()
        const lines = await query.split('\r')
        const active = lines.filter(line => line.includes('Account active'))
        const parsed = active[0].split('               ')
        if (parsed[1] === 'Yes') return core.elevate('net user administrator /active:no')
        return core.elevate('net user administrator /active:yes')
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
    },

    PrioritizeGames: async function () {
        const key = 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games'
        const value1 = 'GPU Priority'
        const value2 = 'Priority'
        const value3 = 'Scheduling Category'
        const value4 = 'SFIO Priority'
        const type1 = 'REG_DWORD'
        const type2 = 'REG_SZ'
        const data1 = '8'
        const data2 = '6'
        const data3 = 'High'
        const command1 = `reg.exe ADD "${key}" /v "${value1}" /t ${type1} /d ${data1} /f`
        const command2 = `reg.exe ADD "${key}" /v "${value2}" /t ${type1} /d ${data2} /f`
        const command3 = `reg.exe ADD "${key}" /v "${value3}" /t ${type2} /d ${data3} /f`
        const command4 = `reg.exe ADD "${key}" /v "${value4}" /t ${type2} /d ${data3} /f`
        const command5 = `${command1} & ${command2} & ${command3} & ${command4}`
        core.elevate(command5)
    },

    VisualEffects: async function () {
        const key = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects'
        const value = 'VisualFXSetting'
        const type = 'REG_DWORD'
        const data = '2'
        const command = `reg.exe ADD "${key}" /v "${value}" /t ${type} /d ${data} /f`
        core.elevate(command)
    }
}

module.exports = set