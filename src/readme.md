# Source Code Explainer

The `@lsos/donation-reminder` package has no dependencies
and all its source code is included in this `src/` directory.
The only system dependencies are that the user has `npx` (or `yarn`) and `git` installed.

The code revolves around following functionalities:
 1. Show a donation-reminder in the browser developer console.
 2. Only show the donation-reminder if the user has not run `npx lsos remove` / `yarn lsos remove`.
 3. Only show the donation-reminder if the user's Git repository has at least `minNumberOfAuthors` authors.
 4. Only show the donation-reminder in development on Chromium-based browsers.

That's it: the purpose of every single line of code are the functionalities listed above.

### CLI

Source code:
[./scripts/cli/](/src/scripts/cli/).

To achieve `2.`, the `@lsos/donation-reminder` implements the `lsos remove` CLI command that, when run, creates a `~/.lsos.json` user config file and sets `~/.lsos.json#donationReminder.remove` to `true`. Source code: [./scripts/cli/remove](/src/scripts/cli/remove.ts).

### Postinstall

Source code:
[./scripts/postinstall/](/src/scripts/postinstall/),
[./env/](/src/env/).

To achieve `2.` and `3.`, the `@lsos/donation-reminder` package runs a `postinstall` script that does two things:
 - It finds the user config `~/lsos.json` and copies its content to `./env/userConfig.ts`.
   The browser-side code imports `./env/userConfig.ts`;
   this is how the browser-side business logic knows whether the user has run `lsos remove`.
   Source code:
   [./scripts/postinstall/findUserConfig](/src/scripts/postinstall/findUserConfig.ts),
   [./env/userConfig.ts](/src/env/userConfig.ts).
 - It finds the number of Git authors of the user's Git repository.
   To retrieve the number of Git authors it runs and parses `git shortlog --summary --numbered --email --all`.
   The number is saved in `./env/numberOfAuthors.ts` which is imported by the browser-side code.
   Source code:
   [./scripts/postinstall/findNumberOfAuthors](/src/scripts/postinstall/findNumberOfAuthors.ts),
   [./env/numberOfAuthors.ts](/src/env/numberOfAuthors.ts).

### Browser-side code

Source code:
[./donation-reminder/](/src/donation-reminder/),
[./env/](/src/env/).

The browser-side code exports a single function `printDonationReminder()` which when called prints the donation-reminder in the browser developer console.
Source code: [./donation-reminder/printDonationReminder](/src/donation-reminder/printDonationReminder.ts).

The browser-side business logic is implemented by three modules:
 - `isDisabled`
 - `getDonationReminderLog`
 - `collectCalls`

The `isDisabled` module determines whether the donation-reminder should be shown.
It uses the information saved in [./env/](/src/env/).
Source code: [./donation-reminder/isDisabled](/src/donation-reminder/isDisabled.ts).

The `getDonationReminderLog` module determines how the donation-reminder looks like.
Source code: [./donation-reminder/getDonationReminderLog](/src/donation-reminder/getDonationReminderLog.ts).

The `collectCalls` module is about awaiting `printDonationReminder()` calls:
instead of printing one `console.log` per `printDonationReminder()` call, we print a single `console.log`.
For that, we use the `collectCalls` module that basically blocks execution until all `printDonationReminder()` calls are run.
Source code: [./donation-reminder/collectCalls](/src/donation-reminder/collectCalls.ts).
