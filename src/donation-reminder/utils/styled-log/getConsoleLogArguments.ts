// This module turns an array of styled texts into a format that `console.log` understands
// For example:
//   console.log(
//     ...getConsoleLogArguments([
//       { text: "I'm red", style: ["color: red"] },
//       { text: "I'm bold & blue", style: ["color: blue", "font-weight: bold"] },
//     ])
//   );

// Resources:
// - https://stackoverflow.com/questions/7505623/colors-in-javascript-console
// - https://stackoverflow.com/questions/62793376/advanced-styling-of-browser-console-log

import { LogFragment, Style } from "./types";

export { getConsoleLogArguments };

function getConsoleLogArguments(
  logFragments: LogFragment[],
  { defaultStyle = ["font-size: 1.3em"] }: { defaultStyle?: Style } = {}
): string[] {
  logFragments = applyOptions(logFragments, { defaultStyle });

  return computeArguments(logFragments);
}

// We transform LogFragment[] to arguments for console.log.
// For example, from:
//   [
//     {
//       text: " I'm blue on a yellow background!",
//       style: ["background: yellow", "color: red"]
//     }
//   ]
// to:
//   console.log(...[
//     '%c I'm blue on a yellow background!',
//     'background: yellow; color: blue'
//   ]);
function computeArguments(logFragments: LogFragment[]): string[] {
  let str = "";
  const styles = [];

  logFragments.forEach(({ text, style }: LogFragment) => {
    str += "%c" + text;
    styles.push(style.join(";"));
  });

  return [str, ...styles];
}

function applyOptions(
  logFragments: LogFragment[],
  { defaultStyle }
): LogFragment[] {
  logFragments.forEach((logFrag: LogFragment) => {
    // Add defaultStyle
    logFrag.style = [...(defaultStyle || []), ...(logFrag.style || [])];
  });

  return logFragments;
}

