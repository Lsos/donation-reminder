#!/usr/bin/env node

import { LsosConfig } from "../LsosConfig";
import { getNumberOfAuthors } from "./utils/getNumberOfAuthors";
import { getLsosProjects } from "./getLsosProjects";
import { replaceFileContent } from "./utils/replaceFileContent";
import assert = require("assert");

export { replaceFile_isRemoved };

postinstall();

async function postinstall() {
  await Promise.all([
    replaceFile_isRemoved(),
    replaceFile_numberOfAuthors(),
    replaceFile_lsosProjects(),
  ]);
}

function replaceFile_isRemoved() {
  const isRemoved = LsosConfig.donationReminderIsRemoved();
  assert([true, false].includes(isRemoved));
  set("../../env/isRemoved.js", "isRemoved", isRemoved);
}
async function replaceFile_numberOfAuthors() {
  const numberOfAuthors = await getNumberOfAuthors();
  assert(numberOfAuthors === null || numberOfAuthors >= 0);
  set("../../env/numberOfAuthors.js", "numberOfAuthors", numberOfAuthors);
}
async function replaceFile_lsosProjects() {
  const lsosProjects = await getLsosProjects();
  assert(lsosProjects.constructor === Array);
  set("../../env/lsosProjects.js", "lsosProjects", lsosProjects);
}

function set(filePath: string, variableName: string, variableValue: any) {
  filePath = require.resolve(filePath);
  replaceFileContent(filePath, variableName, variableValue);
}
