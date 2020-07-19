#!/usr/bin/env node

import { remove } from "./cli/remove";

cli();

function cli() {
  const cmd = getCommand();

  switch (cmd) {
    case "remove":
      remove();
      break;
    case "help":
    default:
      showHelp();
  }
}

function showHelp() {
  console.log(
    [
      "Usage: lsos <command>",
      "",
      "Commands:",
      "  remove                      remove donation-reminder",
      "  help                        display this help information",
      "",
    ].join("\n")
  );
}

function getCommand(): string {
  const { argv } = process;
  if (argv.length !== 3) {
    return null;
  }
  return argv[2];
}
