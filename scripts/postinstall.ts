#!/usr/bin/env node

import { DonationReminderConfig } from "./LsosConfig";
import { getNumberOfAuthors } from "./utils/getNumberOfAuthors";
import { join as pathJoin } from "path";
import { getDonationReminderProjects } from "./getDonationReminderProjects";
import { replaceFileContent } from "./utils/replaceFileContent";

export { replaceFile_isRemoved };

postinstall();

async function postinstall() {
  await Promise.all([
    replaceFile_isRemoved(),
    replaceFile_numberOfAuthors(),
    replaceFile_donationReminderProjects(),
  ]);
}

async function replaceFile_isRemoved() {
  await set(
    "../env/isRemoved.js",
    "isRemoved",
    DonationReminderConfig.isRemoved()
  );
}
async function replaceFile_numberOfAuthors() {
  await set(
    "../env/numberOfAuthors.js",
    "numberOfAuthors",
    getNumberOfAuthors()
  );
}
async function replaceFile_donationReminderProjects() {
  await set(
    "../env/donationReminderProjects.js",
    "donationReminderProjects",
    getDonationReminderProjects()
  );
}

async function set(filePath, variableName, variableValue) {
  filePath = pathJoin(__dirname, filePath);
  await replaceFileContent(filePath, variableName, variableValue);
}
