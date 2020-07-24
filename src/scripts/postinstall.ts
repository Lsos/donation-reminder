import { findUserConfig } from "./postinstall/findUserConfig";
import { findNumberOfAuthors } from "./postinstall/findNumberOfAuthors";

postinstall();

async function postinstall() {
  try {
    await Promise.all([findUserConfig(), findNumberOfAuthors()]);
  } catch (err) {
    console.log("====== Warning ======");
    console.log(err);
  }
}
