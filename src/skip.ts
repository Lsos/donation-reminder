// The donation-reminder is shown only under certain conditions.
// - The donation-reminder is only shown in the browser developer console.
// - The donation-reminder is only shown in chromium based browsers (Chrome, Edge Chromium, Opera, etc.).
// - The donation-reminder is not shown in staging nor production environments.
// - The donation-reminder is not shown if the user has run `lsos remove`.

export { skip };

function skip() {
  if (isBrowser() && isChromium() && isDev() && !isRemoved()) {
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

function isRemoved() {
  return (
    /*IS_REMOVED_BEGIN*/
    true
    /*IS_REMOVED_END*/
  );
}
