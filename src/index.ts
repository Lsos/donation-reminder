import { getDonationReminder } from "./getDonationReminder";
import { skip } from "./skip";
import { styleConsoleLog } from "./utils/styleConsoleLog";

export { donationReminder };

let collectionFinished = false;
const projects = [];

main();

function donationReminder({
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
  // Wait for projects to call the `donationReminder()` function
  await Promise.resolve();

  collectionFinished = true;

  // Whether the donation-reminder should be shown
  if (skip()) {
    return;
  }

  const { strings, defaultStyle } = getDonationReminder(projects);

  console.log(...styleConsoleLog(strings, { defaultStyle }));
}

function validate({ npmName, projectName, text }) {
  const errorPrefix = "[@lsos/donation-fund] ";

  if (collectionFinished) {
    throw new Error(
      errorPrefix +
        "The `donationReminder()` function needs to be called immeditaly; it needs to be called before any promise and IO event, and shouldn't be called it in an `async` function."
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
