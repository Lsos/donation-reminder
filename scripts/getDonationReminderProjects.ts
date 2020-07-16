import { join as pathJoin } from "path";
import { getAllDependencies } from "./utils/getAllDependencies";
import { assertUsage } from "./utils/assertUsage";
export { getDonationReminderProjects };

async function getDonationReminderProjects(): Promise<object[]> {
  const dependencies = await getAllDependencies();

  const donationReminderProjects = dependencies
    .map((dependency: string) => {
      const { packageJson, packageJsonPath } = getPackageJson(dependency);
      if (!packageJson?.lsos?.donationReminder) {
        return null;
      }
      const { projectName } = packageJson.lsos.donationReminder;
      assertUsage(
        projectName,
        "Property `" +
          packageJsonPath +
          "->lsos.donationReminder.projectName` is required."
      );
      const npmName = packageJson.name;
      assertUsage(npmName, "Property `package.json->name` is required.");
      const { minNumberOfAuthors = 0 } = packageJson.lsos.donationReminder;
      assertUsage(
        minNumberOfAuthors >= 0,
        "Property `" +
          packageJsonPath +
          "->lsos.donationReminder.minNumberOfAuthors` should be a positive number."
      );
      const { text } = packageJson.lsos.donationReminder;
      assertUsage(
        text,
        "Property `" +
          packageJsonPath +
          "->lsos.donationReminder.text` is required."
      );
      return {
        npmName,
        projectName,
        text,
        minNumberOfAuthors,
      };
    })
    .filter(Boolean);

  return donationReminderProjects;
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
