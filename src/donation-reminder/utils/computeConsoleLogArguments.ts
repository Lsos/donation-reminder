// The module turns an specification array of texts and style
// into arguments to be fed to `console.log`

// For example:
//   console.log(
//     ...computeConsoleLogArguments({
//       texts: [
//         { text: "I'm red", style: ["color: red"] },
//         { text: "I'm bold & blue", style: ["color: blue", "font-weight: bold"] },
//       ],
//     })
//   );

// Resources:
// - https://stackoverflow.com/questions/7505623/colors-in-javascript-console
// - https://stackoverflow.com/questions/62793376/advanced-styling-of-browser-console-log

import { assert } from "../utils/assert";

export { computeConsoleLogArguments };

type Text = string & { _brand?: "Text" };
type EnableLineBreak = boolean & { _brand?: "EnableLineBreak" };
type Style = string & { _brand?: "Style" };
type TextWithStyle = {
  text: Text;
  enableLineBreak?: EnableLineBreak;
  style?: Style[];
};
type TextSpec = TextWithStyle | Text;
export type LogSpec = {
  texts: TextSpec[];
  defaultStyle?: Style[];
};

function computeConsoleLogArguments({
  texts,
  defaultStyle,
}: LogSpec): string[] {
  const textsProcessed: TextWithStyle[] = [];

  texts.forEach((textSpec: TextSpec) => {
    // Overloading
    const textWithStyle: TextWithStyle =
      typeof textSpec === "string"
        ? { text: textSpec as Text }
        : (textSpec as TextWithStyle);

    // Add defaultStyle
    textWithStyle.style = [
      ...(defaultStyle || []),
      ...(textWithStyle.style || []),
    ];

    // Add line b
    if (!textWithStyle.enableLineBreak) {
      textsProcessed.push(textWithStyle);
    } else {
      textsProcessed.push(...breakIntoWords(textWithStyle));
    }
  });

  return computeArguments(textsProcessed);
}

function computeArguments(texts: TextWithStyle[]) {
  let str = "";
  const styles = [];

  texts.forEach((wordSpec: TextWithStyle) => {
    str += "%c" + wordSpec.text;
    styles.push(wordSpec.style.join(";"));
  });

  return [str, ...styles];
}

function breakIntoWords(textWithStyle: TextWithStyle) {
  const words: TextWithStyle[] = [];

  if (textWithStyle.enableLineBreak) {
    const wordsText = textWithStyle.text.split(" ");
    wordsText.forEach((wordText, nthWord) => {
      const isFirstWord = nthWord !== 0;
      const isLastWord = nthWord === wordsText.length - 1;

      wordText += isLastWord ? "" : " ";

      const wordStyle = textWithStyle.style.filter((style) => {
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
