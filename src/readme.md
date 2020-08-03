# Source Code Explainer

The `@lsos/donation-reminder` package has no dependencies
and all its code is included in this `src/` folder.
The only system dependency is that the user has `git` installed.

The code revolves around following functionalities:
 1. Show the donation-reminder in the browser developer console.
 2. Only show the donation-reminder if the user has not run `npx lsos remove` / `yarn lsos remove`.
 3. Only show the donation-reminder if the user's git repository has at least `minNumberOfAuthors` authors.
 4. Only show the donation-reminder in development and on chromium-based broswers.

That's it; the purpose of every single line of code are the functionalities listed above.

### CLI

To achieve `2.`, the `@lsos/donation-reminder` implements the `lsos remove` CLI command that, when run, creates a `~/.lsos.json` user config file and sets `~/.lsos.json#donationReminder.remove` to `true`.

### Postinstall

To achieve `2.` and `3.`, the `@lsos/donation-reminder` package runs a `postinstall` script that does two things:
 - Finds the user config `~/lsos.json` and copies its content to `env/userConfig.ts`. The browser imports `env/userConfig.ts`; this is how we the browser-side code knows whether the user has run `lsos remove`.
 - Finds the number of authors of the user's git repository. To retrieve the number of authors we run and parse `git shortlog --summary --numbered --email --all`. The number is saved in `env/numberOfAuthors.ts` which is imported by the browser-side code.

### Browser-side code

The browser-side code ([`./donation-reminder/`](/src/donation-reminder/readme.md)) implements the exported `printDonationReminder` function that packages call in order to show the donation-reminder to their users.

The buisness logic is implemented by three modules:
 - `isDisabled`
 - `getDonationReminderLog`
 - `collectLsosProject`

The `isDisabled` module determines whether the donation-reminder should be shown.
It uses information saved at [`./env/`](/src/donation-reminder/readme.md).

The `getDonationReminderLog` module determines how the donation-reminder looks like.

The `collectLsosProject` is about awaiting `printDonationReminder()` calls:
instead of calling one `console.log` per `printDonationReminder()` call, we use a single `console.log`.
For that we use the `collectLsosProject` module that basically blocks execution until all `printDonationReminder()` calls are run.

That's it.
