import { homedir } from "os";
import { join as pathJoin, isAbsolute as pathIsAbsolute } from "path";
import { writeFileSync, readFileSync } from "fs";
import assert = require("assert");

type ConfigJSON = {
  donationReminder?: {
    removed?: boolean;
  };
};

export class DonationReminderConfig {
  static ensureRemovalState() {
    const fileContent = `export const isRemoved = ${
      this.isRemoved() ? "true" : "false"
    };`;
    replaceFileContent(pathJoin(__dirname, "../src/isRemoved.js"), fileContent);
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
    this.ensureRemovalState();
  }
}

function replaceFileContent(filePath: string, newContent: string) {
  assert(pathIsAbsolute(filePath));
  writeFileSync(filePath, newContent, "utf8");
}

class LsosConfig {
  constructor() {
    throw new Error(LsosConfig.name + " is a singleton");
  }
  static _get(): ConfigJSON {
    return readJsonFile(this._path);
  }
  static _set(configsMod: ConfigJSON) {
    const configsOld = this._get();
    const configsNew = Object.assign({}, configsOld, configsMod);
    writeJsonFile(this._path, configsNew);
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
