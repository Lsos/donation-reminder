import { packageName } from "../../utils/packageName";

export { assertUsage };

function assertUsage(bool: any, userMsg: string) {
  if (bool) {
    return;
  }

  throw new Error("[" + packageName + "] " + userMsg);
}
