import { UserConfig } from "../UserConfig";
import { replaceFileContent } from "./utils/replaceFileContent";
import assert = require("assert");

export { findUserConfig };

function findUserConfig() {
  const userConfig = UserConfig.get();
  const isRemoved = userConfig?.donationReminder?.remove ?? false;
  assert_ts_syntax();
  assert([true, false].includes(isRemoved));
  replaceFileContent(
    require.resolve("../../env/isRemoved.js"),
    "isRemoved",
    isRemoved
  );
}

function assert_ts_syntax() {
  // @ts-ignore
  assert({}?.doesntExist === undefined);
  // @ts-ignore
  assert({}?.doesntExist ?? null === null);
  assert({ doesntExist: 42 }?.doesntExist ?? null === 42);
}
