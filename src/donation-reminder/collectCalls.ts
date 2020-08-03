import { LsosProject } from "../types";

import { CallCollector } from "./utils/CallCollector";

export { collectLsosProject, getCollectedLsosProjects };

const collector = new CallCollector();

const lsosProjects: LsosProject[] = [];

function collectLsosProject(lsosProject: LsosProject) {
  lsosProjects.push(lsosProject);
  collector.newCall();
}

async function getCollectedLsosProjects(): Promise<LsosProject[]> {
  await collector.waitForCalls();
  return lsosProjects;
}
