# Lsos Donation Reminder

The Lsos Donation Reminder enables you to kindly remind companies to donate.

- [Gettings Started](#getting-started)
- [Questions & Discussions](#questions--discussions)
- [FAQ](#faq)


## Getting Started

~~~js
// npm install `@lsos/donationReminder`:
import { printDonationReminder } from "@lsos/donation-reminder";

printDonationReminder({
  // Npm package name
  npmName: "my-open-source-project",

  //"Human-readable project name",
  projectName: "My Open Source Project",

  // Text that will be shown to users
  donationText: "Hello :wave:, I'm Alice, I'm looking for a gold sponsor, thanks :heart:",

  // Show the donation-reminder only to users working on projects with >=5 authors
  minNumberOfAuthors: 5,
});
~~~

Your users can remove the donation-reminder by running `npx lsos remove`/`yarn lsos remove`.

When setting the option `minNumberOfAuthors` to `n`,
the donation-reminder is shown only to users working in a Git repository that has `n` or more Git authors.

You can use any [Twemoji](https://github.com/twitter/twemoji) emoji.
(These are the emojis you see on Twitter and Discord.)
You can use [Discord](https://discord.com/) to find emoji codes,
for example `:smile:` or `:heart:`.


## Questions & Discussions

For any questions
[open a ticket](https://github.com/Lsos/donation-reminder/issues/new)
on this repo for disucssions about donation-reminder,
and
[open a ticket on github.com/Lsos/converse](https://github.com/Lsos/converse/issues/new)
for discussions about the Lsos and open source financing in general.
We enjoy talking about anything OSS :).


## FAQ

### [End-user] How do I make sure the donation-reminder is never shown in tests, statging and production?

Make sure that `window.process.env.NODE_ENV==='production'` (or `'stating'`/`'test'`).

Most frameworks (CRA, Gatsby, ...) do that for you already.

### [OSS-project] I don't see any donation-reminder, where is it?

The donation-reminder currently only works in Chromium-based browsers.
If you use Firefox, you won't see any donation-reminder.

### [OSS-project] Does it work only for browser-side open source projects?

Yes, the donation-reminder can only be shown in the developer console of the browser.

### [OSS-project] Can I show the donation-reminder to all my users?

Yes, just set `minNumberOfAuthors: 0`.

But note that the significant donations usually come from companies; it usually isn't worth it to show the donation-reminder to a user that works on a hobby single-author project.

You may want money from companies, not hobbyists.

### How does it work?

If you're curious about what exactly the `@lsos/donation-reminder` code does, check out the source code overview at [/src/readme.md](/src/).
