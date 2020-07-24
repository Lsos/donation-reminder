import { findUserConfig } from "./postinstall/findUserConfig";
import { findNumberOfAuthors } from "./postinstall/findNumberOfAuthors";

postinstall();

async function postinstall() {
  await Promise.all([findUserConfig(), findNumberOfAuthors()]);
}
