// This module implements a mechanism to collect
// calls made by package consumers.

import { assertUsage } from "../utils/assertUsage";
import { packageName } from "../../utils/packageName";
import { getExportName } from "../utils/getExportName";

export { Collector };

class Collector {
  private _collectionPhaseIsOver = false;
  async waitForCalls() {
    await Promise.resolve();
    this._collectionPhaseIsOver = true;
  }
  newCall() {
    if (this._collectionPhaseIsOver === false) {
      return;
    }
    throw_call_too_late_error();
  }
}

function throw_call_too_late_error() {
  const exportName = getExportName();

  assertUsage(
    false,
    [
      "",
      `The \`${exportName}\` function must be called synchronously after it is imported:`,
      "  ~~~js",
      `  import { ${exportName} } from "${packageName}";`,
      `  import packageJson from "../path/to/package.json";`,
      "",
      `  // The \`${exportName}\` function should be called right away`,
      `  ${exportName}(packageJson);`,
      "  ~~~",
      "Do not call `${exportName}` after an IO event or a promise and do not call it in an `async` function.",
    ].join("\n")
  );
}
