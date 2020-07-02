#!/usr/bin/env node

const pify = require("pify");
const readPackageTree = pify(require("read-package-tree"));
const assert = require("assert");
const stringify = require("json-stringify-safe");

postinstall();

async function postinstall() {
  await findPackagesWithFunding();
  console.log();
  console.log("lsos postinstall ran");
  console.log();
}

async function findPackagesWithFunding() {
  const userProjectPath = process.env.INIT_CWD || process.cwd();

  const { packages, rootPackage } = await getPackages(userProjectPath);

  print_packages_with_funding(packages);
  console.log("dir", userProjectPath);

  //const userPackageJson = getUserPackageJson(userProjectPath);
  //

  const rootPackageName = rootPackage.name;
  const rootPackageDependencies = packages
    .filter((pkg) => !pkg.notInstalledInNodeModulesDirectory)
    .filter((pkg) => pkg.dependencyParents.includes(rootPackageName))
    .map((pkg) => pkg.name);

  const fundingDependencies = {};
  packages
    .filter((pkg) => !pkg.notInstalledInNodeModulesDirectory)
    .forEach((pkg) => {
      if (!pkg.funding) {
        return;
      }
      if (!pkg.dependencyAncestors.includes(rootPackageName)) {
        return;
      }
      const fundingDeps = intersect(
        pkg.dependencyAncestors,
        rootPackageDependencies
      );
      warning(
        fundingDeps.length > 0 ||
          pkg.dependencyParents.includes(rootPackageName)
      );
      if (fundingDeps.length === 0) {
        fundingDeps.push(rootPackageName);
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
}

/*
function getUserPackageJson(userProjectPath) {
  const path = require("path");
  const userPackageJson = require(path.join(userProjectPath, "package.json"));
  return userPackageJson;
}
*/

function print_packages_with_funding(packages) {
  const packages_with_funding = packages.filter((pkg) => {
    if (pkg.notInstalledInNodeModulesDirectory) {
      return false;
    }
    if (!pkg.funding) {
      return false;
    }
    if (pkg.dependencyPaths.length === 0) {
      return false;
    }
    if (
      pkg.dependencyPaths.every((depPath) =>
        depPath.some((pkg) => (pkg.packageJson.lsos || {}).skipDonationFund)
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
    console.log(findFundingUrls(pkg.funding).join(", "));
    console.log();
  });
  console.log("total packages: " + packages.length);
  console.log("with funding: " + packages_with_funding.length);
}

async function getPackages(userProjectPath) {
  const packages_map = {};

  const packages_in_node_modules = traverse(
    await readPackageTree(userProjectPath),
    "children"
  )
    .map(({ node }) => node)
    .filter((pkg) => {
      const { package } = pkg;
      if (!package) {
        warning(false);
        return false;
      }
      pkg.packageJson = pkg.package;
      return true;
    })
    .filter((pkg, i) => {
      /*
      if (i === 0) {
        pkg.id = "_root";
        return true;
      }
      */

      const { name, version } = pkg.packageJson;
      if (!name || !version) {
        warning(false);
        return false;
      }

      warning(pkg.name === name, name + "!==" + pkg.name);
      pkg.name = name;
      pkg.version = version;
      pkg.id = name + "@" + version;
      return true;
    })
    .filter((pkg) => {
      pkg.funding = pkg.packageJson.funding;
      pkg.dependencyPaths = [];
      return true;
    });

  packages_in_node_modules.forEach((pkg) => {
    /* It can happen that a module is installed at two different paths, when linking modules while developing.
    assert(!packages_map[pkg.id]);
    */

    packages_map[pkg.id] = pkg;
  });

  const { parents, ancestors } = getDependenciesParents(
    packages_in_node_modules
  );
  Object.values(packages_map).forEach((pkg) => {
    const pkg_ancestors = ancestors[pkg.name];
    assert(pkg_ancestors);
    pkg.dependencyAncestors = pkg_ancestors;
    const pkg_parents = parents[pkg.name];
    assert(pkg_parents);
    pkg.dependencyParents = pkg_parents;
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

    if (!packages_map[id]) {
      packages_map[id] = {
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

    const pkg = packages_map[id];
    assert(pkg);

    // assert(ancestors.length === 0 || ancestors.slice(-1)[0].name === "thanks");

    const dependencyPath = ancestors.map(({ name, version }) => {
      const id = name + "@" + version;
      const pkg = packages_map[id];
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

  const rootPackage = getRootPackage(packages_in_node_modules, userProjectPath);
  const packages = Object.values(packages_map);

  return { packages, rootPackage };
}

function unique(arr) {
  return Array.from(new Set(arr));
}
function intersect(array1, array2) {
  return array1.filter((value) => array2.includes(value));
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

function warning(...args) {
  if (!isDev()) {
    return;
  }
  assert(...args);
}
function isDev() {
  return process.cwd().startsWith("/home/romu");
}

function getRootPackage(packages_in_node_modules, userProjectPath) {
  const rootPackage = packages_in_node_modules[0];
  warning(rootPackage.path === userProjectPath);
  return rootPackage;
}

function getDependenciesParents(packages_in_node_modules) {
  const parents = {};
  packages_in_node_modules.forEach((pkg) => {
    const { name } = pkg;
    assert(name);
    parents[name] = [];
  });

  const ignoredPackages = getIgnoredPackages(packages_in_node_modules);

  packages_in_node_modules.forEach((pkg) => {
    const deps = getDependencies(pkg);
    deps.forEach((dep_name) => {
      assert(parents[pkg.name]);
      if (!parents[dep_name]) {
        //warning(false, dep_name);
        return;
      }
      if (ignoredPackages[dep_name]) {
        return;
      }
      parents[dep_name].push(pkg.name);
    });
  });

  const ancestors = transitiveClosure(parents);

  console.log("a", ancestors);
  console.log("p", parents);
  console.log("ii", Object.keys(ignoredPackages).join(" "));
  return { parents, ancestors };

  function getDependencies(pkg) {
    let dependencies = [];
    const { packageJson } = pkg;
    Object.keys(packageJson).forEach((packageProp) => {
      if (packageProp.toLowerCase().endsWith("dependencies")) {
        dependencies.push(...Object.keys(packageJson[packageProp]));
      }
    });
    dependencies = unique(dependencies);
    return dependencies;
  }
}

function getIgnoredPackages(packages_in_node_modules) {
  const ignoredPackages = {};
  packages_in_node_modules
    .filter((pkg) => (pkg.packageJson.lsos || {}).skipDonationFund)
    .forEach((pkg) => {
      ignoredPackages[pkg.name] = true;
    });
  return ignoredPackages;
}

function transitiveClosure(parents) {
  validateParents();

  return getAncestors();

  function validateParents() {
    Object.entries(parents).forEach(([node, node_parents]) => {
      assert(node.constructor === String);
      node_parents.forEach((parent) => {
        assert(parent.constructor === String);
        assert(parents[parent]);
      });
    });
  }

  function getAncestors() {
    const ancestors = {};
    Object.keys(parents).forEach((node) => {
      const node_ancestors = [];
      const visited_nodes = {};
      add_parents(node, visited_nodes, node_ancestors);
      ancestors[node] = node_ancestors;
    });
    return ancestors;
  }

  function add_parents(node, visited_nodes, node_ancestors) {
    visited_nodes[node] = true;
    const node_parents = parents[node];
    node_parents.forEach((parent) => {
      if (visited_nodes[parent]) return;
      node_ancestors.push(parent);
      add_parents(parent, visited_nodes, node_ancestors);
    });
  }
}
