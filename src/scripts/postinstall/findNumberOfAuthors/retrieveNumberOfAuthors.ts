import { execCmd } from "../utils/execCmd";
import { splitByLine, splitByWhitespace } from "../utils/split";
import assert = require("assert");

export { retrieveNumberOfAuthors };

async function retrieveNumberOfAuthors(): Promise<number | null> {
  const gitAuthorList = await getGitAuthorList();
  if (!gitAuthorList) {
    return null;
  }

  const authors = splitByLine(gitAuthorList)
    .filter(Boolean)
    .map((authorSummary) => {
      const parts = splitByWhitespace(authorSummary).filter(Boolean);

      const partNumberOfCommits = parts[0];
      const numberOfCommits = parseInt(partNumberOfCommits, 10);
      assert(numberOfCommits >= 1);
      assert(numberOfCommits.toString() === partNumberOfCommits);

      const partEmail = parts[parts.length - 1];
      assert(partEmail.startsWith("<"));
      assert(partEmail.endsWith(">"));
      const email = partEmail.slice(1, partEmail.length - 1);
      assert(email.length === partEmail.length - 2);

      const partName = parts.slice(1, parts.length - 1);
      assert(partName.length === parts.length - 2);
      const name = partName.join(" ");

      return { name, email, numberOfCommits };
    });

  let numberOfAuthors = 0;
  const authorNames = {};
  const authorEmails = {};
  authors.forEach(({ numberOfCommits, name, email }) => {
    // We consider someone an author only if he commited at least 10 commits
    if (numberOfCommits < 10) {
      return;
    }

    email = email.toLowerCase();
    name = name.toLowerCase();

    // Detect duplicated user
    if (authorEmails[email] === true) {
      return;
    }

    // Detect duplicated user
    // We don't match first names, such as "Alice"
    const isFirstNameOnly = name.split(" ").length === 1;
    if (authorNames[name] === true && !isFirstNameOnly) {
      return;
    }

    // Detect bots
    const botRegex = /\bbot\b/;
    if (botRegex.test(name) || botRegex.test(email)) {
      return;
    }

    authorEmails[email] = true;
    authorEmails[name] = true;
    numberOfAuthors++;
  });

  return numberOfAuthors;
}

async function getGitAuthorList(): Promise<string | null> {
  try {
    return await execCmd("git shortlog --summary --numbered --email --all");
  } catch (_) {
    return null;
  }
}
