// This module computes the donation-reminder render model.
// Input: `LsosProject[]` - the list of open-source projects that use the `@lsos/donation-reminder` package
// Output: `LogFragment[]` - the donation-reminder render model

import { LsosProject } from "../types";
import { LogFragment, Style } from "./utils/styled-log/types";
import { getLsosProjectInfo } from "../utils/getLsosProjectInfo";
import {
  icon,
  verticalSpace,
  injectEmojis,
  injectLineBreaks,
  injectStyle,
} from "./utils/styled-log/components";

export { getDonationReminderLog };

const HEADER_TITLE = "Support Open Source";
const BORDER_GREEN_COLOR = "#00ae41";
const MARGIN_LEFT = 4;
const MARGIN_NOTE_LEFT = 2;
const PROJECT_LOGO_SIZE = 32;
const PROJECT_LOGO_MARGIN_RIGHT = 10;

function getDonationReminderLog(projects: LsosProject[]): LogFragment[] {
  return [
    ...getHeader(),
    ...verticalSpace(27),
    ...projects
      .map(getLsosProjectInfo)
      .map(
        ({ projectName, iconUrl, donationTextWithEmojis, donatePageUrl }) => [
          ...projectLine({
            iconUrl,
            title: projectName,
            description: donationTextWithEmojis,
            link: donatePageUrl,
          }),
          ...verticalSpace(32),
        ]
      )
      .flat(),
    ...projectLine({
      iconUrl: "https://lsos.org/logo.svg",
      title: "Lsos Donation Fund",
      description: "Support all your open source dependencies",
      link: "https://lsos.org/fund",
    }),
    ...verticalSpace(30),
    ...getNote(),
    ...verticalSpace(26),
    ...getFooter(),
  ];
}

function projectLine({
  iconUrl,
  title,
  description,
  link,
}: {
  iconUrl: string;
  title: string;
  description: string;
  link: string;
}): LogFragment[] {
  const projectLogo = icon(iconUrl, {
    size: PROJECT_LOGO_SIZE,
  });
  projectLogo.style.push(
    ...[
      "margin-left: " + MARGIN_LEFT + "px",
      "margin-right: -" + (MARGIN_LEFT + PROJECT_LOGO_SIZE) + "px",
    ]
  );

  const innerMarginStyle = getInnerMarginStyle();

  let descriptionFragments: LogFragment[] = injectEmojis(description);
  descriptionFragments = injectLineBreaks(descriptionFragments);
  descriptionFragments = injectStyle(descriptionFragments, innerMarginStyle);

  return [
    projectLogo,
    {
      text: title,
      style: innerMarginStyle,
    },
    separator(),
    ...descriptionFragments,
    separator(),
    {
      text: link,
      style: innerMarginStyle,
    },
  ];
}

function separator(): LogFragment {
  const innerMarginStyle = getInnerMarginStyle();

  return {
    text: "\xa0| ",
    style: [...innerMarginStyle, "color: #888"],
  };
}

function getHeader(): LogFragment[] {
  return [
    {
      text: HEADER_TITLE,
      style: [
        ...getBorderStyle(),
        "color: white",
        "padding-top: 10px",
        "padding-bottom: 10px",
      ],
    },
  ];
}

function getFooter(): LogFragment[] {
  return [
    {
      text: HEADER_TITLE,
      style: [
        ...getBorderStyle(),
        "color: " + BORDER_GREEN_COLOR,
        "line-height: 0em",
        "padding-top: 12px",
      ],
    },
  ];
}

function getBorderStyle(): Style {
  return [
    "background: " + BORDER_GREEN_COLOR,
    "font-size: 2.2em",
    "text-align: center",
    "padding-left: 20px",
    "padding-right: 20px",
    "border-radius: 10px",
  ];
}

function getNote(): LogFragment[] {
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
        "margin-left: " + (MARGIN_LEFT + MARGIN_NOTE_LEFT) + "px",
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

function getInnerMarginStyle(): Style {
  const INNER_MARGIN_SIZE =
    MARGIN_LEFT + PROJECT_LOGO_SIZE + PROJECT_LOGO_MARGIN_RIGHT;
  const innerMarginStyle = [
    "margin-left: " + INNER_MARGIN_SIZE + "px",
    "margin-right: -" + INNER_MARGIN_SIZE + "px",
  ];
  return innerMarginStyle;
}
