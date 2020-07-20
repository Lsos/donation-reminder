// The donation-reminder is shown only under certain conditions.
// - The donation-reminder is only shown in the browser developer console.
// - The donation-reminder is only shown in chromium based browsers (Chrome, Edge Chromium, Opera, etc.).
// - The donation-reminder is not shown in staging nor production environments.
// - The donation-reminder is not shown for small projects (when there are only few git authors).
// - The donation-reminder is not shown if the user has run `lsos remove`.

import { isRemoved } from "../env/isRemoved";
import { numberOfAuthors } from "../env/numberOfAuthors";
import assert = require("assert");
import { LsosProject } from "../types";

export { isDisabled };

function isDisabled(lsosProjects: LsosProject[]): boolean {
  if (
    userHasNotRemovedDonationReminder() &&
    isBrowser() &&
    isChromium() &&
    isDev() &&
    hasEnoughAuthors(lsosProjects)
  ) {
    return false;
  }
  return true;
}

function isBrowser() {
  return typeof window !== "undefined";
}

declare global {
  interface Window {
    process: any;
    opr: any;
    opera: any;
    chrome: any;
  }
}

function isDev() {
  if (!window?.process?.env) {
    return true;
  }
  if (["", "dev", "development"].includes(window.process.env.NODE_ENV)) {
    return true;
  }
  return false;
}

function isChromium() {
  // https://stackoverflow.com/questions/57660234/how-can-i-check-if-a-browser-is-chromium-based
  // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser

  const isOpera =
    (!!window.opr && !!window.opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;

  // Also detects Edge Chromium
  const isChrome = !!window.chrome;

  return isOpera || isChrome;
}

function hasEnoughAuthors(lsosProjects: LsosProject[]) {
  if ([null, undefined].includes(numberOfAuthors)) {
    return true;
  }
  assert(numberOfAuthors >= 0);
  if ([null, undefined].includes(lsosProjects)) {
    return true;
  }
  assert(lsosProjects.constructor === Array);

  return lsosProjects.some(({ minNumberOfAuthors }) => {
    assert(minNumberOfAuthors >= 0);
    return numberOfAuthors >= minNumberOfAuthors;
  });
}

function userHasNotRemovedDonationReminder() {
  assert([undefined, true, false].includes(isRemoved));
  if (isRemoved === undefined) {
    return true;
  }
  return !isRemoved;
}
