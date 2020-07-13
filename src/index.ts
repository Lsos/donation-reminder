import { showDonationReminder } from "./showDonationReminder";
import { skipDonationReminder } from "./skipDonationReminder";

export { lsosDonationFund };
export default lsosDonationFund;

let collectionFinished = false;
const projects = [];

main();

function lsosDonationFund({
  npmName,
  projectName,
  text,
}: {
  npmName: string;
  projectName: string;
  text: string;
}) {
  validate({ npmName, projectName, text });
  projects.push({ npmName, projectName, text });
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

function validate({ npmName, projectName, text }) {
  const errorPrefix = "[@lsos/donation-fund] ";

  if (collectionFinished) {
    throw new Error(
      errorPrefix +
        "The `lsosDonationFund()` function needs to be called immeditaly; it needs to be called before any promise and IO event, and shouldn't be called it in an `async` function."
    );
  }

  const missingArguments = [
    !npmName && "npmName",
    !projectName && "projectName",
    !text && "text",
  ].filter(Boolean);
  if (missingArguments.length > 0) {
    throw new Error(
      errorPrefix +
        "Missing arguments: " +
        missingArguments.map((arg) => "`" + arg + "`").join(", ")
    );
  }
}
