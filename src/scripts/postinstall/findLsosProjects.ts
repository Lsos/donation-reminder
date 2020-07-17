import { replaceFileContent } from "./utils/replaceFileContent";
import { getLsosProjects } from "./getLsosProjects";
import assert = require("assert");

export { findLsosProjects };

async function findLsosProjects() {
  const lsosProjects = await getLsosProjects();
  assert(lsosProjects.constructor === Array);
  replaceFileContent(
    require.resolve("../../env/lsosProjects.js"),
    "lsosProjects",
    lsosProjects
  );
}
