import { findLsosProjects } from "./donate/findLsosProjects";
import { LsosProject } from "../../types";

export { donate };

async function donate() {
  const lsosProjects: LsosProject[] = await findLsosProjects();
  console.log(lsosProjects);
}
