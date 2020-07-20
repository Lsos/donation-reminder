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

import { assert } from "../utils/assert";

export { getConsoleLogArguments };

type Text = string & { _brand?: "Text" };
type Style = string & { _brand?: "Style" };
export type LogFragment = {
  text: Text;
  style?: Style[];
  enableLineBreak?: boolean;
};

function getConsoleLogArguments(
  logFragments: LogFragment[],
  {
    defaultStyle = ["font-size: 1.3em", "color: #31343d"],
  }: { defaultStyle?: Style[] } = {}
): string[] {
  logFragments = applyOptions(logFragments, { defaultStyle });

  return computeArguments(logFragments);
}

function computeArguments(logFragments: LogFragment[]) {
  let str = "";
  const styles = [];

  logFragments.forEach((wordSpec: LogFragment) => {
    str += "%c" + wordSpec.text;
    styles.push(wordSpec.style.join(";"));
  });

  return [str, ...styles];
}

function applyOptions(
  logFragments: LogFragment[],
  { defaultStyle }
): LogFragment[] {
  const logFragments__processed: LogFragment[] = [];

  logFragments.forEach((logFrag: LogFragment) => {
    // Add defaultStyle
    logFrag.style = [...(defaultStyle || []), ...(logFrag.style || [])];

    // Add line breaking
    if (!logFrag.enableLineBreak) {
      logFragments__processed.push(logFrag);
    } else {
      logFragments__processed.push(...breakIntoWords(logFrag));
    }
  });

  return logFragments__processed;
}

function breakIntoWords(logFrag: LogFragment) {
  const words: LogFragment[] = [];

  if (logFrag.enableLineBreak) {
    const wordsText = logFrag.text.split(" ");
    wordsText.forEach((wordText, nthWord) => {
      const isFirstWord = nthWord !== 0;
      const isLastWord = nthWord === wordsText.length - 1;

      wordText += isLastWord ? "" : " ";

      const wordStyle = logFrag.style.filter((style) => {
        assert(!style.includes(";"));
        assert(/[^[a-z]/.test(style));
        if (style.startsWith("padding-left") && isFirstWord) {
          return false;
        }
        if (style.startsWith("padding-right") && !isLastWord) {
          return false;
        }
        assert(!style.startsWith("padding:"));
        return true;
      });

      words.push({
        text: wordText,
        style: wordStyle,
      });
    });
  }

  return words;
}
