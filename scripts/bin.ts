#!/usr/bin/env node

import { DonationReminderConfig } from "./LsosConfig";

if (process.argv[2] === "remove") {
  if (DonationReminderConfig.isRemoved()) {
    console.log("Donation-reminder already removed.");
  } else {
    DonationReminderConfig.remove();
    console.log("Donation-reminder removed.");
  }
}
