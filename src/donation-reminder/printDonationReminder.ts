import { PackageJSON, LsosProject } from "../types";
import { LogFragment } from "./utils/styled-log/types";

import { getConsoleLogArguments } from "./utils/styled-log/getConsoleLogArguments";
import { shuffle } from "./utils/shuffle";

import { getDonationReminderLog } from "./getDonationReminderLog";
import { isDisabled } from "./isDisabled";
import {
  collectLsosProject,
  getCollectedLsosProjects,
} from "./collectLsosProjects";
import { extractLsosProjectInfo } from "./extractLsosProjectInfo";
import { validateLsosProject } from "./validateLsosProject";

export { printDonationReminder };

main();

// Entry point: projects who wish to show the donation-reminder
// call the `printDonationReminder` function.
// We internally call them "Lsos projects".
function printDonationReminder(args: PackageJSON | LsosProject): void {
  const lsosProject: LsosProject = processArgs(args);
  collectLsosProject(lsosProject);
}

async function main() {
  // Retrieve all projects that called the `printDonationReminder` function
  const lsosProjects = await getCollectedLsosProjects();

  // Abort, if the donation-reminder is disabled,
  // for example when the user has ran `yarn lsos remove` or
  // when run in production.
  if (isDisabled(lsosProjects)) {
    return;
  }

  // `console.log` the donation-reminder
  print(lsosProjects);
}

function print(lsosProjects: LsosProject[]) {
  // Shuffle the list of projects to avoid the unfair situation
  // where the same projects are shown first.
  lsosProjects = shuffle(lsosProjects);

  // Compute the donation-reminder "render model" (render model = LogFragment[])
  const donationReminderLog: LogFragment[] = getDonationReminderLog(
    lsosProjects
  );

  // Render the donation-reminder "render model"
  console.log(...getConsoleLogArguments(donationReminderLog));
}

// Process function overloading and validate user input
function processArgs(args: PackageJSON | LsosProject): LsosProject {
  let lsosProject: LsosProject;

  // Process function overloading
  if ((args as PackageJSON).name) {
    const packageJson: PackageJSON = args as PackageJSON;
    lsosProject = extractLsosProjectInfo(packageJson);
  } else {
    lsosProject = args as LsosProject;
  }

  // Throw an exception upon wrong usage of `printDonationReminder()`
  validateLsosProject(lsosProject);

  return lsosProject;
}
