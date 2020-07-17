import { getDonationReminderLog } from "./getDonationReminderLog";
import { skip } from "./skip";
import { computeConsoleLogArguments } from "./utils/computeConsoleLogArguments";
import { extractLsosProjectInfo } from "./extractLsosProjectInfo";
import { PackageJSON, LsosProject } from "../types";
import {
  collectLsosProject,
  getCollectedLsosProjects,
} from "./collectLsosProjects";

main();

export { donationReminder };

// Projects who wish to show the donation-reminder to their users (we call them Lsos projects)
// call the `donationReminder` function.
function donationReminder(packageJson: PackageJSON) {
  const lsosProject: LsosProject = extractLsosProjectInfo(packageJson);
  collectLsosProject(lsosProject);
}

async function main() {
  // We retrieve all projects that called the `donationReminder` function.
  const lsosProjects = await getCollectedLsosProjects();

  // Whether the donation-reminder should actually be shown
  if (skip()) {
    return;
  }

  showDonationReminder(lsosProjects);
}

function showDonationReminder(lsosProjects: LsosProject[]) {
  const donationReminderLog = getDonationReminderLog(lsosProjects);
  console.log(...computeConsoleLogArguments(donationReminderLog));
}
