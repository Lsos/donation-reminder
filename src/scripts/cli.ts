#!/usr/bin/env node

import { remove } from "./cli/remove";
import { donate } from "./cli/donate";
import { header } from "./cli/header";
import {
  fgBold,
  styleError,
  styleErrorEmphasis,
} from "./cli/utils/cli-components";
import assert = require("assert");

cli();

function cli() {
  console.log(header);
  console.log();

  const cmd = getCommand();

  switch (cmd) {
    case "donate":
      donate();
      break;
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
      "  " +
        cmdColor("donate") +
        "       Donate to your open source dependencies",
      "  " + cmdColor("remove") + "       Remove donation-reminder",
      "  " + cmdColor("help") + "         Display this help information",
      "",
    ].join("\n")
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
