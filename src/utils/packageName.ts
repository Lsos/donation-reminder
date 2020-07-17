export const packageName = "@lsos/donation-reminder";

if (isNodejs()) {
  assertPackageName();
}

function assertPackageName() {
  const assert = lazyRequire("assert");
  const packageJson = lazyRequire("../../package.json");
  const packageName2 = packageJson.name;
  assert(packageName === packageName2);
}

function isNodejs() {
  return typeof window === "undefined";
}

function lazyRequire(id: string) {
  return eval("require")(id);
}
