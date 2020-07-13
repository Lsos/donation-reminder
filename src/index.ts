import { showDonationReminder } from "./showDonationReminder";
import { skipDonationReminder } from "./skipDonationReminder";

export { lsosDonationFund };
export default lsosDonationFund;

let collectionFinished = false;
const projects = [];

main();

function lsosDonationFund({
  npmName,
  name,
  text,
}: {
  npmName: string;
  name: string;
  text: string;
}) {
  if (collectionFinished) {
    throw new Error(
      "[@lsos/donation-fund] The `lsosDonationFund()` function needs to be called immeditaly; it needs to be called before any promise and IO event, and shouldn't be called it in an `async` function."
    );
  }
  projects.push({ npmName, name, text });
}

async function main() {
  // Wait for projects to call the `lsosDonationFund()` function
  await Promise.resolve();

  collectionFinished = true;

  if (skipDonationReminder()) {
    return;
  }

  showDonationReminder(projects);
}
