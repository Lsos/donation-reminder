import { UserConfig } from "../UserConfig";
import { replaceFileContent } from "./utils/replaceFileContent";
import assert = require("assert");

export { findUserConfig };

function findUserConfig() {
  const userConfig = UserConfig.get();
  const isRemoved = userConfig?.donationReminder?.remove;
  // @ts-ignore
  assert({}?.doesntExist === null);
  assert([null, true, false].includes(isRemoved));
  replaceFileContent(
    require.resolve("../../env/isRemoved.js"),
    "isRemoved",
    isRemoved
  );
}
