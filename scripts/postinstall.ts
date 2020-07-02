#!/usr/bin/env node

import assert from "assert";
import {
  getPackages,
  packageRootName,
  Package,
  PackageName,
} from "../utils/getPackages";
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

  const depsWithFunding = {};
  packages.forEach((pkg: Package) => {
    if (!pkg.wantsFunding) {
      return;
    }
    if (!pkg.dependencyAncestors.includes(packageRootName)) {
      return;
    }
    const relevantAncestors = intersect(
      pkg.dependencyAncestors,
      directDependencies
    );
    if (pkg.dependencyParents.includes(packageRootName)) {
      relevantAncestors.push(packageRootName);
    }
    relevantAncestors.forEach((ancestorName) => {
      depsWithFunding[ancestorName] =
        depsWithFunding[ancestorName] || new Set();
      depsWithFunding[ancestorName].add(pkg.name);
    });
  });

  console.log();
  console.log("packages: " + packages.map((pkg) => pkg.name).join(" "));
  console.log();
  console.log(
    "packages with funding info: " +
      packages
        .filter((pkg) => pkg.wantsFunding)
        .map((pkg) => pkg.name)
        .join(" ")
  );
  console.log();
  const fundingDepsJson = stringifyFundingDeps(depsWithFunding);
  console.log("Funding dependencies:", fundingDepsJson);
  console.log("total packages: " + packages.length);
  console.log("dir", userProjectPath);
}

function stringifyFundingDeps(depsWithFunding) {
  const str_object: any = {};
  Object.entries(depsWithFunding).forEach(([pkgName, deps]) => {
    assert(deps.constructor === Set);
    str_object[pkgName] = Array.from(deps);
  });
  const str = JSON.stringify(str_object, null, 2);
  return str;
}

/*
function getUserPackageJson(userProjectPath) {
  const path = require("path");
  const userPackageJson = require(path.join(userProjectPath, "package.json"));
  return userPackageJson;
}
*/
