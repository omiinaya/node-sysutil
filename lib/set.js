const { execSync } = require('child_process')
const { registerPowerPlan } = require('./do')
const get = require('./get')

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

    StandbyTimeout: function (a) {
        execSync('powercfg -change -standby-timeout-ac ' + a)
        execSync('powercfg -change -standby-timeout-dc ' + a)
    },

    PowerPlan(a) {
        if (!get.PowerGUID(a)) {
            registerPowerPlan(a)
            execSync('powercfg /setactive ' + get.PowerGUID(a))
            console.log('Power Mode: '+a)
        } else {
            execSync('powercfg /setactive ' + get.PowerGUID(a))
            console.log('Power Mode: '+a)
        }
    }
    
}

module.exports = set