import { PackageJSON, LsosProject } from "../types";
import { validateLsosProject } from "./validateLsosProject";

export { extractLsosProjectInfo };

function extractLsosProjectInfo(packageJson: PackageJSON): LsosProject {
  const npmName = packageJson.name.split("/")[0];
  const projectName = packageJson?.lsos?.projectName;
  const donationText = packageJson?.lsos?.donationReminder?.text;
  const minNumberOfAuthors =
    packageJson?.lsos?.donationReminder?.minNumberOfAuthors;

  const lsosProjectInfo: LsosProject = {
    npmName,
    projectName,
    donationText,
    minNumberOfAuthors,
  };
  const propSources = {
    npmName: "name",
    projectName: "lsos.projectName",
    donationText: "lsos.donationReminder.text",
    minNumberOfAuthors: "lsos.donationReminder.minNumberOfAuthors",
  };
  validateLsosProject(lsosProjectInfo, propSources);

  return lsosProjectInfo;
}
