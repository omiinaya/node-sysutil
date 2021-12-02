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
} = require('./lib/get')

module.exports = {
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
    getPCName
}