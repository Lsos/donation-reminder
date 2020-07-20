import { assert } from "./utils/assert";
import { LogFragment } from "./utils/computeConsoleLogArguments";
import { LsosProject } from "../types";

export { getDonationReminderLog };

const COLOR_GREEN = "#00ae41";
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

function getDonationReminderLog(projects: LsosProject[]): LogFragment[] {
  const texts = [
    ...getHeader(),
    ...verticalSpace(27),
    ...projects
      .map(({ projectName, npmName, donationText }) => {
        assert(projectName);
        return [
          ...projectLine({
            iconUrl: "https://lsos.org/npm/" + npmName + "/logo.svg",
            title: projectName,
            desc: insertIcons(donationText),
            link: "https://lsos.org/npm/" + npmName,
          }),
          ...verticalSpace(32),
        ];
      })
      .flat(),
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
      link: "https://lsos.org/fund",
    }),
    ...verticalSpace(30),
    ...getNote(),
    ...verticalSpace(24),
    ...getFooter(),
  ];

  return texts;
}

function projectLine({ iconUrl, title, desc, link }) {
  assert(title);
  const projectLogo = icon(iconUrl, {
    size: PROJECT_LOGO_SIZE,
    /*
    paddingHeight: 10,
    */
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
  ];
}

function insertIcons(text: string): any[] {
  let fragments = [text];
  const emojiList = text.match(/:[a-z_]+:/g);
  (emojiList || []).forEach((emojiCode) => {
    const emojiName = emojiCode.slice(1, -1);
    const emojiUrl = "https://lsos.org/emojis/" + emojiName + ".svg";
    const fragments__new = [];
    fragments.forEach((fragment) => {
      if (fragment.constructor !== String) {
        fragments__new.push(fragment);
        return;
      }
      assert(emojiCode.startsWith(":") && emojiCode.endsWith(":"));
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

  return fragments.map((fragment) => {
    if (fragment.constructor !== String) {
      return fragment;
    }

    return {
      text: fragment,
      enableLineBreak: true,
    };
  });
}

function icon(
  iconUrl: string,
  {
    size = 18,
    paddingHeight = 0,
  }: { size?: number; paddingHeight?: number } = {}
): LogFragment {
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
      "margin-top: -" + (paddingTop - paddingHeight) + "px",
      "margin-bottom: -" + (paddingBottom - paddingHeight) + "px",
      //"line-height: 0.6em",
    ],
  };
}

function verticalSpace(height: number): LogFragment[] {
  return [
    {
      text: "\n",
      style: [
        "font-size: 0",
        "line-height: 0",
        "color: red",
        "color: red",
        "color: red",
        "color: red",
        //"padding-bottom: " + height + "px",
      ],
    },
    {
      text: " ",
      style: [
        "padding-top: " + height + "px",
        "padding-left: 0px",
        "font-size: 0",
        "color: red",
        "color: red",
        "color: red",
        "color: red",
        "color: red",
      ],
    },
  ];
}

function separator(): LogFragment {
  return {
    text: "\xa0| ",
    style: [...innerMarginStyle, "color: #888"],
  };
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
    "padding: 2px 6px",
    "font-size: 0.99em",
    "border-radius: 4px",
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
