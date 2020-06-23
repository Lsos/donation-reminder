import { printDonationReminder } from "../../donation-reminder/printDonationReminder";

export { getExportName };

function getExportName() {
  return printDonationReminder.name;
}
