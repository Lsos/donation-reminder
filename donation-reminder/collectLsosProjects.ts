import { LsosProject } from "../types";

import { Collector } from "./utils/Collector";

export { collectLsosProject, getCollectedLsosProjects };

const collector = new Collector();

const lsosProjects: LsosProject[] = [];

function collectLsosProject(lsosProject: LsosProject, callerName: string) {
  lsosProjects.push(lsosProject);
  collector.newCall(callerName);
}

async function getCollectedLsosProjects(): Promise<LsosProject[]> {
  await collector.waitForCalls();
  return lsosProjects;
}
