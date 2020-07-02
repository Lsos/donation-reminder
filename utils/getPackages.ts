import assert from "assert";
import stringify from "json-stringify-safe";
import pify from "pify";
import readPackageTreeAsync from "read-package-tree";
import { warning } from "../utils/warning";
import { unique } from "../utils/unique";
import { transitiveClosure } from "../utils/transitiveClosure";
import { traverse } from "../utils/traverse";
const readPackageTree = pify(readPackageTreeAsync);

export const packageRootName = "_root";

export { getPackages };

export type PackageName = string & { _brand?: "PackageName" };
type PackageFunding = any & { _brand?: "PackageFunding" };
type DependencyParents = PackageName[] & { _brand?: "DependencyParents" };
type DependencyAncestors = PackageName[] & { _brand?: "DependencyAncestors" };

type DependencyInfo = {
  parents: {
    [key: string]: DependencyParents;
  };
  ancestors: {
    [key: string]: DependencyAncestors;
  };
};

type PackageJson = {
  name: PackageName;
  funding?: PackageFunding;
  lsos?: {
    skipDonationFund?: boolean;
  };
};

type PackageData = {
  name: PackageName;
  package: PackageJson;
  path: string;
};

type PackageInfo = {
  name: PackageName;
  isRoot: boolean;
  pkgJson: PackageJson;
  fundingObject: PackageFunding;
  dependencyParents: DependencyParents;
  dependencyAncestors: DependencyAncestors;
};

export type Package = {
  dependencyParents: DependencyParents;
  dependencyAncestors: DependencyAncestors;
  name: PackageName;
  wantsFunding: boolean;
};

async function getPackages(userProjectPath: string): Promise<Package[]> {
  const packagesInfo = await getPackagesInfo(userProjectPath);

  return packagesInfo
    .filter((pkgInfo: PackageInfo) => !pkgInfo.isRoot)
    .map((pkgInfo: PackageInfo) => {
      const pkg: Package = {
        name: pkgInfo.name,
        dependencyAncestors: pkgInfo.dependencyAncestors,
        dependencyParents: pkgInfo.dependencyParents,
        wantsFunding:
          !!pkgInfo.fundingObject || findFundingUrls(pkgInfo).length > 0,
      };
      return pkg;
    });
}

async function getPackagesInfo(
  userProjectPath: string
): Promise<PackageInfo[]> {
  const packagesInfo: PackageInfo[] = traverse(
    await readPackageTree(userProjectPath),
    "children"
  )
    .map(({ node }) => node)
    .map((pkgData: PackageData, i) => {
      if (!pkgData.package) {
        warning(false);
        return null;
      }

      const isRoot: boolean = i === 0;
      if (i === 0) {
        warning(pkgData.path === userProjectPath);
      }

      const name = isRoot ? packageRootName : pkgData.package.name;
      if (!name) {
        warning(false);
        return null;
      }
      warning(isRoot || pkgData.name === name);

      const pkgInfo: PackageInfo = {
        isRoot,
        name,
        pkgJson: pkgData.package,
        fundingObject: pkgData.package.funding,
        dependencyAncestors: [],
        dependencyParents: [],
      };
      return pkgInfo;
    })
    .filter(Boolean);

  // Popupalte dependency arrays
  const { parents, ancestors }: DependencyInfo = getDependencyInfo(
    packagesInfo
  );
  packagesInfo.forEach((pkgInfo: PackageInfo) => {
    const pkg_ancestors = ancestors[pkgInfo.name];
    assert(pkg_ancestors);
    pkgInfo.dependencyAncestors = pkg_ancestors;
    const pkg_parents = parents[pkgInfo.name];
    assert(pkg_parents);
    pkgInfo.dependencyParents = pkg_parents;
  });

  return packagesInfo;
}

function getDependencyInfo(packagesInfo: PackageInfo[]): DependencyInfo {
  const parents = {};
  packagesInfo.forEach((pkgInfo: PackageInfo) => {
    const { name } = pkgInfo;
    assert(name);
    parents[name] = [];
  });

  const ignoredPackages: PackageName[] = getIgnoredPackages(packagesInfo);

  packagesInfo.forEach((pkgInfo) => {
    const deps = getDependencies(pkgInfo);
    deps.forEach((dep_name) => {
      assert(parents[pkgInfo.name]);
      if (!parents[dep_name]) {
        //warning(false, dep_name);
        return;
      }
      if (ignoredPackages.includes(dep_name)) {
        return;
      }
      parents[dep_name].push(pkgInfo.name);
    });
  });

  const ancestors = transitiveClosure(parents);

  /*
  console.log("a", ancestors);
  console.log("p", parents);
  console.log("ii", Object.keys(ignoredPackages).join(" "));
  */
  return { parents, ancestors };

  function getDependencies(pkg: PackageInfo): PackageName[] {
    let dependencies = [];
    const { pkgJson } = pkg;
    Object.keys(pkgJson).forEach((packageProp) => {
      if (packageProp.toLowerCase().endsWith("dependencies")) {
        dependencies.push(...Object.keys(pkgJson[packageProp]));
      }
    });
    dependencies = unique(dependencies);
    return dependencies;
  }
}

function getIgnoredPackages(packagesInfo: PackageInfo[]): PackageName[] {
  const ignoredPackages = [];
  packagesInfo.forEach((pkgInfo) => {
    if (pkgInfo.pkgJson.lsos?.skipDonationFund) {
      ignoredPackages.push(pkgInfo.name);
    }
  });
  return ignoredPackages;
}

function findFundingUrls(thing) {
  const str = stringify(thing);
  const pathnames = [
    ...matchPathname(str, "patreon.com"),
    ...matchPathname(str, "opencollective.com"),
    ...matchPathname(str, "github.com/sponsors"),
  ];
  const urls = pathnames.map((m) => "https://" + m);
  /*
  if (urls.length === 0 && !str.includes("?sponsor=")) {
    console.log(str);
    throw new Error("look me up");
  }
  */
  return unique(urls);
}
function matchPathname(str, domainName) {
  const matches = str.match(
    new RegExp(escapeRegex(domainName) + "\\/[a-zA-Z0-9-_]+", "g")
  );
  return unique(matches);
}
function escapeRegex(string: string): string {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
