import { unique } from "../utils/unique";
import { execCmd } from "../utils/execCmd";
import { basename as filename, join as pathJoin } from "path";
import assert = require("assert");
import { splitByLine, splitByWhitespace } from "../utils/split";

type FilePath = string & { _brand?: "FilePath" };

export { getAllDependencies };

async function getAllDependencies() {
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

  let userProjectFiles: FilePath[] = (
    await Promise.all(gitDirs.map(getGitFiles))
  ).flat();

  userProjectFiles = unique(userProjectFiles);

  return userProjectFiles;
}

async function getGitFiles(cwd: FilePath): Promise<FilePath[]> {
  let result: string;
  try {
    result = await execCmd("git ls-files", { cwd });
  } catch (_) {
    return [];
  }
  return splitByLine(result.trim()).map((filePath: FilePath) =>
    pathJoin(cwd, filePath)
  );
}

async function getGitRootDir(): Promise<FilePath> {
  let cwd = process.cwd();

  while (true) {
    const parentCwd = await getRoot(pathJoin(cwd, ".."));
    if (!parentCwd) {
      return cwd;
    }
    assert(cwd !== parentCwd && cwd.startsWith(parentCwd));
    cwd = parentCwd;
  }

  async function getRoot(cwd: FilePath): Promise<FilePath> {
    let gitRootDir: string;
    try {
      gitRootDir = await execCmd("git rev-parse --show-toplevel", {
        cwd,
      });
    } catch (_) {
      return null;
    }
    gitRootDir = gitRootDir.trim();
    assert(gitRootDir && splitByLine(gitRootDir).length === 1);
    return gitRootDir;
  }
}

async function getGitSubmodulePaths(cwd: FilePath): Promise<FilePath[]> {
  const gitSubmodulePaths = [];
  let result: string;
  try {
    result = await execCmd("git submodule status --recursive", { cwd });
  } catch (_) {
    return [];
  }
  splitByLine(result.trim()).forEach((line) => {
    try {
      const parts = splitByWhitespace(line);
      assert(parts.length === 3);
      gitSubmodulePaths.push(pathJoin(cwd, parts[1]));
    } catch (_) {
      return;
    }
  });
  return gitSubmodulePaths;
}
