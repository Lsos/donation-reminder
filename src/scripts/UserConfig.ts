import { homedir } from "os";
import { join as pathJoin } from "path";
import { writeFileSync, readFileSync } from "fs";
import { findUserConfig } from "./postinstall/findUserConfig";

export { UserConfig };

type UserConfigData = {
  donationReminder?: {
    remove?: boolean;
  };
};

class UserConfig {
  static get(): UserConfigData {
    return readJsonFile(this._configFile);
  }
  static set(configNew: UserConfigData) {
    writeJsonFile(this._configFile, configNew);
    findUserConfig();
  }
  private static get _configFile() {
    return getHomeSettingPath(".lsos.json");
  }
  constructor() {
    throw new Error(UserConfig.name + " is a singleton");
  }
}

function getHomeSettingPath(settingFileName: string): string {
  return pathJoin(homedir(), settingFileName);
}

function writeJsonFile(path: string, obj: UserConfigData): void {
  const content = JSON.stringify(obj, null, 2);
  writeFileSync(path, content + "\n", "utf8");
}

function readJsonFile(path: string): UserConfigData {
  try {
    const content = readFileSync(path, "utf8");
    const obj = JSON.parse(content);
    return obj;
  } catch (err) {
    return {};
  }
}
