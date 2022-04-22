const { execSync, spawn } = require('child_process')
const elExec = require('@mh-cbon/aghfabsowecwn').exec

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

    isAdmin: function () {
        return execSync('net session').toString().trim()
    },

    nearestPowerOf2: function (a) {
        return 1 << 31 - Math.clz32(a);
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

    elevate: async function (a) {
        try {
            await this.isAdmin()                    //if not admin, elevate     
            execSync(a).toString().trim()
        } catch {
            elExec(a, opts, function (err, stdout, stderr) {
                if (err.code === 'ECONNREFUSED') console.log('UAC was probably not validated.')
                console.log("stdout=%s", stdout);
                console.error("stderr=%s", stderr);
            })
        }
    },

    findProcessByName: function (a) {
        return execSync('tasklist /NH | findstr /I ' + a).toString().trim()
    },

    findProcessByPiD: function (a) {
        return execSync('wmic process where processId=' + a + ' get name').toString().replace('Name', '').trim()
    },

    findProcessByTitle: function (a) {
        return execSync('tasklist /FI "windowtitle eq ' + a + '"').toString().trim()
    },

    findProcessTitleByName: function (a) {
        return execSync('tasklist /FI "IMAGENAME eq ' + a + '" /v"').toString().trim()
    },

    killProcessByName: function (a) {
        return execSync('taskkill /IM ' + a + ' /F')
    },

    regQueryKeys: async function (key) {
        const command = `reg query "${key}"`
        return execSync(command).toString().trim()
    },

    regQueryValue: async function (key, value) {
        const command = `reg query "${key}" /v ${value}`
        return execSync(command).toString().trim()
    },

    regPutSZ: async function (key, value, type) {
        //v = value, t = type, d = data, f = force
        const query = await this.regQueryValue(key, value)
        const result = query.toString().trim().split('    ')
        const parsedResult = result[result.length - 1]
        const booleanState = this.parseAcToBool(parsedResult)
        const data = this.parseBoolToAc(!booleanState)
        const command = `reg.exe ADD "${key}" /v ${value} /t ${type} /d ${data} /f`
        return command
    },

    regPutDWORD: async function (key, value, type) {
        //v = value, t = type, d = data, f = force
        const query = await this.regQueryValue(key, value)
        const result = query.toString().trim().split('    ')
        const parsedResult = result[result.length - 1].replace('0x', '')
        const booleanState = Boolean(parseInt(parsedResult))
        const data = Number(!booleanState)
        const command = `reg.exe ADD "${key}" /v "${value}" /t ${type} /d ${data} /f`
        return command
    },

    //may be necessary when changing theme options
    updateSystemParameters: function () {
        return elExec('RUNDLL32.EXE user32.dll,UpdatePerUserSystemParameters')
    },

    //receives an action such as "Allow" or "Deny" and transforms to true or false.
    parseAcToBool(action) {
        if (action === 'Allow') return true
        return false
    },

    //receives a boolean such as "true" or "false" and transforms to Allow or Deny.
    parseBoolToAc(bool) {
        if (bool === true) return 'Allow'
        return 'Deny'
    },

    //receives an action such as "Allow" or "Deny" and transforms to 1 or 0.
    parseAcToInt(action) {
        if (action === 'Allow') return 1
        return 0
    }
}

module.exports = core