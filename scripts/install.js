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
    if (pkg.dependencyPaths.length === 0) {
      return false;
    }
    if (
      pkg.dependencyPaths.every((depPath) =>
        depPath.some((pkg) => (pkg.package.lsos || {}).skipDonationFund)
      )
    ) {
      return false;
    }
    return true;
  });
  packages_with_funding.forEach((pkg) => {
    const { id, dependencyPaths } = pkg;
    assert(id);
    assert(dependencyPaths);
    console.log(id);
    console.log(
      dependencyPaths
        .map((dependencyPath) =>
          dependencyPath
            .map((pkg) => {
              return pkg.id;
            })
            .join(" -> ")
        )
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

  const packages_in_node_modules = traverse(
    await readPackageTree(userProjectPath),
    "children"
  );
  packages_in_node_modules.forEach(({ node: pkg }) => {
    let id;
    {
      const { name } = pkg;
      assert(name);
      const { version } = pkg.package;
      assert(version);
      id = name + "@" + version;
    }

    pkg.id = id;
    pkg.dependencyPaths = [];
    /*
    if (packages[id]) {
      console.log(packages[id].path, pkg.path, id);
    }
    assert(!packages[id]);
    */
    packages[id] = pkg;
  });

  /*
  console.log(
    "ppnnn",
    packages_in_node_modules
      .filter(
        ({
          node: {
            package: { funding },
          },
        }) => !!funding
      )
      .map(
        ({
          node: {
            name,
            package: { version },
            path,
          },
        }) => name + "@" + version + "(" + path + ")"
      )
      .join("\n")
  );
  */

  const packages_in_dependency_tree = traverse(
    await npmls(userProjectPath),
    (node) =>
      Object.entries(node.dependencies || {}).map(([key, obj]) => ({
        name: key,
        ...obj,
      }))
  );

  packages_in_dependency_tree.forEach(({ node }) => {
    //console.log("pp", node.name, Object.keys(node));

    const { name, version } = node;
    assert(name);
    assert(version);

    const id = name + "@" + version;

    if (!packages[id]) {
      packages[id] = {
        id,
        name,
        notInstalledInNodeModulesDirectory: true,
        dependencyPaths: [],
      };
    }
  });

  packages_in_dependency_tree.forEach(({ node, ancestors }) => {
    const { name, version } = node;
    assert(name);
    assert(version);
    const id = name + "@" + version;

    const pkg = packages[id];
    assert(pkg);

    // assert(ancestors.length === 0 || ancestors.slice(-1)[0].name === "thanks");

    const dependencyPath = ancestors.map(({ name, version }) => {
      const id = name + "@" + version;
      const pkg = packages[id];
      assert(pkg);
      return pkg;
    });

    /*
    console.log(
      "pp",
      node.id,
      dependencyPath.map(({ id }) => id)
    );
    */

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
