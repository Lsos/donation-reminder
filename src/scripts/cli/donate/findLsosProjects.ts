import { join as pathJoin } from "path";
import { getAllDependencies } from "../../utils/getAllDependencies";
import { assertUsage } from "../../utils/assertUsage";
import { LsosProject } from "../../../types";

export { findLsosProjects };

async function findLsosProjects(): Promise<LsosProject[]> {
  const dependencies = await getAllDependencies();

  const lsosProjects = dependencies
    .map((dependency: string) => {
      const { packageJson, packageJsonPath } = getPackageJson(dependency);
      if (!packageJson?.lsos?.donationReminder) {
        return null;
      }
      const projectName = packageJson?.lsos?.projectName;
      const npmName = packageJson?.name;
      const { minNumberOfAuthors = 0 } = packageJson.lsos.donationReminder;
      const donationText = packageJson?.lsos?.donationReminder?.text;
      const lsosProject = {
        npmName,
        projectName,
        donationText,
        minNumberOfAuthors,
      };
      validate(lsosProject, packageJsonPath);
      return lsosProject;
    })
    .filter(Boolean);

  return lsosProjects;
}

function validate(lsosProject: LsosProject, packageJsonPath: string) {
  const {
    npmName,
    projectName,
    donationText,
    minNumberOfAuthors,
  } = lsosProject;
  assertUsage(
    projectName,
    "Property `" + packageJsonPath + "->lsos.projectName` is required."
  );
  assertUsage(npmName, "Property `package.json->name` is required.");
  assertUsage(
    minNumberOfAuthors >= 0,
    "Property `" +
      packageJsonPath +
      "->lsos.donationReminder.minNumberOfAuthors` should be a positive number."
  );
  assertUsage(
    donationText,
    "Property `" +
      packageJsonPath +
      "->lsos.donationReminder.text` is required."
  );
}

function getPackageJson(pathOrPkgName: string) {
  try {
    const packageJsonPath = require.resolve(
      pathJoin(pathOrPkgName, "package.json")
    );
    const packageJson = require(packageJsonPath);
    return { packageJson, packageJsonPath };
  } catch (_) {
    return null;
  }
}
