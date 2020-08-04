# Lsos Donation Reminder

Show a (removable) donation-reminder in the browser developer console,
to kindly remind (large) companies to donate.

<p align="center">
  <b><a href="https://lsos.org/reminder/demo" target="_blank">Live Demo</a></b>
</p>

<p align="center">
  <img src="/donation-reminder.png" height="175"/>
</p>

<br/>

[Getting Started](#getting-started)
<br/>
[Questions & Discussions](#questions--discussions)
<br/>
[FAQ](#faq)

<br/>

## Getting Started

~~~js
import { printDonationReminder } from "@lsos/donation-reminder"; // npm i @lsos/donation-reminder

// Show a donation-reminder in the browser developer console
printDonationReminder({
  // Npm package name
  npmName: "my-open-source-project",
  // Human-readable project name
  projectName: "My Open Source Project",
  // Shown text
  donationText: "Hi :smile:, I'm Alice, I'm looking for a gold sponsor, thanks! :heart:",
  // Show the donation-reminder only to users working on projects with >=5 authors
  minNumberOfAuthors: 5,
});
~~~

Users can remove the donation-reminder by running `npx lsos remove`/`yarn lsos remove`.

When setting the option `minNumberOfAuthors` to `n`,
the donation-reminder is only shown to users working in a Git repository that has `n` or more Git authors.

You can use any emoji of the [Twemoji](https://github.com/twitter/twemoji) catalog.
(These are the emojis you see on Twitter and Discord.)
You can use [Discord](https://discord.com/) to find emoji codes
such as `:smile:` and `:heart:`.

<br/>

## Questions & Discussions

For any questions about the donation-reminder
[open a ticket here](https://github.com/Lsos/donation-reminder/issues/new),
and
for broad discussions about open source financing
[open a ticket on github.com/Lsos/converse](https://github.com/Lsos/converse/issues/new).

<br/>

## FAQ

### [End-user] How can I remove the donation-reminder?

Run `npx lsos remove` / `yarn lsos remove` in your project directory.

### [End-user] How do I make sure the donation-reminder is not shown in tests, staging and production?

The donation-reminder is not shown if:
- `window.location.hostname !== 'localhost'`, or if
- `window.process.env.NODE_ENV && !['dev', 'development'].includes(window.process.env.NODE_ENV)`.

For example,
if `window.location.hostname === 'https://example.com'` or
if `['production', 'staging', 'test'].includes(window.process.env.NODE_ENV)` then the donation-reminder is not shown.

### [OSS-project] I don't see any donation-reminder, where is it?

The donation-reminder is currently only shown on Chromium-based browsers.
If you use Firefox, you won't see any donation-reminder.

Also note that the `minNumberOfAuthors` parameter may hide the donation-reminder from you.

### [OSS-project] Does it work only for browser libraries?

Yes, the donation-reminder is only meant to be shown in the browser developer console.

### [OSS-project] Can I show the donation-reminder to all my users?

Yes, just set `minNumberOfAuthors: 0`.

Note that significant donations mostly come from companies.
It usually isn't worth it to show a donation-reminder to a user working on a single-author hobby project &mdash;
you may want money from companies, not hobbyists.

### How does it work?

If you're curious about what the code does in detail, check out the source code explainer at [/src/](/src/).
