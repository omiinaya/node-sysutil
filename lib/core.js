const { execSync, spawn } = require("child_process");
const elExec = require("@mh-cbon/aghfabsowecwn").exec;

const opts = {
  bridgeTimeout: 5000,
  stdio: "pipe",
  env: {
    FORCE_COLOR: 1,
    DEBUG: "*",
  },
};

const core = {
  isNotEmpty: function (a) {
    return a.trim().length > 0;
  },

  isAdmin: function () {
    try {
      execSync("net session");
      return true;
    } catch {
      return false;
    }
  },

  nearestPowerOf2: function (a) {
    if (a <= 0) return 0;
    return 1 << (31 - Math.clz32(a));
  },

  pShellExec: function (a) {
    const child = spawn(
      "powershell.exe",
      ["-ExecutionPolicy", "ByPass", "-File", a],
      { shell: true, detached: true }
    );

    child.stdout.on("data", function (data) {
      console.log("out: " + data);
    });

    child.stderr.on("data", function (data) {
      console.log("err: " + data);
    });
  },

  elevate: async function (a) {
    try {
      if (this.isAdmin()) {
        return execSync(a).toString().trim();
      }
      throw new Error('Not running as admin, need elevation');
    } catch {
      let child = elExec(a, opts, function (err, stdout, stderr) {
        if (err && err.code === "ECONNREFUSED")
          console.log("UAC was probably not validated.");
        if (stdout) console.log("stdout=%s", stdout);
        if (stderr) console.error("stderr=%s", stderr);
      });

      child.stdout.on("data", function (data) {
        console.log("out: " + data);
      });
    }
  },

  findProcessByName: function (a) {
    try {
      return execSync("tasklist /NH | findstr /I " + a)
        .toString()
        .trim();
    } catch {
      return "Process not found";
    }
  },

  findProcessByPiD: function (a) {
    try {
      return execSync(`tasklist /svc /FI "PID eq ${a}"`).toString().trim();
    } catch {
      return "Process not found";
    }
  },

  findProcessByTitle: function (a) {
    try {
      return execSync('tasklist /FI "windowtitle eq ' + a + '"')
        .toString()
        .trim();
    } catch {
      return "Process not found";
    }
  },

  findProcessTitleByName: function (a) {
    try {
      return execSync('tasklist /FI "IMAGENAME eq ' + a + '" /v')
        .toString()
        .trim();
    } catch {
      return "Process not found";
    }
  },

  killProcessByName: function (a) {
    try {
      return execSync("taskkill /IM " + a + " /F");
    } catch {
      return "Process not found or already terminated";
    }
  },

  regQueryKeys: async function (key) {
    const command = `reg query "${key}"`;
    return execSync(command).toString().trim();
  },

  regQueryValue: async function (key, value) {
    const command = `reg query "${key}" /v ${value}`;
    return execSync(command).toString().trim();
  },

  regPutSZ: async function (key, value) {
    //v = value, t = type, d = data, f = force
    const query = await this.regQueryValue(key, value);
    const result = query.toString().trim().split("    ");
    const parsedResult = result[result.length - 1];
    const booleanState = this.parseAcToBool(parsedResult);
    const data = this.parseBoolToAc(!booleanState);
    const command = `reg.exe ADD "${key}" /v ${value} /t REG_SZ /d ${data} /f`;
    return command;
  },

  regPutDWORD: async function (key, value) {
    //v = value, t = type, d = data, f = force
    const query = await this.regQueryValue(key, value);
    const result = query.toString().trim().split("    ");
    const parsedResult = result[result.length - 1].replace("0x", "");
    const booleanState = Boolean(parseInt(parsedResult));
    const data = Number(!booleanState);
    const command = `reg.exe ADD "${key}" /v "${value}" /t REG_DWORD /d ${data} /f`;
    return command;
  },

  //may be necessary when changing theme options
  updateSystemParameters: function () {
    return elExec("RUNDLL32.EXE user32.dll,UpdatePerUserSystemParameters");
  },

  //receives an action such as "Allow" or "Deny" and transforms to true or false.
  parseAcToBool(action) {
    if (action === "Allow") return true;
    return false;
  },

  //receives a boolean such as "true" or "false" and transforms to Allow or Deny.
  parseBoolToAc(bool) {
    if (bool === true) return "Allow";
    return "Deny";
  },

  //receives an action such as "Allow" or "Deny" and transforms to 1 or 0.
  parseAcToInt(action) {
    if (action === "Allow") return 1;
    return 0;
  },

  psDir: function () {
    return "C:\\Windows\\System32\\WindowsPowershell\\v1.0\\powershell.exe";
  },

  pCfgDir: function () {
    return "C:\\Windows\\System32\\powercfg.exe"
  },

  nsLDir: function () {
    return "C:\\Windows\\System32\\nslookup.exe"
  }
};

module.exports = core;

