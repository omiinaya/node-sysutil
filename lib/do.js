const { execSync, spawn } = require('child_process')
const elevated = require('@mh-cbon/aghfabsowecwn').exec;
const { getAdminStatus } = require('./core')

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

    cmdExec: function(a) {
        var child = spawn('cmd.exe', ["/c", a], { shell: true, detached: true })
    
        child.stdout.on("data", function (data) {
            console.log("out: " + data)
        })
    
        child.stderr.on("data", function (data) {
            console.log("err: " + data)
        })

    },

    pShellExec: function(a) {
        var child = spawn('powershell.exe', ['-ExecutionPolicy', 'ByPass', '-File', a], { shell: true, detached: true });
    
        child.stdout.on("data", function (data) {
            console.log("out: " + data)
        })
    
        child.stderr.on("data", function (data) {
            console.log("err: " + data)
        })
    
    },

    changeUserPassword: function() {
        //net user user_name  new_password
    },

    toggleHibernate: function() {
        //powercfg.exe /hibernate off
    },

    toggleAdministrator: function() {
        if (getAdminStatus() === 'No') {
            return execSync('net user administrator /active:yes').toString().trim()
        } else {
            return execSync('net user administrator /active:no').toString().trim()
        }
    },

    FlushDNS: function() {
        return execSync('ipconfig /flushdns').toString().trim()
    }
    
}

module.exports = scripts