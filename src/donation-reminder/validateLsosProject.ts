import { assertUsage } from "./utils/assertUsage";
import { getExportName } from "./utils/getExportName";
import { LsosProject } from "../types";

const AUTHORIZED_PROJECTS = [
  "@goldpage",
  "@wildcard-api",
  "my-open-source-project",
  "react-table",
  "material-table",
];

export { validateLsosProject };

type PropSources = {
  npmName: string;
  projectName: string;
  donationText: string;
  minNumberOfAuthors: string;
};
const propSourcesDefault: PropSources = {
  npmName: "npmName",
  projectName: "projectName",
  donationText: "donationText",
  minNumberOfAuthors: "minNumberOfAuthors",
};
function validateLsosProject(
  { npmName, projectName, donationText, minNumberOfAuthors }: LsosProject,
  propSources: PropSources = propSourcesDefault
) {
  assertUsage(
    npmName.split("/").length === 1,
    "The `npmName` argument should be the name of the organization on npm (`@org-name`). If there is no npm organization, then it should be the name of the package (`package-name`). In particular do not set `npmName` to `@org-name/package-name`, but set it to `@org-name` instead."
  );

  const argumentsMissing = [
    !npmName && propSources["npmName"],
    !projectName && propSources["projectName"],
    !donationText && propSources["donationText"],
  ].filter(Boolean);

  const errorPrefix = `[${getExportName()}()] `;

  assertUsage(
    argumentsMissing.length === 0,
    errorPrefix +
      "Following arguments are missing: " +
      argumentsMissing.map((arg) => "`" + arg + "`").join(", ") +
      "."
  );

  assertUsage(
    minNumberOfAuthors === undefined || typeof minNumberOfAuthors === "number",
    errorPrefix + "`" + propSources.minNumberOfAuthors + "` should be a number"
  );

  assertUsage(
    AUTHORIZED_PROJECTS.includes(npmName),
    `Your project \`${npmName}\` has not been enabled yet, see https://lsos.org/join`
  );
}
