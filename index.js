const {
    getCPUName,
    getDrives,
    getGPUName,
    getMBName,
    getMBRevision,
    getMBSerial,
    getMemSize,
    getMemSpeed,
    getOSName,
    getPCName,
    getUser,
    getPowerGUID,
    getPowerScheme
} = require('./lib/get')

const {
    setPCName,
    setPCDescription,
    setMonitorTimeout,
    setStandbyTimeout
} = require('./lib/set')

module.exports = {
    //get
    getMBName,
    getMBRevision,
    getMBSerial,
    getUser,
    getCPUName,
    getDrives,
    getGPUName,
    getMemSize,
    getMemSpeed,
    getOSName,
    getPCName,
    getPowerGUID,
    getPowerScheme,
    //set
    setPCName,
    setPCDescription,
    setMonitorTimeout,
    setStandbyTimeout,
}
