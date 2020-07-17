import { replaceFileContent } from "./utils/replaceFileContent";
import { getNumberOfAuthors } from "./utils/getNumberOfAuthors";
import assert = require("assert");

export { findNumberOfAuthors };

async function findNumberOfAuthors() {
  const numberOfAuthors = await getNumberOfAuthors();
  assert(numberOfAuthors === null || numberOfAuthors >= 0);
  replaceFileContent(
    require.resolve("../../env/numberOfAuthors.js"),
    "numberOfAuthors",
    numberOfAuthors
  );
}
