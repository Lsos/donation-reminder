import { assertUsage } from "./utils/assertUsage";
import { exportName } from "./utils/exportName";
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

  const argumentsMissing = [
    !npmName && "name",
    !projectName && "lsos.projectName",
    !donationText && "lsos.donationReminder.text",
  ].filter(Boolean);

  assertUsage(
    argumentsMissing.length === 0,
    `The \`${exportName}\` function must be called with following missing arguments:` +
      argumentsMissing.map((arg) => "`" + arg + "`").join(", ") +
      "."
  );
}
