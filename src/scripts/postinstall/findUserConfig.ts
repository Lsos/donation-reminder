import { UserConfig } from "../UserConfig";
import { replaceFileContent } from "./utils/replaceFileContent";

export { findUserConfig };

function findUserConfig() {
  let userConfig = UserConfig.get();
  userConfig = extractInfo(userConfig);
  replaceFileContent(
    require.resolve("../../env/userConfig.js"),
    "userConfig",
    userConfig
  );
}

function extractInfo(userConfig) {
  if (!userConfig) {
    return null;
  }
  const userConfig__extract: any = {};
  if (userConfig?.donationReminder?.remove) {
    userConfig__extract.donationReminder = { remove: true };
  }

  return userConfig__extract;
}
