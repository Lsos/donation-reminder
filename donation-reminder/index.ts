import { getDonationReminder } from "./getDonationReminder";
import { skip } from "./skip";
import { styleConsoleLog } from "./utils/styleConsoleLog";
import { extractPackageJsonInfo } from "./extractPackageJsonInfo";
import { PackageJSON, LsosProject } from "./types";
import { Collector } from "./Collector";

export { donationReminder };

main();

const lsosProjects: LsosProject[] = [];

function donationReminder(packageJson: PackageJSON) {
  Collector.newCall();
  const { npmName, projectName, donationText } = extractPackageJsonInfo(
    packageJson
  );
  lsosProjects.push({ npmName, projectName, donationText });
}

async function main() {
  // Wait for the code of Lsos projects to call the `donationReminder()` function
  await Collector.waitForCalls();

  // Whether the donation-reminder should be shown
  if (skip()) {
    return;
  }

  const { strings, defaultStyle } = getDonationReminder(lsosProjects);
  console.log(...styleConsoleLog(strings, { defaultStyle }));
}
