import { unique } from "../utils/unique";
import { execCmd } from "../utils/execCmd";
import { basename as filename, join as pathJoin } from "path";
import assert = require("assert");
import { splitByLine, splitByWhitespace } from "./split";

type FilePath = string & { _brand?: "FilePath" };

export { getAllDependencies };

async function getAllDependencies() {
  const userProjectRootDir = process.cwd();
  console.log(userProjectRootDir);

  const userProjectFiles = await getUserProjectFiles();
  if (userProjectFiles === null) {
    return null;
  }
  assert(userProjectFiles.constructor === Array);

  const allDependencies = userProjectFiles
    .filter((filePath) => filename(filePath) === "package.json")
    .map(getPackageDependencies)
    .flat();

  return allDependencies;
}

function getPackageDependencies(packageJsonPath: FilePath): string[] {
  const packageJson: any = require(packageJsonPath);
  let dependencies = [];
  Object.entries(packageJson).forEach(([prop, val]) => {
    if (prop.toLowerCase().endsWith("dependencies")) {
      dependencies.push(...Object.keys(val));
    }
  });
  dependencies = unique(dependencies);
  return dependencies;
}

async function getUserProjectFiles() {
  const gitRootDir = await getGitRootDir();
  if (gitRootDir === null) {
    return null;
  }
  const gitDirs: FilePath[] = [
    gitRootDir,
    ...(await getGitSubmodulePaths(gitRootDir)),
  ];

  console.log(gitDirs);

  let userProjectFiles: FilePath[] = (
    await Promise.all(
      gitDirs.map(async (cwd: FilePath) => {
        try {
          return await execCmd(
            "git ls-files --summary --numbered --email --all",
            { cwd }
          );
        } catch (_) {
          return [];
        }
      })
    )
  ).flat();

  console.log(userProjectFiles);
  userProjectFiles = unique(userProjectFiles);

  return userProjectFiles;
}

async function getGitRootDir(): Promise<FilePath> {
  try {
    const gitRootDir = await execCmd("git rev-parse --show-toplevel");
    return gitRootDir;
  } catch (_) {
    return null;
  }
}

async function getGitSubmodulePaths(cwd: FilePath): Promise<FilePath[]> {
  const gitSubmodulePaths = [];
  try {
    const result = await execCmd("git submodule status --recursive", { cwd });
    splitByLine(result).forEach((line) => {
      const parts = splitByWhitespace(line);
      assert(parts.length === 3);
      gitSubmodulePaths.push(pathJoin(cwd, parts[1]));
    });
  } catch (_) {
    return [];
  }
  return gitSubmodulePaths;
}
