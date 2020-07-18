import { replaceFileContent } from "./utils/replaceFileContent";
import { retrieveLsosProjects } from "./findLsosProjects/retrieveLsosProjects";
import assert = require("assert");
import { LsosProject } from "../../types";

export { findLsosProjects };

async function findLsosProjects() {
  const lsosProjects = await retrieveLsosProjects();
  assert(lsosProjects.constructor === Array);
  save(lsosProjects);
}

function save(lsosProjects: LsosProject[]) {
  replaceFileContent(
    require.resolve("../../env/lsosProjects.js"),
    "lsosProjects",
    lsosProjects
  );
}
