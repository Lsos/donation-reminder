#!/usr/bin/env node

import { UserConfig } from "../UserConfig";

cli();

function cli() {
  const cmd = getCommand();

  if (cmd === "remove") {
    removeDonationReminder();
    return;
  }

  showHelp();
}

function removeDonationReminder() {
  const userConfig = UserConfig.get();

  if (userConfig?.donationReminder?.remove) {
    console.log("Donation-reminder already removed.");
    return;
  }

  UserConfig.set({
    donationReminder: {
      remove: true,
    },
  });
  console.log("Donation-reminder successfully removed.");
}

function getCommand(): string {
  const { argv } = process;
  if (argv.length !== 3) {
    return null;
  }
  return argv[2];
}

function showHelp() {
  console.log(
    `Commands:
  lsos remove - Remove the donation-reminder
`
  );
}
