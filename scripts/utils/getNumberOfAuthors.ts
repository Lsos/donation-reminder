import { execCmd } from "../utils/execCmd";

export { getNumberOfAuthors };

async function getNumberOfAuthors() {
  const gitAuthorList = await getGitAuthorList();
  console.log(gitAuthorList);
  return 3;
}

async function getGitAuthorList() {
  try {
    return await execCmd("git shortlog --summary --numbered --email --all");
  } catch (_) {
    return null;
  }
}

/*
async function gitIsAvailable() {
    try {
      await execCmd('git --version');
      return true;
    } catch(err) {
      return false;
    }
}
*/

