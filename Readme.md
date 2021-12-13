*Node bindings for useful system integration utilities.*

# Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install node-sysutil
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
* Flush DNS.
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
* Unpark CPU cores. (Upcoming)
* Initialize drives. (Upcoming)
* Unpin taskbar bloat. (Upcoming)
* Kill process by PiD. (Upcoming)

# Usage

```js
const sys = require('node-sysutil')

console.log(sys.get.Drives())
```

## Get:

#### Get Motherboard Name:

```js
console.log(sys.get.MBName())
```

#### Get Motherboard Serial Number:

```js
console.log(sys.get.MBSerial())
```

#### Get Motherboard Revision Number:

```js
console.log(sys.get.MBRevision())
```

#### Get Windows Username:

```js
console.log(sys.get.User())
```

#### Get PC Name:

```js
console.log(sys.get.PCName())
```

#### Get Memory Clock Speed:

```js
console.log(sys.get.MemSpeed())
```

#### Get Memory Capacity:

```js
console.log(sys.get.MemSize())
```

#### Get GPU Name:

```js
console.log(sys.get.GPUName())
```

#### Get CPU Name:

```js
console.log(sys.get.CPUName())
```

#### Get List of Drives:

```js
console.log(sys.get.Drives())
```

#### Get Current Power Scheme:

```js
console.log(sys.get.PowerScheme())
```

#### Get Current System Date:

```js
console.log(sys.get.SystemDate())
```

#### Get Screen Resolution:

```js
console.log(sys.get.ScreenResolution())
```

## Set:

#### placeholder

## Run

#### placeholder

## To be continued...