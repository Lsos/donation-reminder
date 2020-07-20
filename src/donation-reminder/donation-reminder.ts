import { getDonationReminderLog } from "./getDonationReminderLog";
import { isDisabled } from "./isDisabled";
import { getConsoleLogArguments } from "./utils/styled-log/getConsoleLogArguments";
import { LogFragment } from "./utils/styled-log/types";
import { shuffle } from "./utils/shuffle";
import { extractLsosProjectInfo } from "./extractLsosProjectInfo";
import { PackageJSON, LsosProject } from "../types";
import {
  collectLsosProject,
  getCollectedLsosProjects,
} from "./collectLsosProjects";

export { donationReminder };

main();

// Projects who wish to show the donation-reminder to their users (we call them Lsos projects)
// call the `donationReminder` function.
function donationReminder(packageJson: PackageJSON) {
  const lsosProject: LsosProject = extractLsosProjectInfo(packageJson);
  collectLsosProject(lsosProject);
}

async function main() {
  // We retrieve all projects that called the `donationReminder` function.
  const lsosProjects = await getCollectedLsosProjects();

  // Whether the donation-reminder is disabled
  if (isDisabled(lsosProjects)) {
    return;
  }

  showDonationReminder(lsosProjects);
}

function showDonationReminder(lsosProjects: LsosProject[]) {
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
