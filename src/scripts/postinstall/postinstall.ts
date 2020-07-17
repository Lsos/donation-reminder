#!/usr/bin/env node

import { findUserConfig } from "./findUserConfig";
import { findNumberOfAuthors } from "./findNumberOfAuthors";
import { findLsosProjects } from "./findLsosProjects";

postinstall();

async function postinstall() {
  await Promise.all([
    findUserConfig(),
    findNumberOfAuthors(),
    findLsosProjects(),
  ]);
}
