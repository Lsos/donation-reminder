#!/usr/bin/env node

import { remove } from "./cli/remove";

cli();

function cli() {
  const cmd = getCommand();

  if (cmd === "remove") {
    remove();
    return;
  }

  showHelp();
}

function showHelp() {
  console.log(
    `Commands:
  lsos remove - Remove the donation-reminder
`
  );
}

function getCommand(): string {
  const { argv } = process;
  if (argv.length !== 3) {
    return null;
  }
  return argv[2];
}
