const { execSync, spawn } = require('child_process')
const elExec = require('@mh-cbon/aghfabsowecwn').exec
const elSpawn = require('@mh-cbon/aghfabsowecwn').spawn
const regedit = require('regedit')

var opts = {
    bridgeTimeout: 5000,
    stdio: 'pipe',
    env: {
        'FORCE_COLOR': 1,
        'DEBUG': '*'
    }
}

var core = {

    isEmpty: function (a) {
        return a.indexOf(' ') > 0
    },

    nearestPowerOf2: function (a) {
        return 1 << 31 - Math.clz32(a);
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

        child.on('error', function (error) {
            console.log('===> child error=%s', error)
            console.log('===> child error=%j', error)
            if (error.code === 'ECONNREFUSED') console.log('UAC was probably not validated.')
        })
    },

    findProcessByName: function (a) {
        return execSync('tasklist /NH | findstr /I ' + a).toString().trim()
    },

    findProcessByPiD: function (a) {
        return execSync('wmic process where processId=' + a + ' get name').toString().replace('Name', '').trim()
    },

    findProcessByTitle: function (a) {
        //filter out all other data
        return execSync('tasklist /FI "windowtitle eq ' + a + '"').toString().trim()
    },

    findProcessTitleByName: function (a) {
        //filter out all other data
        return execSync('tasklist /FI "IMAGENAME eq ' + a + '" /v"').toString().trim()
    },

    killProcessByName: function (a) {
        return execSync('taskkill /IM ' + a + ' /F')
    },

    regList: function (a) {
        regedit.list(a, function (err, result) {
            console.log(result)
        })
    },

    regPut: function (location, value, valueName, valueType) {
        regedit.putValue({
            [location]: {
                [value]: {
                    value: valueName,
                    type: valueType
                }
            }
        }, function (err) {
            if (err) {
                console.log(err)
            }
        })
    }
}

module.exports = core