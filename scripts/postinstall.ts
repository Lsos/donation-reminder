#!/usr/bin/env node

import { DonationReminderConfig } from "./LsosConfig";
import { getNumberOfAuthors } from "./utils/getNumberOfAuthors";
import { join as pathJoin } from "path";
import { getDonationReminderProjects } from "./getDonationReminderProjects";
import { replaceFileContent } from "./utils/replaceFileContent";

export { replaceFile_isRemoved };

postinstall();

async function postinstall() {
  try {
    await Promise.all([
      replaceFile_isRemoved(),
      replaceFile_numberOfAuthors(),
      replaceFile_donationReminderProjects(),
    ]);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function replaceFile_isRemoved() {
  set("../env/isRemoved.js", "isRemoved", DonationReminderConfig.isRemoved());
}
async function replaceFile_numberOfAuthors() {
  set(
    "../env/numberOfAuthors.js",
    "numberOfAuthors",
    await getNumberOfAuthors()
  );
}
function replaceFile_donationReminderProjects() {
  set(
    "../env/donationReminderProjects.js",
    "donationReminderProjects",
    getDonationReminderProjects()
  );
}

function set(filePath: string, variableName: string, variableValue: any) {
  filePath = pathJoin(__dirname, filePath);
  replaceFileContent(filePath, variableName, variableValue);
}
