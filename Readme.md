*Node bindings for useful system integration utilities.*

## Usage

```js
const sys = require('node-sysutil')

console.log(sys.get.Drives())
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install node-sysutil
```

## Features
Get:
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

Set: 
* Set PC name.
* Set PC description.
* Set Monitor Timeout.
* Set Standby Timeout.
* Set current power plan.
* Set Edge Homepage. (Upcoming)
* Set Chrome Homepage. (Upcoming)
* Set Lockscreen Image. (Upcoming)

Do:
* Copy files.
* Disk cleanup.
* Rename files.
* Restart system.
* Clear event logs.
* Register power plans.
* Find process by PiD.
* Find process by file name.
* Kill process by file name.
* Execute shell scripts.
* Execute powershell scripts.
* Toggle administrator account.
* Take ownership of files/directories.
* Shutdown system. (Upcoming)
* Unpark CPU cores. (Upcoming)
* Initialize drives. (Upcoming)
* Format drives. (Upcoming)
* Unpin taskbar bloat. (Upcoming)
* Kill process by PiD. (Upcoming)
* Toggle Hibernation. (Upcoming)