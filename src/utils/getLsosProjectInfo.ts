import { LsosProject } from "../types";
import { emojiRegex } from "../utils/emojiRegex";
import { assertWarning } from "../donation-reminder/utils/assertUsage";

export { getLsosProjectInfo };
export const lsosIconUrl = "https://lsos.org/logo.svg";

function getLsosProjectInfo({
  projectName,
  npmName,
  donationText,
}: LsosProject) {
  const iconUrl = "https://lsos.org/npm/" + npmName + "/logo.png";
  const donatePageUrl = "https://lsos.org/npm/" + npmName;
  const donationTextWithEmojis = donationText;
  const donationTextWithoutEmojis = removeEmojis(donationText);

  checkIfLsosProjectExists(npmName, iconUrl);

  return {
    projectName,
    iconUrl,
    donatePageUrl,
    donationTextWithoutEmojis,
    donationTextWithEmojis,
  };
}

function removeEmojis(str: string): string {
  // Remove emoji codes
  let processed = str;
  processed = processed.split(new RegExp(emojiRegex)).join(" ");

  // Remove white-space doublets
  processed = processed.split(/\s/g).filter(Boolean).join(" ");

  // Remove erronous white-spaces
  processed = processed
    .split(/\s(?![a-z])/gi)
    .filter(Boolean)
    .join("");
  processed = processed.split(/^\s/).filter(Boolean).join("");

  // Add trailing dot
  if (/[^a-z]/i.test(processed)) {
    processed = processed + ".";
  }

  return processed;
}

async function checkIfLsosProjectExists(npmName: string, iconUrl: string) {
  const projectIconExists = await imageExists(iconUrl);
  if (projectIconExists === true) {
    return;
  }
  const isOnline = await imageExists(lsosIconUrl);
  if (isOnline === false) {
    // No-op: browser is offline
    return;
  }
  if (isOnline === null || projectIconExists === null) {
    return;
  }

  console.assert(isOnline === true && projectIconExists === false);
  assertWarning(
    false,
    `The project \`${npmName}\` is unknown to the Lsos. Contact your Lsos manager, or go to https://lsos.org/join if you don't have one yet.`
  );
}

async function imageExists(imageUrl: string): Promise<boolean> {
  const imgEl = document.createElement("img");

  let resolve: (_: boolean) => void;
  const promise = new Promise<boolean>((r) => {
    resolve = r;
  });

  imgEl.onload = function () {
    resolve(true);
  };

  imgEl.onerror = function () {
    resolve(false);
  };

  const TIMEOUT = 5 * 1000;
  setTimeout(() => {
    resolve(null);
  }, TIMEOUT);

  imgEl.src = imageUrl;

  return promise;
}
