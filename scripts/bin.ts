#!/usr/bin/env node

import { LsosConfig } from "./LsosConfig";

if (process.argv[2] === "remove") {
  if (LsosConfig.donationReminderIsRemoved()) {
    console.log("Donation-reminder already removed.");
  } else {
    LsosConfig.removeDonationReminder();
    console.log("Donation-reminder removed.");
  }
}
