// Npm package name
type NpmName = string & { _brand?: "NpmName" };

// Human readable name
type ProjectName = string & { _brand?: "ProjectName" };

// Text shown in the donation-reminder
type DonationText = string & { _brand?: "DonationText" };

// The donation-reminder is shown only if the number of git authors is `>= minNumberOfAuthors`
type MinNumberOfAuthors = number & { _brand?: "MinNumberOfAuthors" };

export type LsosProject = {
  npmName: NpmName;
  projectName: ProjectName;
  donationText: DonationText;
  minNumberOfAuthors: MinNumberOfAuthors;
};

export type PackageJSON = {
  name: NpmName;
  lsos: {
    projectName: ProjectName;
    donationReminder: {
      text: DonationText;
      minNumberOfAuthors?: MinNumberOfAuthors;
    };
  };
};
