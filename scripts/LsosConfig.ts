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
    const state = this.isRemoved() ? "true" : "false";
    replaceFileContent(
      pathJoin(__dirname, "../src/skip.js"),
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
    this.ensureRemovalState();
  }
}

function replaceFileContent(
  filePath: string,
  delimiterBegin: string,
  delimiterEnd: string,
  newContent: string
) {
  assert(pathIsAbsolute(filePath));
  const fileContent = readFileSync(filePath, "utf8");
  const delimiterBeginSplit = fileContent.split(delimiterBegin);
  assert(delimiterBeginSplit.length === 2);
  const fileBegin = delimiterBeginSplit[0];
  const delimiterEndSplit = fileContent.split(delimiterEnd);
  assert(delimiterEndSplit.length === 2);
  const fileEnd = delimiterEndSplit[1];
  writeFileSync(
    filePath,
    fileBegin + delimiterBegin + newContent + delimiterEnd + fileEnd,
    "utf8"
  );
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
