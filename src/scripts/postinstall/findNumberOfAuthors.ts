import { replaceFileContent } from "./utils/replaceFileContent";
import { retrieveNumberOfAuthors } from "./findNumberOfAuthors/retrieveNumberOfAuthors";

import assert = require("assert");

export { findNumberOfAuthors };

async function findNumberOfAuthors() {
  const numberOfAuthors = await retrieveNumberOfAuthors();
  assert(numberOfAuthors === null || numberOfAuthors >= 0);
  replaceFileContent(
    require.resolve("../../env/numberOfAuthors.js"),
    "numberOfAuthors",
    numberOfAuthors
  );
}
