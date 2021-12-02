const { execSync } = require('child_process')

var set = {

    PCName: function (a) {
        execSync(`WMIC computersystem where caption='%computername%' call rename name='` + a + `-PC'`)
    },

    PCDescription: function (a) {
        execSync('net config server /srvcomment:"' + a + 'PC"')
    },

    MonitorTimeout: function () {
        execSync('powercfg /change monitor-timeout-ac 0') //0 = never
        execSync('powercfg /change monitor-timeout-dc 0')
    },

    StandbyTimeout: function () {
        execSync('powercfg -change -standby-timeout-ac 0')
        execSync('powercfg -change -standby-timeout-dc 0')
    }
}

module.exports = set