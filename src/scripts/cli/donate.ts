import { findLsosProjects } from "./donate/findLsosProjects";
import { LsosProject } from "../../types";
import { symbolInfo, fgBold, fgGray, symbolTab } from "./utils/cli-components";
import { getLsosProjectInfo } from "../../utils/getLsosProjectInfo";

export { donate };

const HLINE = symbolTab + "~~~~~~~~~~~~~~~~~~";

async function donate() {
  const lsosProjects: LsosProject[] = await findLsosProjects();

  printLsosProjects(lsosProjects);

  printLsosDonationFund();
}

function printLsosProjects(lsosProjects: LsosProject[]) {
  if (lsosProjects.length === 0) {
    return;
  }
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
}

function printLsosDonationFund() {
  console.log(symbolInfo + fgBold("Lsos Donation Fund"));
  console.log(
    symbolTab +
      fgGray(
        "Set up a monthly donation while we take care of fairly distributing your donations among your open-source dependencies."
      )
  );
  console.log(symbolTab + "https://lsos.org/fund");
  console.log();
}
