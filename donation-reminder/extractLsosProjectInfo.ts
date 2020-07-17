import { assertUsage } from "./utils/assertUsage";
import { donationReminder } from "../donation-reminder";
import { PackageJSON, LsosProject } from "../types";

export { extractLsosProjectInfo };

function extractLsosProjectInfo(packageJson: PackageJSON): LsosProject {
  const npmName = packageJson.name;
  const { projectName } = packageJson.lsos;
  const donationText = packageJson.lsos.donationReminder.text;

  const lsosProjectInfo: LsosProject = { npmName, projectName, donationText };
  validate(lsosProjectInfo);

  return lsosProjectInfo;
}

function validate(lsosProjectInfo: LsosProject) {
  const { npmName, projectName, donationText } = lsosProjectInfo;

  const functionName = donationReminder.name;
  const functionPrefix = `The \`${functionName}\` function `;

  const argumentsMissing = [
    !npmName && "name",
    !projectName && "lsos.projectName",
    !donationText && "lsos.donationReminder.text",
  ].filter(Boolean);

  assertUsage(
    argumentsMissing.length === 0,
    functionPrefix +
      `must be called with following missing arguments:` +
      argumentsMissing.map((arg) => "`" + arg + "`").join(", ") +
      "."
  );
}
