import { LsosProject } from "../types";

import { Collector } from "./utils/Collector";

export { collectLsosProject, getCollectedLsosProjects };

const collector = new Collector();

const lsosProjects: LsosProject[] = [];

function collectLsosProject(lsosProject: LsosProject) {
  lsosProjects.push(lsosProject);
  collector.newCall();
}

async function getCollectedLsosProjects(): Promise<LsosProject[]> {
  await collector.waitForCalls();
  return lsosProjects;
}
