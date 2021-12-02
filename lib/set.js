const { execSync } = require('child_process')

var set = {

    PCName: function (a) {
        execSync(`WMIC computersystem where caption='%computername%' call rename name='` + a + `-PC'`)
    },

    PCDescription: function (a) {
        execSync('net config server /srvcomment:"' + a + 'PC"')
    },

    MonitorTimeout: function (a) {
        execSync('powercfg /change monitor-timeout-ac ' + a) //0 = never
        execSync('powercfg /change monitor-timeout-dc ' + a)
    },

    StandbyTimeout: function () {
        execSync('powercfg -change -standby-timeout-ac ' + a)
        execSync('powercfg -change -standby-timeout-dc ' + a)
    }
    
}

module.exports = set