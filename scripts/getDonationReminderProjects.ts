import { join as pathJoin } from "path";
import { unique } from "./utils/unique";
export { getDonationReminderProjects };
import assert = require("assert");

function getDonationReminderProjects() {
  const userProjectRootDir = process.cwd();

  const userPackageJson = getPackageJson(userProjectRootDir);
  assert(userPackageJson);

  const dependencies = getAllDependencies(userPackageJson);
  const donationReminderProjects = dependencies
    .map((dependency: string) => {
      const pkgJson = getPackageJson(dependency);
      if (!pkgJson?.lsos?.donationReminder) {
        return null;
      }
      const { projectName } = pkgJson.lsos;
      assert(projectName);
      const packageName = pkgJson.name;
      assert(packageName);
      const { text } = pkgJson.lsos.donationReminder;
      const { minNumberOfAuthors = 0 } = pkgJson.lsos.donationReminder;
      assert(minNumberOfAuthors >= 0);
      assert(text);
      return {
        packageName,
        projectName,
        text,
        minNumberOfAuthors,
      };
    })
    .filter(Boolean);
  return donationReminderProjects;
}

function getPackageJson(pathOrPkgName: string) {
  const packageJsonPath = pathJoin(pathOrPkgName, "package.json");
  try {
    return require(packageJsonPath);
  } catch (_) {
    return null;
  }
}

function getAllDependencies(packageJson: any) {
  let dependencies = [];
  Object.entries(packageJson).forEach(([prop, val]) => {
    if (prop.toLowerCase().endsWith("dependencies")) {
      dependencies.push(...Object.keys(val));
    }
  });
  dependencies = unique(dependencies);
  return dependencies;
}
