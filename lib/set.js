const { execSync } = require("child_process");
const run = require("./run");
const get = require("./get");
const core = require("./core");
const powershell = core.psDir();

var set = {
  PCName: async function (a) {
    //Changes PC name to user input.
    return core
      .elevate(`${powershell} -command "Rename-Computer -NewName '${a}'"`)
      .toString()
      .trim();
  },

  PCDescription: function (a) {
    //Changes PC description to user input.
    return core.elevate(`net config server /srvcomment:"${a}"`);
  },

  MonitorTimeout: function (a) {
    //Turn off screen after... (milliseconds).
    const command1 = `powercfg /change monitor-timeout-ac ${a}`;
    const command2 = `powercfg /change monitor-timeout-dc ${a}`;
    return execSync(`${command1} & ${command2}`);
  },

  StandbyTimeout: function (a) {
    //Put device to sleep after... (milliseconds).
    const command1 = `powercfg -change -standby-timeout-ac ${a}`;
    const command2 = `powercfg -change -standby-timeout-dc ${a}`;
    return execSync(`${command1} & ${command2}`);
  },

  PowerPlan: function (a) {
    //Changes power plan based on GUID. //Update to use number or string input.
    if (!get.PowerGUID(a)) run.registerPowerPlan(a);
    console.log("Power Mode: " + a);
    return execSync("powercfg /setactive " + get.PowerGUID(a));
  },

  Administrator: async function (YesOrNo) {
    //Enables or disables admin. Accepts "yes" or "no"
    return core.elevate(`net user administrator /active:${YesOrNo}`);
  },

  CoreParking: function () {
    //Unparks all cores.
    const key = "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583";
    const value1 = "ValueMin";
    const value2 = "ValueMax";
    const type = "REG_DWORD";
    const data = "0";
    const command1 = `reg.exe ADD "${key}" /v "${value1}" /t "${type}" /d "${data}" /f`;
    const command2 = `reg.exe ADD "${key}" /v "${value2}" /t "${type}" /d "${data}" /f`;
    const command3 = `${command1} & ${command2}`;
    return core.elevate(command3);
  },

  NetworkThrottling: async function () {
    //Disables network throttling.
    const key = "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile";
    const value1 = "NetworkThrottlingIndex";
    const value2 = "SystemResponsiveness";
    const type = "REG_DWORD";
    const data1 = "0xffffffff";
    const data2 = "0";
    const command1 = `reg.exe ADD "${key}" /v "${value1}" /t "${type}" /d "${data1}" /f`;
    const command2 = `reg.exe ADD "${key}" /v "${value2}" /t "${type}" /d "${data2}" /f`;
    const command3 = `${command1} & ${command2}`;
    return core.elevate(command3);
  },

  PrioritizeGames: async function () {
    //Gives games resource priority. 
    const key = "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games";
    const value1 = "GPU Priority";
    const value2 = "Priority";
    const value3 = "Scheduling Category";
    const value4 = "SFIO Priority";
    const type1 = "REG_DWORD";
    const type2 = "REG_SZ";
    const data1 = "8";
    const data2 = "6";
    const data3 = "High";
    const command1 = `reg.exe ADD "${key}" /v "${value1}" /t "${type1}" /d "${data1}" /f`;
    const command2 = `reg.exe ADD "${key}" /v "${value2}" /t "${type1}" /d "${data2}" /f`;
    const command3 = `reg.exe ADD "${key}" /v "${value3}" /t "${type2}" /d "${data3}" /f`;
    const command4 = `reg.exe ADD "${key}" /v "${value4}" /t "${type2}" /d "${data3}" /f`;
    const command5 = `${command1} & ${command2} & ${command3} & ${command4}`;
    return core.elevate(command5);
  },

  VisualEffects: async function (a) {
    //Sets performance option visual effects. 0 = auto, 1 = quality, 2 = performance, 3 = custom
    const key = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects";
    const value = "VisualFXSetting";
    const type = "REG_DWORD";
    const data = `${a}`;
    const command = `reg.exe ADD "${key}" /v "${value}" /t "${type}" /d "${data}" /f`;
    return core.elevate(command);
  },

  OldContextMenu: async function () {
    //Sets old context menu as default when right clicking on Windows 11. Requires restart.
    const key1 = "HKCU\\SOFTWARE\\CLASSES\\CLSID";
    const value1 = "{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}";
    const key2 = `${key1}\\${value1}`;
    const value2 = "InprocServer32"
    const key3 = `${key1}\\${value1}\\${value2}`;
    const value3 = '(Default)'
    const type = 'REG_SZ'
    const data = ""
    const command1 = `reg.exe ADD "${key1}\\${value1}"`;
    const command2 = `reg.exe ADD "${key2}\\${value2}"`;
    const command3 = `reg.exe ADD "${key3}" /v "${value3}" /t "${type}" /d "${data}" /f`;
    const command4 = `${command1} & ${command2} & ${command3}`;
    return core.elevate(command4);
  },

  DefaultMicVolume: async function (input) {
    const max = 65535
    let percent;
    if (typeof input != 'number') return console.log('Please enter a number.')
    percent = max * (input / 100)
    
    const command1 = `${powershell} -command "Start-Process -FilePath "${get.Dependencies()}\\nircmd.exe" -ArgumentList 'setdefaultsounddevice "Microphone" 0' -Wait"`;
    const command2 = `${powershell} -command "Start-Process -FilePath "${get.Dependencies()}\\nircmd.exe" -ArgumentList 'setvolume 1 ${percent} ${max}' -Wait"`;
    const command3 = `${command1} & ${command2}`;
    return execSync(command3);
  }
};

module.exports = set;
