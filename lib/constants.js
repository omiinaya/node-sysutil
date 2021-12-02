var constants = {

    userDirectory: process.env['USERPROFILE'],
    rootDirectory: process.env['USERPROFILE'].split('\\')[0] + '\\',
    desktopDirectory: process.env['USERPROFILE'] + '\\Desktop\\',
}

module.exports = constants

