import { donationReminder } from "../src";
import { assertUsage } from "../scripts/utils/assertUsage";
import donationReminderPackageJson = require("../package.json");

export { Collector };

let collectionPhaseIsOver = false;

class Collector {
  constructor() {
    throw new Error(Collector.name + " is a singleton");
  }
  static newCall() {
    validate();
  }
  static async waitForCalls() {
    await Promise.resolve();
    collectionPhaseIsOver = true;
  }
}

function validate() {
  const functionName = donationReminder.name;
  const donationReminderNpmName = donationReminderPackageJson.name;

  assertUsage(
    !collectionPhaseIsOver === false,
    `The \`${functionName}\` function must be called synchronously after your import it:\n` +
      "  ~~~js" +
      `  import { ${functionName} } from "${donationReminderNpmName}";\n` +
      `  import packageJson from "../path/to/package.json";\n` +
      `  ${functionName}();\n` +
      "  ~~~" +
      "Do not call `${functionName}` after an IO event or a promise and do not call it in an `async` function."
  );
}
