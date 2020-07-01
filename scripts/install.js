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
  const userProjectPath = process.cwd();

  const packages = {};

  traverse(await readPackageTree(userProjectPath), "children").forEach(
    ({ node: pkg }) => {
      const { name } = pkg;
      assert(name);
      pkg.dependencyPaths = [];
      packages[name] = pkg;
    }
  );

  traverse(await npmls(), (node) =>
    Object.entries(node.dependencies || {}).map(([key, obj]) => ({
      name: key,
      ...obj,
    }))
  ).forEach(({ node: { name }, ancestors }) => {
    // assert(ancestors.length === 0 || ancestors.slice(-1)[0].name === "thanks");
    packages[name].dependencyPaths.push(ancestors);
  });

  const packages_with_funding = Object.values(packages).filter(
    ({ node }) => node.package.funding
  );
  packages_with_funding.forEach(({ node: pkg }) => {
    const { name, dependencyPaths } = pkg;
    assert(name);
    assert(dependencyPaths);
    console.log(name);
    console.log(
      dependencyPaths.map((depPath) => depPath.join(" -> ")).join("\n")
    );
    console.log(findFundingUrls(pkg.package.funding).join(", "));
    console.log();
  });
  console.log("total packages: " + packages.length);
  console.log("with funding: " + packages_with_funding.length);
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

async function npmls() {
  let resolve, reject;
  const p = new Promise((resolve_, reject_) => {
    resolve = resolve_;
    reject = reject_;
  });
  require("child_process").exec("npm ls --json", function (
    err,
    stdout,
    stderr
  ) {
    if (err) {
      reject(err);
      return;
    }
    resolve(JSON.parse(stdout));
  });
  return p;
}
