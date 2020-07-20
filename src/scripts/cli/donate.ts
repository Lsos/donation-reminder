import { findLsosProjects } from "./donate/findLsosProjects";
import { LsosProject } from "../../types";
import { symbolInfo, fgBold, fgGray, symbolTab } from "./utils/cli-components";
import { getLsosProjectInfo } from "../../utils/getLsosProjectInfo";

export { donate };

const HLINE = symbolTab + "~~~~~~~~~~~~~~~~~~";

async function donate() {
  const lsosProjects: LsosProject[] = await findLsosProjects();
  console.log(symbolInfo + "Your dependencies' donation page:");
  lsosProjects
    .map(getLsosProjectInfo)
    .forEach(({ projectName, donationTextWithoutEmojis, donatePageUrl }) => {
      console.log(HLINE);
      console.log(symbolTab + fgBold(projectName));
      console.log(symbolTab + fgGray(donationTextWithoutEmojis));
      console.log(symbolTab + donatePageUrl);
    });
  console.log(HLINE);
  console.log("");

  console.log(symbolInfo + fgBold("Lsos Donation Fund"));
  console.log(
    symbolTab +
      fgGray(
        "Set up a monthly donation and we take care of distributing your donations among your open-source dependencies."
      )
  );
  console.log(symbolTab + "https://github.com/fund");
  console.log();
}
