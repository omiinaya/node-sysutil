const { execSync } = require('child_process')
const get = require('./get')
const set = require('./set')
const core = require('./core')

var opts = {
    bridgeTimeout: 5000,
    stdio: 'pipe',
    env: {
        'FORCE_COLOR': 1,
        'DEBUG': '*'
    }
}

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
        var child = elevated('takeown /F ' + a + ' /A /R /D Y', opts)

        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)

        child.on('close', function (code) {
            console.log(code)
        })
    },

    takeOwnership2: function (a) {
        elevated('icacls ' + a + ' /grant Users:F', opts)
        elevated('icacls ' + a + ' /setowner "Administrators" /T /C', opts)
    },

    copyFile: function (a, b) {
        var child = elevated('copy ' + a + ' ' + b, opts)

        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)

        child.on('close', function (code) {
            console.log(code)
        })
    },

    renameFile: function (a, b) {
        var child = elevated('rename  ' + a + '  ' + b, opts)

        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)

        child.on('close', function (code) {
            console.log(code)
        })
    },

    logoutSystem: function () {
        return core.elCmdExec('shutdown /l')
    },

    shutdownSystem: function () {
        return core.elCmdExec('shutdown /s /t 0')
    },

    restartSystem: function () {
        return core.elCmdExec('shutdown /r /t 0')
    },

    changeUserPassword: function () {
        //net user user_name  new_password
    },

    toggleHibernate: function () {
        /*
        if (get.HibernateStatus() === 'off') {
            elevate('powercfg.exe /hibernate on')
        } else {
            elevate('powercfg.exe /hibernate off')
        }
        */
        console.log('placeholder')
    },

    toggleAdministrator: function () {
        if (get.AdminStatus() === 'No') {
            return core.elevate('net user administrator /active:yes')
        } else {
            return core.elevate('net user administrator /active:no')
        }
    },

    FlushDNS: function () {
        return execSync('ipconfig /flushdns').toString().trim()
    },

    diskCleanUp: function () {
        execSync('cleanmgr.exe /verylowdisk /d c')
    },

    clearLogs: function () {
        return core.elCmdExec(`for /f %x in ('wevtutil el') do wevtutil cl "%x"`)
    },

    formatDrive: function (a, b) {
        if (b) {
            return execSync('echo y | format ' + a + ': /fs:' + b + ' /q')
        } else {
            return execSync('echo y | format ' + a + ': /fs:ntfs /q')
        }
    },

    disableLocationData: function () {
        //location, value, valueName, valueType
        var location = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location'
        var value = 'Value'
        var valueName = 'Deny'
        var valueType = 'REG_SZ'
        core.regPut(location, value, valueName, valueType)
    },

    enableLocationData: function () {
        //location, value, valueName, valueType
        var location = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location'
        var value = 'Value'
        var valueName = 'Allow'
        var valueType = 'REG_SZ'
        core.regPut(location, value, valueName, valueType)
    },
}

module.exports = scripts