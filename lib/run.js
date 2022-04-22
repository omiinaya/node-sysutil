const { execSync } = require('child_process')
const get = require('./get')
const core = require('./core')

var scripts = {

    registerPowerPlan: function (a) {
        switch (a) {
            case 'Low' || 'low':
                execSync('powercfg -duplicatescheme A1841308-3541-4FAB-BC81-F71556F20B4A')
                break;
            case 'Balanced' || 'balanced':
                execSync('powercfg -duplicatescheme 381B4222-F694-41F0-9685-FF5BB260DF2E')
                break;
            case 'High' || 'high':
                execSync('powercfg -duplicatescheme 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c')
                break;
            case 'Ultimate' || 'ultimate':
                execSync('powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61')
                break;
        }
    },

    takeOwnership: function (a) {
        core.elevate(`takeown /F ${a} /A /R /D Y`)
    },

    takeOwnership2: function (a) {
        const command1 = `icacls ${a} /grant Users:F`
        const command2 = `icacls ${a} /setowner "Administrators" /T /C`
        const command3 = `${command1} & ${command2}`
        core.elevate(command3)
    },

    copyFile: function (a, b) {
        core.elevate(`copy ${a} ${b}`)
    },

    renameFile: function (a, b) {
        core.elevate(`rename ${a} ${b}`)
    },

    logoutSystem: function () {
        core.elevate('shutdown /l')
    },

    shutdownSystem: function () {
        core.elevate('shutdown /s /t 0')
    },

    restartSystem: function () {
        core.elevate('shutdown /r /t 0')
    },

    changeUserPassword: function (newPassword) {
        core.elevate(`net user "${get.User()}" ${newPassword}`)
    },

    FlushDNS: function () {
        return execSync('ipconfig /flushdns').toString().trim()
    },

    diskCleanUp: async function () {
        const key = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VolumeCaches'
        const value = 'StateFlags0001'
        const type = 'REG_DWORD'
        const data = '2'

        const result = await core.regQueryKeys(key)     // receives string with results
        const keys = result.split(/\r?\n/)              // splits string into an array of keys

        let commands = []
        keys.forEach(key => {
            if (!key.includes('DownloadsFolder')) {     //excluse downloads folder
                const command = `reg.exe ADD "${key}" /v ${value} /t ${type} /d ${data} /f`
                commands.push(command)
            }
        })

        let sages = commands.join(" & ");               //commands joined by & can be executed with a single child process
        let final = `${sages} && cleanmgr.exe /sagerun:1`
        core.elevate(final)
    },

    clearLogs: function () {
        return core.elevate(`for /f %x in ('wevtutil el') do wevtutil cl "%x"`)
    },

    formatDrive: function (driveLetter, fileSystem) {
        if (b) {
            return execSync('echo y | format ' + driveLetter + ': /fs:' + fileSystem + ' /q')
        } else {
            return execSync('echo y | format ' + driveLetter + ': /fs:ntfs /q')
        }
    }
}

module.exports = scripts