#!/usr/bin/env node

import assert from "assert";
import path from "path";
import {
  getPackages,
  packageRootName,
  Package,
  PackageName,
} from "../utils/getPackages";
import { intersect } from "../utils/intersect";
import { escapeRegex } from "../utils/escapeRegex";
import { isDev } from "../utils/isDev";
import replace from "replace-in-file";

/*/
const DEBUG = true;
/*/
const DEBUG = false;
//*/

postinstall();

async function postinstall() {
  if (isDev()) {
    await findFundingPackages();
  } else {
    try {
      await findFundingPackages();
      postinstall();
    } catch (err) {}
  }
}

async function findFundingPackages() {
  const userProjectPath = process.env.INIT_CWD || process.cwd();

  const packages: Package[] = await getPackages(userProjectPath);

  //const userPackageJson = getUserPackageJson(userProjectPath);
  //

  const directDependencies: PackageName[] = packages
    .filter((pkg: Package) => pkg.dependencyParents.includes(packageRootName))
    .map((pkg: Package) => pkg.name);

  const fundingDeps = {};
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
      fundingDeps[ancestorName] = fundingDeps[ancestorName] || new Set();
      fundingDeps[ancestorName].add(pkg.name);
    });
  });

  const fundingDepsJson = stringifyFundingDeps(fundingDeps);

  if (DEBUG) {
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
    console.log(
      "Funding dependencies:",
      JSON.stringify(JSON.parse(fundingDepsJson), null, 2)
    );
    console.log("total packages: " + packages.length);
    console.log("dir", userProjectPath);
  }

  await writeFundingDeps(fundingDepsJson);
}

async function writeFundingDeps(fundingDepsJson: string) {
  const packageJsonPath = require.resolve("../../package.json");
  const packageJson = require(packageJsonPath);
  assert(packageJson.name === "lsos");
  const rootDir = path.dirname(packageJsonPath);
  const donationReminderSourceCodeFile = require.resolve(
    path.resolve(rootDir, packageJson.main)
  );

  assert(fundingDepsJson.startsWith("{"));
  assert(fundingDepsJson.endsWith("}"));
  const delimiterBegin = "/*FUNDING_DEPS_BEGIN*/";
  const delimiterEnd = "/*FUNDING_DEPS_END*/";
  await (replace as any)({
    files: donationReminderSourceCodeFile,
    from: matchDelimiters(delimiterBegin, delimiterEnd),
    to: delimiterBegin + fundingDepsJson + ";" + delimiterEnd,
  });
}

function stringifyFundingDeps(fundingDeps: {
  [key: string]: Set<PackageName>;
}) {
  const str_object: any = {};
  Object.entries(fundingDeps).forEach(([pkgName, deps]) => {
    assert(deps.constructor === Set);
    str_object[pkgName] = Array.from(deps);
  });
  const str = JSON.stringify(str_object);
  const numberOfLines = str.split("\n").length;
  assert(numberOfLines === 1, numberOfLines.toString());
  return str;
}

function matchDelimiters(delimiterBegin: string, delimiterEnd: string) {
  return new RegExp(
    escapeRegex(delimiterBegin) +
      // https://stackoverflow.com/questions/1979884/how-to-use-javascript-regex-over-multiple-lines
      "[\\s\\S]*?" +
      escapeRegex(delimiterEnd)
  );
}

/*
function getUserPackageJson(userProjectPath) {
  const path = require("path");
  const userPackageJson = require(path.join(userProjectPath, "package.json"));
  return userPackageJson;
}
*/
