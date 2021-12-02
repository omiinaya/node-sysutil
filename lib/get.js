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

module.exports={
    getMBName,
    getMBSerial,
    getMBRevision
}