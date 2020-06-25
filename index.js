if (typeof window !== "undefined") {
  main();
}

function main() {
  //*
  const projectNames = [
    "awesome-bundler",
    "awesome-transpiler",
    "a-polyfill-collection",
    "awesome-dev-tool-1",
    "lovely-dev-tool-2",
    "lovely-dev-tool-3",
    "neat-markdown-tool-1",
    "neat-markdown-tool-2",
    "javascript-utility-library-1",
    "javascript-utility-library-2",
    "javascript-utility-library-3",
    "react-awesome-component-1",
    "react-awesome-component-2",
    "react-awesome-component-3",
    "react-awesome-component-4",
  ];
  /*/
  const projectNames = [
    "react-flip-move",
    "core-js",
    "@babel",
    "lerna",
    "@mdx",
    "remark",
    "@brillout",
    "chalk",
    "rxjs",
    "goldpage",
    "inquirer",
    "uuid",
    "rollup",
    "axios",
    "jest",
    "wildcard-api",
    "bluebird",
    "glob",
    "json-s",
  ];
  //*/

  const noteSize = "font-size: 0.99em;";
  const noteStyle = "color: #666; " + noteSize;
  /*
  const codeBg = "rgb(246, 248, 250)"
  /*/
  const codeBg = "rgb(236, 238, 240)";
  //*/
  const codeStyle = "background: " + codeBg + "; padding: 2px 7px; " + noteSize;
  const defaultStyle = "font-size: 1.2em; color: #31343d";

  const strings = [
    {
      text: "Support Open Source",
      style:
        "background: #00ae41; color: white; font-size: 2.2em; text-align: center; margin: auto; padding: 10px 20px",
    },
    "\n\n",
    "You are a company? Support\n\n",
    {
      text: projectNames.join("\xa0| "),
      style: "font-weight: bold; padding-left: 20px",
    },
    /*
    ...projectNames
      .map((name, i) => [
        {
          text: name + "\xa0| ",
          style: "font-weight: bold",
        },
        //"\xa0| ",
        // i !== projectNames.length - 1 ? ", " : "",
      ])
      .flat(),
    */
    "\n\n",
    "by donating $10 per month/user, see https://lsos.org/donation-fund/donate.",
    "\n\n",
    {
      text: "You can remove this note by running ",
      style: noteStyle,
    },
    {
      text: "npm run lsos",
      style: codeStyle,
    },
    {
      text: " / ",
      style: noteStyle,
    },
    {
      text: "yarn lsos",
      style: codeStyle,
    },
    {
      text: ".",
      style: noteStyle,
    },
  ];

  styledLog(strings, { defaultStyle });
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
