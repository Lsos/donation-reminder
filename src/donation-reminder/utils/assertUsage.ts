import { packageName } from "../../utils/packageName";

export { assertUsage };
export { assertWarning };

function assertUsage(bool: any, errorMsg: string) {
  if (bool) {
    return;
  }

  throw new Error("[" + packageName + "] " + errorMsg);
}

function assertWarning(bool: any, warningMsg: string) {
  if (bool) {
    return;
  }

  setTimeout(() => {
    throw new Error("[" + packageName + "] " + warningMsg);
  }, 0);
}
