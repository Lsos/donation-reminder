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
};
const propSourcesDefault: PropSources = {
  npmName: "npmName",
  projectName: "projectName",
  donationText: "donationText",
};
function validateLsosProject(
  lsosProjectInfo: LsosProject,
  propSources: PropSources = propSourcesDefault
) {
  const { npmName, projectName, donationText } = lsosProjectInfo;

  const argumentsMissing = [
    !npmName && propSources["npmName"],
    !projectName && propSources["projectName"],
    !donationText && propSources["donationText"],
  ].filter(Boolean);

  assertUsage(
    argumentsMissing.length === 0,
    `The \`${getExportName()}\` function must be called with following missing arguments:` +
      argumentsMissing.map((arg) => "`" + arg + "`").join(", ") +
      "."
  );

  assertUsage(
    AUTHORIZED_PROJECTS.includes(npmName),
    `Your project \`${npmName}\` has not been enabled yet, see https://lsos.org/join`
  );
}
