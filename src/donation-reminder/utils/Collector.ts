// This module implements a mechanism to collect
// calls made by package consumers.

import { assertUsage } from "../utils/assertUsage";
import { packageName } from "../../utils/packageName";
import { exportName } from "../utils/exportName";

export { Collector };

class Collector {
  private _collectionPhaseIsOver = false;
  async waitForCalls() {
    await Promise.resolve();
    this._collectionPhaseIsOver = true;
  }
  newCall() {
    if (this._collectionPhaseIsOver === true) {
      return;
    }
    throw_call_too_late_error();
  }
}

function throw_call_too_late_error() {
  assertUsage(
    false,
    [
      `The \`${exportName}\` function must be called synchronously after it is imported:`,
      "  ~~~js",
      `  import { ${exportName} } from "${packageName}";`,
      `  import packageJson from "../path/to/package.json";`,
      "",
      `  // We call \`${exportName}\` right away`,
      `  ${exportName}(packageJson);`,
      "  ~~~",
      "Do not call `${exportName}` after an IO event or a promise and do not call it in an `async` function.",
    ].join("\n")
  );
}
