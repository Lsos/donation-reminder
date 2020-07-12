import { unique } from "./utils/unique";
import assert from "assert";

const COLOR_GREEN = "#00ae41";
const UNAVAILABLE_FUNDING_DEPS = Symbol();

const MARGIN_LEFT = 4;
const NOTE_ADDITIONAL_MARGIN = 2;
const PROJECT_LOGO_SIZE = 32;
const PROJECT_LOGO_MARGIN_RIGHT = 10;
const INNER_MARGIN_SIZE =
  MARGIN_LEFT + PROJECT_LOGO_SIZE + PROJECT_LOGO_MARGIN_RIGHT;
const innerMarginStyle = [
  "margin-left: " + INNER_MARGIN_SIZE + "px",
  "margin-right: -" + INNER_MARGIN_SIZE + "px",
];

if (!skip()) {
  showDonationReminder();
}

function showDonationReminder() {
  const strings = [
    ...getHeader(),
    "\n\n",
    /*
    "You are a company? Support",
    ...getFundingObjects(),
    "by donating $10 per developer/month.",
    "\n\n",
    */
    ...projectLine({
      iconUrl: "https://i.imgur.com/5OtGNl2.png",
      title: "React Table",
      desc: [
        "G'day ",
        icon("https://discord.com/assets/df7ba0f4020ca70048a0226d1dfa73f6.svg"),
        {
          text:
            ", I'm Tanner, I'd love to be able to work full-time on open source ",
          enableLineBreak: true,
        },
        icon("https://discord.com/assets/da3651e59d6006dfa5fa07ec3102d1f3.svg"),
      ],
      link: "https://lsos.org/npm/react-table",
    }),
    ...projectLine({
      iconUrl:
        "https://lsos.org/logo.hash_b4859b66bf49915e8d8ea777e776cc50.svg",
      title: "Lsos Donation Fund",
      desc: [
        {
          text: "Support all your open source dependencies",
          enableLineBreak: true,
        },
      ],
      link: "https://lsos.org/fund/donate",
    }),
    ...getNote(),
    "\n\n",
    ...getFooter(),
  ];

  styledLog(strings, { defaultStyle: defaultStyle() });
}

function projectLine({ iconUrl, title, desc, link }) {
  const projectLogo = icon(iconUrl, {
    size: PROJECT_LOGO_SIZE,
  });
  projectLogo.style.push(
    ...[
      "margin-left: " + MARGIN_LEFT + "px",
      "margin-right: -" + (MARGIN_LEFT + PROJECT_LOGO_SIZE) + "px",
      /*
      ...innerMarginStyle,
      innerMarginStyle[1],
      "padding-top: 10.3px",
      "line-height: 1em",
      */
    ]
  );
  return [
    projectLogo,
    {
      text: title,
      style: innerMarginStyle,
    },
    separator(),
    ...desc.map((strings) => {
      if (strings.constructor === String) {
        strings = {
          text: strings,
        };
      }
      strings.style = strings.style || [];
      strings.style.push(...innerMarginStyle);
      return strings;
    }),
    separator(),
    {
      text: link,
      style: innerMarginStyle,
    },
    "\n\n\n",
  ];
}

function icon(iconUrl: string, { size = 18 }: { size?: number } = {}) {
  const verticalAlignment = size > 20 ? 5 : 5;
  const paddingTop = size / 2 + verticalAlignment;
  const paddingBottom = size / 2 - verticalAlignment;
  return {
    //text: "\u200b",
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
      //"line-height: 0.6em",
    ],
  };
}

function separator() {
  return {
    text: "\xa0| ",
    style: [...defaultStyle(), ...innerMarginStyle, "color: #888"],
  };
}

function defaultStyle() {
  return ["font-size: 1.3em", "color: #31343d"];
}

function getFundingObjects() {
  const fundingList = getFundingList();

  if (fundingList === null) {
    return [" open source "];
  }

  return [
    "\n\n",
    {
      text: " ",
      style: ["padding-left: 20px"],
    },
    ...fundingList,
    "\n\n",
  ];
}

function getHeader() {
  const { text, style } = getBorderCommons();
  assert(text === "Support Open Source");
  return [
    {
      text,
      style: [
        ...style,
        "color: white",
        "padding-top: 10px",
        "padding-bottom: 10px",
      ],
    },
  ];
}

function getFooter() {
  const { text, style } = getBorderCommons();
  return [
    {
      text,
      style: [
        ...style,
        "color: " + COLOR_GREEN,
        "line-height: 0em",
        "padding-top: 12px",
      ],
    },
  ];
}

function getBorderCommons() {
  return {
    text: "Support Open Source",
    style: [
      "background: " + COLOR_GREEN,
      "font-size: 2.2em",
      "text-align: center",
      "padding-left: 20px",
      "padding-right: 20px",
      "border-radius: 10px",
    ],
  };
}

function getNote() {
  const codeStyle = [
    "background: rgb(236, 238, 240)",
    "padding: 2px 7px",
    "font-size: 0.99em",
  ];
  const noteStyle = ["color: #666", "font-size: 1.2em"];
  return [
    {
      text: "Remove this note by running ",
      style: [
        ...noteStyle,
        "margin-left: " + (MARGIN_LEFT + NOTE_ADDITIONAL_MARGIN) + "px",
      ],
    },
    {
      text: "npx lsos remove",
      style: codeStyle,
    },
    {
      text: "/",
      style: noteStyle,
    },
    {
      text: "yarn lsos remove",
      style: codeStyle,
    },
    {
      text: ".",
      style: noteStyle,
    },
  ];
}

function getFundingList() {
  const fundingPackages = getFundingPackages();
  if (fundingPackages === UNAVAILABLE_FUNDING_DEPS) {
    return null;
  }
  const fundingInfo = unique([
    ...fundingPackages["_root"],
    ...Object.keys(fundingPackages),
  ])
    .filter((pkgName) => pkgName !== "_root")
    .map((pkgName) => {
      const fundingDeps = unique(
        (fundingPackages[pkgName] || [])
          .map((depName) => depName.split("/")[0])
          .sort((depName1, depName2) => {
            if (depName2.includes(pkgName)) {
              return -1;
            }
            if (depName1.includes(pkgName)) {
              return 1;
            }
          })
      );
      const wantsFunding = fundingPackages["_root"].includes(pkgName);
      return {
        pkgName,
        wantsFunding,
        fundingDeps,
      };
    });

  const boldStyle = ["font-weight: bold"];
  const depListMax = 3;
  const fundingList = fundingInfo
    .map(({ pkgName, wantsFunding, fundingDeps }, i) => {
      const pkgText = wantsFunding
        ? {
            text: pkgName,
            style: boldStyle,
          }
        : pkgName;
      const depText =
        fundingDeps.length === 0
          ? []
          : [
              " [",
              ...fundingDeps
                .slice(0, depListMax + 1)
                .map((depName, i) => {
                  if (i === depListMax) {
                    const depsLeft = fundingDeps.length - depListMax;
                    return [", ...(" + depsLeft + " more)"];
                  }
                  assert(depName);
                  return [
                    {
                      text: depName,
                      style: boldStyle,
                    },
                    i === fundingDeps.length - 1 || i === depListMax - 1
                      ? ""
                      : ", ",
                  ];
                })
                .flat(),
              "]",
            ];
      return [
        pkgText,
        ...depText,
        i === fundingInfo.length - 1 ? "" : "\xa0| ",
      ];
    })
    .flat();
  return fundingList;
}

function styledLog(strings = [], { defaultStyle = [] } = {}) {
  let str = "";
  const styles = [];
  strings.forEach((spec) => {
    if (spec.constructor === String) {
      spec = { text: spec };
    }
    spec.style = [...defaultStyle, ...(spec.style || [])];

    let wordsSpec = [spec];
    if (spec.enableLineBreak) {
      const wordsText = spec.text.split(" ");
      wordsSpec = wordsText.map((wordText, nthWord) => {
        const isFirstWord = nthWord !== 0;
        const isLastWord = nthWord === wordsText.length - 1;

        wordText += isLastWord ? "" : " ";

        const wordStyle = spec.style.filter((style) => {
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

        const wordSpec = {
          text: wordText,
          style: wordStyle,
        };
        return wordSpec;
      });
    }
    wordsSpec.forEach((wordSpec) => {
      str += "%c" + wordSpec.text;
      styles.push(wordSpec.style.join(";"));
    });
  });
  console.log(str, ...styles);
}

function getFundingPackages(): Symbol | object {
  const fundingPackages = /*FUNDING_DEPS_BEGIN*/ UNAVAILABLE_FUNDING_DEPS; /*FUNDING_DEPS_END*/
  return fundingPackages;
}

function skip() {
  return (
    // We only show the donation-reminder in the browser
    !isBrowser() ||
    // We don't show the donation-reminder in staging or production environments
    !isDev() ||
    // The donation-reminder only works in chromium browsers
    !isChromium()
  );
}

function isBrowser() {
  return typeof window !== "undefined";
}

function isDev() {
  if (!window?.process?.env) {
    return true;
  }
  return ["", "dev", "development"].includes(process.env.NODE_ENV);
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
