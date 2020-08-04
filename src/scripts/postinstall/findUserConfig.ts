import { UserConfig, UserConfigData } from "../UserConfig";
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

function extractInfo(userConfig: UserConfigData): Partial<UserConfigData> {
  if (!userConfig) {
    return null;
  }

  const userConfig__extracted: UserConfigData = {};
  if (userConfig?.donationReminder?.remove) {
    userConfig__extracted.donationReminder = { remove: true };
  }

  return userConfig__extracted;
}
