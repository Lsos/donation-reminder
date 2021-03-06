#!/usr/bin/env node

import { remove } from "./cli/remove";
import { header } from "./cli/header";
import {
  fgBold,
  styleError,
  styleErrorEmphasis,
} from "./cli/utils/cli-components";
import assert = require("assert");
import { EOL } from "os";

cli();

function cli() {
  console.log(header);
  console.log();

  const cmd = getCommand();

  switch (cmd) {
    case "remove":
      remove();
      break;
    default:
      console.log(styleError("Unknown command ") + styleErrorEmphasis(cmd));
      console.log();
    case "help":
    case "":
      showHelp();
  }
}

function showHelp() {
  console.log(
    [
      "Usage: lsos " + /*cmdColor*/ "<command>",
      "",
      "Commands:",
      `  ${cmdColor("remove")}       Remove donation-reminder`,
      `  ${cmdColor("help")}         Display this help information`,
      "",
    ].join(EOL)
  );
}

function cmdColor(str: string): string {
  return fgBold(str);
}

function getCommand(): string {
  const { argv } = process;
  if (argv.length !== 3) {
    return "";
  }
  const cmd = argv[2];
  assert(cmd.constructor === String);
  return cmd;
}
