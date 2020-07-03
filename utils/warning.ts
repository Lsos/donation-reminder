import assert from "assert";
import { isDev } from "../utils/isDev";

export { warning };

function warning(bool: any, msg?: any) {
  if (!isDev()) {
    return;
  }
  assert(bool, msg);
}
