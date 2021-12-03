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

Set: 
* Set PC name.
* Set PC description.
* Set Monitor Timeout.
* Set Standby Timeout.
* Set Edge Homepage. (Upcoming)
* Set Chrome Homepage. (Upcoming)
* Set Lockscreen Image. (Upcoming)

Do:
* Take ownership of files/directories.
* Execute shell scripts.
* Execute powershell scripts.
* Restart system.
* Copy files.
* Rename files.
* Find process by file name.
* Find process by PiD.
* Kill process by file name.
* Register power plans.
* Initialize drives. (Upcoming)
* Shutdown system. (Upcoming)
* Format drives. (Upcoming)
* Unpin taskbar bloat. (Upcoming)
* Kill process by PiD. (Upcoming)