import { unique } from "./utils/unique";
import assert from "assert";

const UNAVAILABLE_FUNDING_DEPS = Symbol();

if (typeof window !== "undefined") {
  main();
}

function main() {
  const strings = [
    ...getHeader(),
    "\n\n",
    "You are a company? Support",
    ...getFundingObjects(),
    "by donating $10 per month/developer.",
    "\n\n",
    ...getFooter(),
  ];

  styledLog(strings, { defaultStyle: "font-size: 1.2em; color: #31343d" });
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
      style: "padding-left: 20px",
    },
    ...fundingList,
    "\n\n",
  ];
}

function getHeader() {
  return [
    {
      text: "Support Open Source",
      style:
        "background: #00ae41; color: white; font-size: 2.2em; text-align: center; margin: auto; padding: 10px 20px",
    },
  ];
}

function getFooter() {
  const codeStyle =
    "background: rgb(236, 238, 240); padding: 2px 7px; font-size: 0.99em;";
  return [
    "Donate and/or remove this note by running ",
    {
      text: "npx lsos",
      style: codeStyle,
    },
    "/",
    {
      text: "yarn lsos",
      style: codeStyle,
    },
    ".",
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

  const boldStyle = "font-weight: bold";
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

function styledLog(strings = [], { defaultStyle = "" } = {}) {
  let str = "";
  const styles = [];
  strings.forEach((spec) => {
    if (spec.constructor === String) {
      spec = {
        text: spec,
        style: defaultStyle,
      };
    }
    str += "%c" + spec.text;
    styles.push(spec.style);
  });
  console.log(str, ...styles);
}

function getFundingPackages(): Symbol | object {
  const fundingPackages = /*FUNDING_DEPS_BEGIN*/ UNAVAILABLE_FUNDING_DEPS; /*FUNDING_DEPS_END*/
  return fundingPackages;
}
