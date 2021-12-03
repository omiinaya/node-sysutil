var scripts = {

    registerPowerPlan: function(a) {
        switch (a) {
            case 'High':
                execSync('powercfg -duplicatescheme 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c')
                break;
            case 'Ultimate':
                execSync('powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61')
                break;
        }
    },

    takeOwnership: function(a) {
        var child = elevated('takeown /F ' + a + ' /A /R /D Y', opts)
    
        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)
    
        child.on('close', function (code) {
            print('exit: ' + code)
        })
    }
}

module.exports = scripts