// Bunch of utilities for styled logs

import { LogFragment, Style } from "./types";
import { emojiRegex } from "../../../utils/emojiRegex";
import assert = require("assert");

export { verticalSpace };
export { icon };
export { injectEmojis };
export { injectLineBreaks };
export { injectStyle };

function verticalSpace(height: number): LogFragment[] {
  return [
    {
      text: "\n",
      style: ["font-size: 0"],
    },
    {
      text: " ",
      style: ["padding-top: " + height + "px", "font-size: 0"],
    },
  ];
}

function icon(
  iconUrl: string,
  { size = 18 }: { size?: number } = {}
): LogFragment {
  const verticalAlignment = size > 20 ? 5 : 5;
  const paddingTop = size / 2 + verticalAlignment;
  const paddingBottom = size / 2 - verticalAlignment;
  return {
    text: " ",
    style: [
      "font-size: 0px",
      'background-image: url("' + iconUrl + '")',
      "background-size: contain",
      "background-repeat: no-repeat",
      "background-position: center",
      "vertical-align: middle",
      "padding-top: " + paddingTop + "px",
      "padding-bottom: " + paddingBottom + "px",
      "padding-left: " + size / 2 + "px",
      "padding-right: " + size / 2 + "px",
      "margin-top: -" + paddingTop + "px",
      "margin-bottom: -" + paddingBottom + "px",
    ],
  };
}

function injectEmojis(text: string): LogFragment[] {
  let fragments: (string | LogFragment)[] = [text];

  const emojiList = text.match(new RegExp(emojiRegex, "g"));
  (emojiList || []).forEach((emojiCode) => {
    assert(emojiCode.startsWith(":") && emojiCode.endsWith(":"));
    const emojiName = emojiCode.slice(1, -1);
    const emojiUrl = "https://lsos.org/emojis/" + emojiName + ".svg";

    const fragments__new = [];
    fragments.forEach((fragment) => {
      if (fragment.constructor !== String) {
        fragments__new.push(fragment);
        return;
      }
      if (!fragment.includes(emojiCode)) {
        fragments__new.push(fragment);
        return;
      }
      const fragments__sub = fragment.split(emojiCode);
      fragments__sub.forEach((fragment_sub, i) => {
        fragments__new.push(fragment_sub);
        if (i !== fragments__sub.length - 1) {
          fragments__new.push(icon(emojiUrl));
        }
      });
    });

    fragments = fragments__new;
  });

  const fragments__formatted: LogFragment[] = fragments.map((fragment) => {
    if (typeof fragment === "string") {
      return {
        text: fragment,
        style: [],
      };
    } else {
      return fragment;
    }
  });
  return fragments__formatted;
}

function injectLineBreaks(logFragments: LogFragment[]): LogFragment[] {
  const logFragments__new: LogFragment[] = [];

  logFragments.forEach(({ text, style }: LogFragment) => {
    const wordsText = text.split(" ");
    wordsText.forEach((wordText, nthWord) => {
      const isFirstWord = nthWord !== 0;
      const isLastWord = nthWord === wordsText.length - 1;

      wordText += isLastWord ? "" : " ";

      const wordStyle = style.filter((style) => {
        assert(!style.includes(";"));
        assert(/[^[a-z]/.test(style));
        /*
        if (style.startsWith("padding-left") && isFirstWord) {
          return false;
        }
        if (style.startsWith("padding-right") && !isLastWord) {
          return false;
        }
        */
        assert(!style.startsWith("padding:"));
        return true;
      });

      logFragments__new.push({
        text: wordText,
        style: wordStyle,
      });
    });
  });

  return logFragments__new;
}

function injectStyle(logFragments: LogFragment[], style: Style): LogFragment[] {
  return logFragments.map((logFrag: LogFragment) => {
    logFrag.style.push(...style);
    return logFrag;
  });
}
