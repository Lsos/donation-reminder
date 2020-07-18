import { UserConfig } from "../UserConfig";

export { remove };

function remove() {
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
