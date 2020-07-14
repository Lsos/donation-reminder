// The donation-reminder is shown only under certain conditions.
// - The donation-reminder is only shown in the browser developer console.
// - The donation-reminder is only shown in chromium based browsers (Chrome, Edge Chromium, Opera, etc.).
// - The donation-reminder is not shown in staging nor production environments.

export { skip };

function skip() {
  if (isBrowser() && isChromium() && isDev()) {
    return false;
  }
  return true;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function isDev() {
  if (!window?.process?.env) {
    return true;
  }
  if (["", "dev", "development"].includes(process.env.NODE_ENV)) {
    return true;
  }
  return false;
}

declare global {
  interface Window {
    opr: any;
    opera: any;
    chrome: any;
  }
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
