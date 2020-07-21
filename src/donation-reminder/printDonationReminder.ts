import { getDonationReminderLog } from "./getDonationReminderLog";
import { isDisabled } from "./isDisabled";
import { getConsoleLogArguments } from "./utils/styled-log/getConsoleLogArguments";
import { LogFragment } from "./utils/styled-log/types";
import { shuffle } from "./utils/shuffle";
import { extractLsosProjectInfo } from "./extractLsosProjectInfo";
import { validateLsosProject } from "./validateLsosProject";
import { PackageJSON, LsosProject } from "../types";
import {
  collectLsosProject,
  getCollectedLsosProjects,
} from "./collectLsosProjects";

export { printDonationReminder };

main();

// Projects who wish to show the donation-reminder to their users (we call them Lsos projects)
// call the `printDonationReminder` function.
function printDonationReminder(args: PackageJSON | LsosProject): void {
  const lsosProject: LsosProject = processArgs(args);
  collectLsosProject(lsosProject);
}

async function main() {
  // We retrieve all projects that called the `printDonationReminder` function.
  const lsosProjects = await getCollectedLsosProjects();

  // Whether the donation-reminder is disabled,
  // for example when the user has ran `yarn lsos remove`.
  if (isDisabled(lsosProjects)) {
    return;
  }

  print(lsosProjects);
}

function print(lsosProjects: LsosProject[]) {
  // We shuffle the projects to avoid the unfair situation
  // where the same projects are shown first.
  lsosProjects = shuffle(lsosProjects);

  // We compute the donation-reminder render model
  const donationReminderLog: LogFragment[] = getDonationReminderLog(
    lsosProjects
  );

  // We render the donation-reminder
  console.log(...getConsoleLogArguments(donationReminderLog));
}

function processArgs(args: PackageJSON | LsosProject): LsosProject {
  let lsosProject: LsosProject;

  if ((args as PackageJSON).name) {
    const packageJson: PackageJSON = args as PackageJSON;
    lsosProject = extractLsosProjectInfo(packageJson);
  } else {
    lsosProject = args as LsosProject;
  }

  validateLsosProject(lsosProject);
  return lsosProject;
}
