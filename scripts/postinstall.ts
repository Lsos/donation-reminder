#!/usr/bin/env node

import { getPackages, packageRootName } from "./getPackages";
import { Package, PackageName } from "./getPackages";
import { warning } from "../utils/warning";
import { intersect } from "../utils/intersect";

postinstall();

async function postinstall() {
  await findPackagesWithFunding();
  console.log();
  console.log("lsos postinstall ran");
  console.log();
}

async function findPackagesWithFunding() {
  const userProjectPath = process.env.INIT_CWD || process.cwd();

  const packages: Package[] = await getPackages(userProjectPath);

  //const userPackageJson = getUserPackageJson(userProjectPath);
  //

  const directDependencies: PackageName[] = packages
    .filter((pkg: Package) => pkg.dependencyParents.includes(packageRootName))
    .map((pkg: Package) => pkg.name);

  const fundingDependencies = {};
  packages.forEach((pkg: Package) => {
    if (!pkg.wantsFunding) {
      return;
    }
    if (!pkg.dependencyAncestors.includes(packageRootName)) {
      return;
    }
    const fundingDeps = intersect(pkg.dependencyAncestors, directDependencies);
    warning(
      fundingDeps.length > 0 || pkg.dependencyParents.includes(packageRootName)
    );
    if (fundingDeps.length === 0) {
      fundingDeps.push(packageRootName);
    }
    fundingDeps.forEach((fundingDep) => {
      fundingDependencies[fundingDep] = fundingDependencies[fundingDep] || [];
      fundingDependencies[fundingDep].push(pkg.name);
    });
  });

  console.log(
    "Funding dependencies:",
    JSON.stringify(fundingDependencies, null, 2)
  );
  console.log("total packages: " + packages.length);
  console.log("dir", userProjectPath);
}

/*
function getUserPackageJson(userProjectPath) {
  const path = require("path");
  const userPackageJson = require(path.join(userProjectPath, "package.json"));
  return userPackageJson;
}
*/
