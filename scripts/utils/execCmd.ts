import { exec } from "child_process";
import assert = require("assert");

export { execCmd };

function execCmd(cmd: string): Promise<string> {
  const { promise, resolvePromise, rejectPromise } = genPromise();

  exec(cmd, {}, (err: Error, stdout: string, stderr: string) => {
    if (!err && !stderr) {
      resolvePromise(stdout);
      return;
    }
    if (err) {
      rejectPromise(err);
      return;
    }
    assert(stderr);
    rejectPromise(stderr);
  });

  return promise;
}

function genPromise() {
  let resolvePromise: (value?: any) => void;
  let rejectPromise: (value?: any) => void;
  const promise: Promise<any> = new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  return { promise, resolvePromise, rejectPromise };
}
