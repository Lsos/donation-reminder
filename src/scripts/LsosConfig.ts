import { homedir } from "os";
import { join as pathJoin } from "path";
import { writeFileSync, readFileSync } from "fs";
import { replaceFile_isRemoved } from "./postinstall/postinstall";

export { LsosConfig };

type DonationReminderRemoveConfig = boolean & {
  _brand?: "DonationReminderRemoveConfig";
};

type DonationReminderConfig = {
  remove?: DonationReminderRemoveConfig;
};
type LsosConfigJSON = {
  donationReminder?: DonationReminderConfig;
};

class LsosConfig {
  static donationReminderIsRemoved(): boolean {
    const lsosConfig = this._get();
    return !!lsosConfig?.donationReminder?.remove;
  }
  static removeDonationReminder() {
    this._set({
      donationReminder: {
        remove: true,
      },
    });
    replaceFile_isRemoved();
  }
  static _get(): LsosConfigJSON {
    return readJsonFile(this._path);
  }
  static _set(configsMod: LsosConfigJSON) {
    const configsOld = this._get();
    const configsNew = Object.assign({}, configsOld, configsMod);
    writeJsonFile(this._path, configsNew);
  }
  static get _path() {
    return getHomeSettingPath(".lsos.json");
  }
  constructor() {
    throw new Error(LsosConfig.name + " is a singleton");
  }
}

function writeJsonFile(path: string, obj: LsosConfigJSON): void {
  const content = JSON.stringify(obj, null, 2);
  writeFileSync(path, content + "\n", "utf8");
}

function readJsonFile(path: string): LsosConfigJSON {
  try {
    const content = readFileSync(path, "utf8");
    const obj = JSON.parse(content);
    return obj;
  } catch (err) {
    return {};
  }
}

function getHomeSettingPath(settingFileName: string): string {
  return pathJoin(homedir(), settingFileName);
}
