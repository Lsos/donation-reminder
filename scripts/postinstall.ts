#!/usr/bin/env node

import { DonationReminderConfig } from "./LsosConfig";
import { getNumberOfAuthors } from "./utils/getNumberOfAuthors";
import { join as pathJoin } from "path";
import { getDonationReminderProjects } from "./getDonationReminderProjects";
import { replaceFileContent } from "./utils/replaceFileContent";
import assert = require("assert");

export { replaceFile_isRemoved };

postinstall();

async function postinstall() {
  await Promise.all([
    replaceFile_isRemoved(),
    replaceFile_numberOfAuthors(),
    replaceFile_donationReminderProjects(),
  ]);
}

function replaceFile_isRemoved() {
  const isRemoved = DonationReminderConfig.isRemoved();
  assert([true, false].includes(isRemoved));
  set("../env/isRemoved.js", "isRemoved", isRemoved);
}
async function replaceFile_numberOfAuthors() {
  const numberOfAuthors = await getNumberOfAuthors();
  assert(numberOfAuthors === null || numberOfAuthors >= 0);
  set("../env/numberOfAuthors.js", "numberOfAuthors", numberOfAuthors);
}
async function replaceFile_donationReminderProjects() {
  const donationReminderProjects = await getDonationReminderProjects();
  assert(donationReminderProjects.constructor === Array);
  set(
    "../env/donationReminderProjects.js",
    "donationReminderProjects",
    donationReminderProjects
  );
}

function set(filePath: string, variableName: string, variableValue: any) {
  filePath = pathJoin(__dirname, filePath);
  replaceFileContent(filePath, variableName, variableValue);
}
