*Node bindings for useful system integration utilities.*

# Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install node-sysutil
```

Then import using:

```js
const sys = require('node-sysutil')
```

# Features
## Get:
* Get motherboard name.
* Get motherboard serial number.
* Get motherboard revision.
* Get amount of RAM installed.
* Get speed of RAM installed.
* Get windows username.
* Get name of PC
* Get description of PC
* Get name of GPU.
* Get name of CPU.
* Get OS name.
* Get available drives.
* Get current power scheme.
* Get screen resolution (Untested on multi-screen setups).
* Get CPU temp. (Upcoming)

## Set: 
* Set PC name.
* Set PC description.
* Set user password.
* Set Monitor Timeout.
* Set Standby Timeout.
* Set current power plan.
* Set Webcam permissions.
* Set Location permissions.
* Set Microphone permissions.
* Set App Diagnostics permissions.
* Set Activity History permissions.
* Set UAC status.
* Set Windows Transparency.
* Set Hibernation status.
* Set Administrator status.
* Set Windows Defender status.
* Set Edge Homepage. (Upcoming)
* Set Chrome Homepage. (Upcoming)
* Set Desktop Image. (Upcoming)
* Set Lockscreen Image. (Upcoming)

## Run:
* Copy files.
* Disk cleanup.
* Rename files.
* Format drives.
* Logout system.
* Restart system.
* Shutdown system.
* Clear event logs.
* Register power plans.
* Find process by PiD.
* Find process by file name.
* Kill process by file name.
* Execute shell scripts.
* Execute powershell scripts.
* Toggle administrator account.
* Take ownership of files/directories.
* Unpark CPU cores.
* Initialize drives. (Upcoming)
* Unpin taskbar bloat. (Upcoming)
* Kill process by PiD. (Upcoming)
