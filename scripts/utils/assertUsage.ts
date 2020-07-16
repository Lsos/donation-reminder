import packageJson = require("../../package.json");

export { assertUsage };

function assertUsage(bool: any, userMsg: string) {
  if (bool) {
    return;
  }
  const { stack } = new Error();
  console.log();
  console.log(stack);
  console.log();
  console.log(boldRed("[" + packageJson.name + "] " + userMsg));
  console.log();
}

function boldRed(str: string): string {
  return "[1m[31m" + str + "[39m[22m";
}
