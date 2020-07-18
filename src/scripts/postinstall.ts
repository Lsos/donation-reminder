#!/usr/bin/env node

import { findUserConfig } from "./postinstall/findUserConfig";
import { findNumberOfAuthors } from "./postinstall/findNumberOfAuthors";
import { findLsosProjects } from "./postinstall/findLsosProjects";

postinstall();

async function postinstall() {
  await Promise.all([
    findUserConfig(),
    findNumberOfAuthors(),
    findLsosProjects(),
  ]);
}
