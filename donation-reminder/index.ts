import { getDonationReminderLog } from "./getDonationReminderLog";
import { skip } from "./skip";
import { computeConsoleLogArguments } from "./utils/computeConsoleLogArguments";
import { extractPackageJsonInfo } from "./extractPackageJsonInfo";
import { PackageJSON, LsosProject } from "../types";
import { Collector } from "./Collector";

export { donationReminder };

main();

const lsosProjects: LsosProject[] = [];

function donationReminder(packageJson: PackageJSON) {
  Collector.newCall();
  const {
    npmName,
    projectName,
    donationText,
  }: LsosProject = extractPackageJsonInfo(packageJson);
  lsosProjects.push({ npmName, projectName, donationText });
}

async function main() {
  // Wait for Lsos projects code to call the `donationReminder()` function
  await Collector.waitForCalls();

  // Whether the donation-reminder should be shown
  if (skip()) {
    return;
  }

  showDonationReminder();
}

function showDonationReminder() {
  const donationReminderLog = getDonationReminderLog(lsosProjects);
  console.log(...computeConsoleLogArguments(donationReminderLog));
}
