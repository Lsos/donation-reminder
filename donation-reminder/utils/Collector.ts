// This module implements a mechanism to collect
// calls made by package consumers.

import { assertUsage } from "../utils/assertUsage";
import { packageName } from "../utils/packageName";

export { Collector };

class Collector {
  private _collectionPhaseIsOver = false;
  async waitForCalls() {
    await Promise.resolve();
    this._collectionPhaseIsOver = true;
  }
  newCall(callerName: string) {
    if (this._collectionPhaseIsOver === true) {
      return;
    }
    throw_call_too_late_error(callerName);
  }
}

function throw_call_too_late_error(callerName: string) {
  assertUsage(
    false,
    [
      `The \`${callerName}\` function must be called synchronously after it is imported:`,
      "  ~~~js",
      `  import { ${callerName} } from "${packageName}";`,
      `  import packageJson from "../path/to/package.json";`,
      "",
      `  // We call \`${callerName}\` right away`,
      `  ${callerName}(packageJson);`,
      "  ~~~",
      "Do not call `${callerName}` after an IO event or a promise and do not call it in an `async` function.",
    ].join("\n")
  );
}
