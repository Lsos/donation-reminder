import { homedir } from "os";
import { join as pathJoin, isAbsolute as pathIsAbsolute } from "path";
import { writeFileSync, readFileSync } from "fs";
import { exec } from "child_process";
import assert = require("assert");

type ConfigJSON = {
  donationReminder?: {
    removed?: boolean;
  };
};

export class DonationReminderConfig {
  static ensureRemovalState() {
    const filePath = pathJoin(__dirname, "../src/isRemoved.js");
    const variableName = "isRemoved";
    const variableValue = this.isRemoved() ? "true" : "false";
    replaceFileContent(filePath, variableName, variableValue);
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
  variableName: string,
  variableValue: string
) {
  const {
    boilerplateLinesBefore,
    boilerplateLinesAfter,
  } = getBoilerplateLines();
  writeFileSync(
    filePath,
    [
      ...boilerplateLinesBefore,
      getContentLine(variableValue),
      ...boilerplateLinesAfter,
    ].join("\n"),
    "utf8"
  );

  return;

  function getContentLine(variableValue: string) {
    return getContentLineBegin() + variableValue + ";";
  }
  function getContentLineBegin() {
    return "exports." + variableName + " = ";
  }

  function getBoilerplateLines() {
    assert(pathIsAbsolute(filePath));
    const fileContent = readFileSync(filePath, "utf8");
    const fileLines = fileContent.split("\n");
    const contentLineBegin = getContentLineBegin();
    const contentLineIndex = findLastIndex(fileLines, (line) =>
      line.startsWith(contentLineBegin)
    );
    assert(contentLineIndex > -1);
    const boilerplateLinesBefore = fileLines.slice(0, contentLineIndex);
    const boilerplateLinesAfter = fileLines.slice(
      contentLineIndex + 1,
      fileLines.length
    );
    assert(
      fileLines.length ===
        boilerplateLinesBefore.length + boilerplateLinesAfter.length + 1
    );
    return { boilerplateLinesBefore, boilerplateLinesAfter };
  }
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

/**
 * Returns the index of the last element in the array where predicate is true, and -1
 * otherwise.
 * @param array The source array to search in
 * @param predicate find calls predicate once for each element of the array, in descending
 * order, until it finds one where predicate returns true. If such an element is found,
 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
 */
function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}

function execCmd(cmd: string): Promise<string> {
  const { promise, resolvePromise, rejectPromise } = genPromise();

  exec(cmd, {}, (err: Error, stdout: string, stderr: string) => {
    if (!err && !stderr) {
      resolvePromise(stdout);
      return;
    }
    if (err) {
      rejectPromise(err);
      return;
    }
    assert(stderr);
    rejectPromise(stderr);
  });

  return promise;
}

function genPromise() {
  let resolvePromise: (value?: any) => void;
  let rejectPromise: (value?: any) => void;
  const promise: Promise<any> = new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  return { promise, resolvePromise, rejectPromise };
}

async function getNumberOfAuthors() {
  const gitAuthorList = await getGitAuthorList();
}

async function getGitAuthorList() {
  try {
    return await execCmd("git shortlog --summary --numbered --email --all");
  } catch (_) {
    return null;
  }
}

/*
async function gitIsAvailable() {
    try {
      await execCmd('git --version');
      return true;
    } catch(err) {
      return false;
    }
}
*/
