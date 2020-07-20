import { UserConfig } from "../UserConfig";
import {
  symbolConfirmation,
  symbolSuccess,
  stylePath,
} from "./utils/cli-style";
import { splitByLine } from "../postinstall/utils/split";

export { remove };

function remove() {
  const isAlreadyRemoved: boolean = UserConfig.get()?.donationReminder?.remove;

  if (!isAlreadyRemoved) {
    UserConfig.set({
      donationReminder: {
        remove: true,
      },
    });
  }

  console.log(
    (isAlreadyRemoved ? symbolConfirmation : symbolSuccess) +
      "Lsos config " +
      (isAlreadyRemoved ? "" : "saved ") +
      "at " +
      stylePath(UserConfig.configFilePath) +
      ":"
  );
  console.log(prettyUserConfig());

  console.log();
  if (isAlreadyRemoved) {
    console.log(symbolConfirmation + "Donation-reminder already removed.");
  } else {
    console.log(symbolSuccess + "Donation-reminder successfully removed.");
  }
  console.log();
}

function prettyUserConfig() {
  const userConfig = UserConfig.get();
  const lines = splitByLine(JSON.stringify(userConfig, null, 2));
  const TAB = "    ";
  const withTabs = lines.map((line) => TAB + line).join("\n");
  return withTabs;
}
