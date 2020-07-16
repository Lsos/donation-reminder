import packageJson = require("../../package.json");

export { assertUsage };

function assertUsage(bool: any, userMsg: string) {
  if (bool) {
    return;
  }

  throw new Error("[" + packageJson.name + "] " + userMsg);
}
