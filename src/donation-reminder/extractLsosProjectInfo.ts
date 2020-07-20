import { assertUsage } from "./utils/assertUsage";
import { getExportName } from "./utils/getExportName";
import { PackageJSON, LsosProject } from "../types";

export { extractLsosProjectInfo };

function extractLsosProjectInfo(packageJson: PackageJSON): LsosProject {
  const npmName = packageJson.name;
  const { projectName } = packageJson.lsos;
  const donationText = packageJson.lsos.donationReminder.text;
  const minNumberOfAuthors =
    packageJson.lsos.donationReminder.minNumberOfAuthors || 0;

  const lsosProjectInfo: LsosProject = {
    npmName,
    projectName,
    donationText,
    minNumberOfAuthors,
  };
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
    `The \`${getExportName()}\` function must be called with following missing arguments:` +
      argumentsMissing.map((arg) => "`" + arg + "`").join(", ") +
      "."
  );
}
