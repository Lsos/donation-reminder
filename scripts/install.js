#!/usr/bin/env node

const pify = require("pify");
const readPackageTree = pify(require("read-package-tree"));
const assert = require("assert");
const stringify = require("json-stringify-safe");

postinstall();

async function postinstall() {
  await findPackagesWithFunding();
  console.log("lsos postinstall ran");
}

async function findPackagesWithFunding() {
  const packages = await getPackages();

  const packages_with_funding = Object.values(packages).filter((pkg) => {
    if (pkg.notInstalledInNodeModulesDirectory) {
      return false;
    }
    if (!pkg.package.funding) {
      return false;
    }
    /*
    if (
      pkg.dependencyPaths.every((depPath) =>
        depPath.some((pkg) => pkg.name === "lsos")
      )
    ) {
      return false;
    }
    */
    return true;
  });
  packages_with_funding.forEach((pkg) => {
    const { name, dependencyPaths } = pkg;
    assert(name);
    assert(dependencyPaths);
    console.log(name);
    console.log(
      dependencyPaths
        .map((depPath) => depPath.map((dep) => dep.name).join(" -> "))
        .join("\n")
    );
    console.log(findFundingUrls(pkg.package.funding).join(", "));
    console.log();
  });
  console.log("total packages: " + Object.keys(packages).length);
  console.log("with funding: " + packages_with_funding.length);
}

async function getPackages() {
  const userProjectPath = process.env.INIT_CWD || process.cwd();
  console.log("dir", userProjectPath);

  const packages = {};

  traverse(await readPackageTree(userProjectPath), "children").forEach(
    ({ node: pkg }) => {
      const { name } = pkg;
      assert(name);
      assert(pkg.package, pkg);
      pkg.dependencyPaths = [];
      packages[name] = pkg;
    }
  );

  traverse(await npmls(userProjectPath), (node) =>
    Object.entries(node.dependencies || {}).map(([key, obj]) => ({
      name: key,
      ...obj,
    }))
  ).forEach(({ node, ancestors }) => {
    //console.log("pp", node.name, Object.keys(node));
    //console.log("pp", node, ancestors);

    const { name } = node;
    assert(name);
    // assert(ancestors.length === 0 || ancestors.slice(-1)[0].name === "thanks");

    let pkg = packages[name];
    if (!pkg) {
      pkg = packages[name] = {
        name,
        notInstalledInNodeModulesDirectory: true,
        dependencyPaths: [],
      };
    }

    assert(pkg.name);

    const dependencyPath = ancestors.map(({ name }) => name);
    pkg.dependencyPaths.push(dependencyPath);
  });

  return packages;
}

function unique(arr) {
  return Array.from(new Set(arr));
}
function findFundingUrls(thing) {
  const str = stringify(thing);
  const pathnames = [
    ...matchPathname(str, "patreon.com"),
    ...matchPathname(str, "opencollective.com"),
    ...matchPathname(str, "github.com/sponsors"),
  ];
  const urls = pathnames.map((m) => "https://" + m);
  if (urls.length === 0 && !str.includes("?sponsor=")) {
    console.log(str);
    throw new Error("look me up");
  }
  return unique(urls);
}
function matchPathname(str, domainName) {
  const matches = str.match(
    new RegExp(escapeRegex(domainName) + "\\/[a-zA-Z0-9-_]+", "g")
  );
  return unique(matches);
}
function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
function traverse(obj, children_key) {
  const children_retriever =
    children_key.constructor === String
      ? (node) => node[children_key]
      : children_key;
  const nodes = [];
  const visited_nodes = [];
  walk(obj, []);

  return nodes;

  function walk(node, ancestors) {
    if (visited_nodes.includes(node)) {
      return;
    }
    visited_nodes.push(node);
    nodes.push({
      node,
      ancestors,
    });
    const children = children_retriever(node);
    if (children) {
      children.forEach((child) => {
        walk(child, [node, ...ancestors]);
      });
    }
  }
}

async function npmls(cwd) {
  let resolve, reject;
  const p = new Promise((resolve_, reject_) => {
    resolve = resolve_;
    reject = reject_;
  });
  require("child_process").exec("npm ls --json", { cwd }, function (
    err,
    stdout,
    stderr
  ) {
    let parseError;
    let depTree;
    try {
      depTree = JSON.parse(stdout);
    } catch (err) {
      parseError = err;
    }
    if (depTree) {
      resolve(depTree);
      return;
    }
    if (err) {
      reject(err);
      return;
    }
    if (stderr) {
      reject(err);
      return;
    }
    if (parseError) {
      reject(err);
      return;
    }
    resolve({});
  });
  return p;
}
