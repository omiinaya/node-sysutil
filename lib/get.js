const { execSync } = require('child_process')

function getMBName() {
    return execSync('wmic baseboard get product').toString().replace("Product", "").trim()
}

function getMBSerial() {
    return execSync('wmic baseboard get serialnumber').toString().replace("SerialNumber", "").trim()
}

function getMBRevision() {
    return execSync('wmic baseboard get version').toString().replace("Version", "").trim()
}

function getUser() {
    return execSync('echo %USERNAME%').toString().trim()
}

function getPCName() {
    return execSync('echo %computername%').toString().trim()
}

function getMemSpeed() {
    var output = execSync('wmic memorychip get Configuredclockspeed').toString().replace('ConfiguredClockSpeed', '').trim()
    var speed = output.split(' ')[0] + " MHz"
    return speed
}

function getMemSize() {
    var output = execSync('wmic computersystem get TotalPhysicalMemory').toString().replace('TotalPhysicalMemory', '').trim()
    var gb = parseInt(output) / 1000000000
    var size = Math.round(gb)
    return size
}

function getGPUName() {
    var x = execSync('wmic path win32_VideoController get name').toString().replace('Name', '')
    var y = x.split('\n').filter(str => isEmpty(str))
    if (y.length > 1) {
        return y[1].trim()
    } else {
        return x.trim()
    }
}

function getCPUName() {
    return execSync('wmic cpu get name').toString().replace('Name', '').trim()
}

function getOSName() {
    return execSync('wmic os get Caption').toString().replace('Caption', '').trim()
}

function getDrives() {
    var output = execSync('wmic logicaldisk get name, size, volumename, description').toString().split('\n')
    output.shift()
    var drives = output.filter(lines => isEmpty(lines))
    return drives
}

module.exports={
    getMBName,
    getMBSerial,
    getMBRevision,
    getUser,
    getPCName,
    getMemSpeed,
    getMemSize,
    getGPUName,
    getOSName,
    getCPUName,
    getDrives
}