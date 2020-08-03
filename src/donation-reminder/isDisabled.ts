// The donation-reminder is shown only under certain conditions.
// - The donation-reminder is only shown in the browser developer console.
// - The donation-reminder is only shown in chromium based browsers (Chrome, Edge Chromium, Opera, etc.).
// - The donation-reminder is not shown in staging nor production environments.
// - The donation-reminder is not shown for small projects (when there are only few git authors).
// - The donation-reminder is not shown if the user has run `lsos remove`.

import { userConfig } from "../env/userConfig";
import { numberOfAuthors } from "../env/numberOfAuthors";
import { LsosProject } from "../types";

export { isDisabled };

function isDisabled(lsosProjects: LsosProject[]): boolean {
  if (
    lsosProjects.length > 0 &&
    !isRemoved() &&
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
  if (window.location.hostname !== "localhost") {
    return false;
  }
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
  console.assert(lsosProjects && lsosProjects.length >= 1);
  const minNumberOfAuthors = Math.min.apply(
    Math,
    lsosProjects.map(({ minNumberOfAuthors }) => {
      console.assert(
        minNumberOfAuthors === undefined || minNumberOfAuthors >= 0,
        { minNumberOfAuthors }
      );
      return minNumberOfAuthors || 0;
    })
  );
  console.assert(minNumberOfAuthors >= 0);

  if (minNumberOfAuthors === 0) {
    return true;
  }

  if ([null, undefined].includes(numberOfAuthors)) {
    // postinstall script didn't run successfully
    return false;
  }
  console.assert(numberOfAuthors >= 0);

  return numberOfAuthors >= minNumberOfAuthors;
}

// Whether the user has removed the donation-reminder,
// that is whether the user ran `lsos remove`.
function isRemoved() {
  // postinstall script didn't run successfully
  if (userConfig === undefined) {
    return false;
  }

  // There is no `~/.lsos.json`
  if (userConfig === null) {
    return false;
  }

  // `~/.lsos.json#donationReminder.remove == true` — the
  // user ran `lsos remove`.
  if (userConfig?.donationReminder?.remove) {
    return true;
  }

  return false;
}
