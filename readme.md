# Lsos Donation Reminder

The Lsos Donation Reminder allows open source projects to kindly remind companies to donate.

<br/>

<p align="center">
  <img src="/donation-reminder.png" height="175"/>
</p>

<br/>

[Gettings Started](#getting-started)
<br/>
[Questions & Discussions](#questions--discussions)
<br/>
[FAQ](#faq)

## Getting Started

~~~js
import { printDonationReminder } from "@lsos/donation-reminder";// npm add @lsos/donation-reminder

// Show a donation-reminder in the developer console of the browser.
printDonationReminder({
  // Npm package name
  npmName: "my-open-source-project",
  // Human-readable project name
  projectName: "My Open Source Project",
  // Text that will be shown to users
  donationText: "Hi :smile:, I'm Alice, I'm looking for a gold sponsor, thanks! :heart:",
  // Show the donation-reminder only to users working on projects with >=5 authors
  minNumberOfAuthors: 5,
});
~~~

Your users can remove the donation-reminder by running `npx lsos remove`/`yarn lsos remove`.

When setting the option `minNumberOfAuthors` to `n`,
the donation-reminder is shown only to users working in a Git repository that has `n` or more Git authors.

You can use any emoji of the [Twemoji](https://github.com/twitter/twemoji) catalog.
(These are the emojis you see on Twitter and Discord.)
You can use [Discord](https://discord.com/) to find emoji codes
such as `:smile:` or `:heart:`.


## Questions & Discussions

For any questions about the donation-reminder
[open a ticket here](https://github.com/Lsos/donation-reminder/issues/new),
and
[open a ticket on github.com/Lsos/converse](https://github.com/Lsos/converse/issues/new)
for broad discussions about open source financing.
We enjoy talking about anything OSS :).


## FAQ

### [End-user] How do I make sure the donation-reminder is never shown in tests, staging and production?

Make sure that `window.process?.env && !['dev', 'development'].includes(window.process.env.NODE_ENV)`.
For example, if `['production', 'staging', 'test'].includes(window.process.env.NODE_ENV)` then the donation-reminder will not be shown.

Most frameworks (CRA, Gatsby, ...) correctly set `window.process.env.NODE_ENV` and you don't have to do anything.

### [OSS-project] I don't see any donation-reminder, where is it?

The donation-reminder currently only works in Chromium-based browsers.
If you use Firefox, you won't see any donation-reminder.

### [OSS-project] Does it work only for browser-side open source projects?

Yes, the donation-reminder is only shown in the developer console of the browser.

### [OSS-project] Can I show the donation-reminder to all my users?

Yes, just set `minNumberOfAuthors: 0`.

Note that most significant donations come from companies.
It usually isn't worth it to show the donation-reminder to a user that works on a hobby single-author project &mdash;
you may want money from companies, not hobbyists.

### How does it work?

If you're curious about what exactly the `@lsos/donation-reminder` code does, check out the source code explainer at [/src/readme.md](/src/#readme).
