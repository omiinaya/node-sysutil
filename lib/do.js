const { execSync, spawn } = require('child_process')
const { elevate, elCmdExec } = require('./core')
const get = require('./get')

var opts = {
    bridgeTimeout: 5000,
    stdio: 'pipe',
    env: {
        'FORCE_COLOR': 1,
        'DEBUG': '*'
    }
}

var scripts = {

    registerPowerPlan: function(a) {
        switch (a) {
            case 'High':
                execSync('powercfg -duplicatescheme 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c')
                break;
            case 'Ultimate':
                execSync('powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61')
                break;
        }
    },

    takeOwnership: function(a) {
        var child = elevated('takeown /F ' + a + ' /A /R /D Y', opts)
    
        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)
    
        child.on('close', function (code) {
            console.log(code)
        })
    },

    takeOwnership2: function(a) {
        elevated('icacls ' + a + ' /grant Users:F', opts)
        elevated('icacls ' + a + ' /setowner "Administrators" /T /C', opts)
    },

    copyFile: function(a, b) {
        var child = elevated('copy ' + a + ' ' + b, opts)
    
        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)
    
        child.on('close', function (code) {
            console.log(code)
        })
    },

    renameFile: function(a, b) {
        var child = elevated('rename  ' + a + '  ' + b, opts)
    
        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)
    
        child.on('close', function (code) {
            console.log(code)
        })
    },

    findProcessByName: function(a) {
        var content;
    
        try {
            content = execSync('tasklist /NH | findstr /I ' + a).toString().trim()
        }
    
        catch (error) {
            console.log(error)
        }
    
        return content
    },

    findProcessByPiD: function(a) {
        var content;
    
        try {
            content = execSync('wmic process where processId=' + a + ' get name').toString().replace('Name', '').trim()
        }
    
        catch (error) {
            console.log(error)
        }
    
        return content
    },

    killProcessByName: function(a) {
        return execSync('taskkill /IM ' + a + ' /F').toString().trim()
    },

    restartSystem: function() {
        return execSync('shutdown /r /t 0').toString().trim()
    },

    changeUserPassword: function() {
        //net user user_name  new_password
    },

    toggleHibernate: function() {
        /*
        if (get.HibernateStatus() === 'off') {
            elevate('powercfg.exe /hibernate on')
        } else {
            elevate('powercfg.exe /hibernate off')
        }
        */
       console.log('placeholder')
    },

    toggleAdministrator: function() {
        if (get.AdminStatus() === 'No') {
            return elevate('net user administrator /active:yes')
        } else {
            return elevate('net user administrator /active:no')
        }
    },

    FlushDNS: function() {
        return execSync('ipconfig /flushdns').toString().trim()
    },

    diskCleanUp: function() {
        return execSync('cleanmgr.exe /verylowdisk /d c').toString().trim()
    },

    clearLogs: function() {
        return elCmdExec(`for /f %x in ('wevtutil el') do wevtutil cl "%x"`)
    }
    
}

module.exports = scripts