import { homedir } from "os";
import { join as pathJoin } from "path";
import { writeFileSync, readFileSync } from "fs";

type ConfigJSON = {
  donationReminder?: {
    removed?: boolean;
  };
};

console.log(homedir());

export class DonationReminderConfig {
  static ensureRemovalState() {
    const state = DonationReminderConfig.isRemoved() ? "true" : "false";
    replaceFileContent(
      "../src/skip.js",
      "/*IS_REMOVED_BEGIN*/",
      "/*IS_REMOVED_END*/",
      state
    );
  }
  static isRemoved() {
    const lsosConfig = LsosConfig._get();
    return !!lsosConfig?.donationReminder?.removed;
  }
  static remove() {
    LsosConfig._set({
      donationReminder: {
        removed: true,
      },
    });
  }
}

function replaceFileContent(
  filePath: string,
  delimiterBegin: string,
  delimiterEnd: string,
  newContent: string
) {
  const filePathAbsolute = pathJoin(__dirname, filePath);
  const fileContent = readFileSync(filePathAbsolute, "utf8");
  const fileBegin = fileContent.split(delimiterBegin)[0];
  const fileEnd = fileContent.split(delimiterEnd)[1];
  writeFileSync(filePathAbsolute, fileBegin + newContent + fileEnd, "utf8");
}

class LsosConfig {
  constructor() {
    throw new Error(LsosConfig.name + " is a singleton");
  }
  static _get(): ConfigJSON {
    return readJsonFile(LsosConfig._path);
  }
  static _set(configsMod: ConfigJSON) {
    const configsOld = LsosConfig._get();
    const configsNew = Object.assign({}, configsOld, configsMod);
    writeJsonFile(LsosConfig._path, configsNew);
  }
  static get _path() {
    return getHomeSettingPath(".lsos.json");
  }
}

function writeJsonFile(path: string, obj: ConfigJSON): void {
  const content = JSON.stringify(obj, null, 2);
  writeFileSync(path, content + "\n", "utf8");
}

function readJsonFile(path: string): ConfigJSON {
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
