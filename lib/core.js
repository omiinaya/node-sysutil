const { execSync, spawn } = require('child_process')
const elExec = require('@mh-cbon/aghfabsowecwn').exec
const elSpawn = require('@mh-cbon/aghfabsowecwn').spawn

var opts = {
    bridgeTimeout: 5000,    // a timeout to detect that UAC was not validated, defaults to 3 minutes
    stdio: 'pipe',          // How do you want your pipes ?
    env: {
        'FORCE_COLOR': 1,  // example, enable chalk coloring  
        'DEBUG': '*'      // example, enable visionmedia/debug output
    }
}

var core = {

    isEmpty: function (a) {
        return a.indexOf(' ') > 0
    },

    cmdExec: function (a) {
        var child = spawn('cmd.exe', ["/c", a], { shell: true, detached: true })

        child.stdout.on("data", function (data) {
            console.log("out: " + data)
        })

        child.stderr.on("data", function (data) {
            console.log("err: " + data)
        })

    },

    elCmdExec: function (a) {
        return elSpawn('cmd.exe', ["/c", a], { shell: true, detached: true })
    },

    pShellExec: function (a) {
        var child = spawn('powershell.exe', ['-ExecutionPolicy', 'ByPass', '-File', a], { shell: true, detached: true });

        child.stdout.on("data", function (data) {
            console.log("out: " + data)
        })

        child.stderr.on("data", function (data) {
            console.log("err: " + data)
        })

    },

    elevate: function (a) {
        var child = elExec(a, opts, function (err, stdout, stderr) {
            if (err.code === 'ECONNREFUSED') console.log('UAC was probably not validated.')
            console.log("stdout=%s", stdout);
            console.error("stderr=%s", stderr);
        })

        child.on('started', function () {
            console.log('===> child pid=%s', child.pid)
        })

        child.on('close', function (code) {
            console.log('===> child close code=%s', code)
        })

        child.on('exit', function (code) {
            console.log('===> child exit code=%s', code)
        })

        child.on('error', function (error) {
            console.log('===> child error=%s', error)
            console.log('===> child error=%j', error)
            if (error.code === 'ECONNREFUSED') console.log('UAC was probably not validated.')
        })
    },
}

module.exports = core