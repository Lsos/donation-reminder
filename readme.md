# @lsos/donation-reminder

The `@lsos/donation-reminder` npm package enables you to kindly remind (large) companies to donate.

The following is shown to to your users that work on a project that has more than `x` auhtors.

IMG

Your users can remove the donation-reminder by running `npx lsos remove`/`yarn lsos remove`.

- [Gettings Started]()
- [Questions & Discussions]()
- [FAQ]()

## Getting Started

1. Install `@lsos/donationReminder`:
2. Setup
   ~~~json
   {
     name: "my-open-source-project",
     version: "1.0.0",
     "lsos": {
       "projectName": "My Open Source Project",
       "donationReminder": {
         "minNumberOfAuthors": 5,
         "text": "Hello :wave:, I'm Alice, I'm looking for a gold sponsor, appreciate it :heart:"
       }
     }
   }
   ~~~

3. Call `printDonationReminder`:

We use [Twemoji](https://github.com/twitter/twemoji) which is are the emojis used by Discord and Twitter.
Use Discord to find the emoji codes.

~~~js
import { printDonationReminder } from "@lsos/donation-reminder";

printDonationReminder(

~~~

## Questions & Discussions

For any questions
[open a ticket]() on this repo for disucssions about donation-reminder,
and [open a ticket on github.com/Lsos/converse]() for discussions about the Lsos and open source financing in general.
We enjoy talking about anything :)

## FAQ

### [End-user] How do I make sure the donation-reminder is never shown in tests, statging and production?

Make sure that `window.process.env.NODE_ENV==='production'` (or `'stating'`/`'test'`).

Most frameworks (CRA, Gatsby, ...) do that for you already.

### [OSS-project] Does it work only for browser-side open source projects?

Yes, the donation-reminder can only be shown in the browswer developer console.

### [OSS-project] Can I show the donation-reminder to all my users?

Yes, just set `minNumberOfAuthors: 0`.

But note that the significant donations usually come from companies; it usually isn't worth it to show the donation-reminder to a user that works on a hobby single-author project.

You may want money from companies, not hobbyists.

### How does it work?

If you're curious about what exactly the `@lsos/donation-reminder` code does, check out the source code overview at [/src/readme.md](/src/).
