import { LsosProject } from "../types";
import { emojiRegex } from "../utils/emojiRegex";

export { getLsosProjectInfo };

function getLsosProjectInfo({
  projectName,
  npmName,
  donationText,
}: LsosProject) {
  const iconUrl = "https://lsos.org/npm/" + npmName + "/logo.svg";
  const donatePageUrl = "https://lsos.org/npm/" + npmName;
  const donationTextWithEmojis = donationText;
  const donationTextWithoutEmojis = removeEmojis(donationText);
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
