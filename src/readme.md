# Source Code Explainer

The `@lsos/donation-reminder` package has no dependencies and all its code is included in this `src/` folder.

The code revolves around following functionalities:
 1. Show the donation-reminder the browser console.
 2. Only show the donation-reminder if the user has not ran `npx lsos remove` / `yarn lsos remove`.
 3. Only show the donation-reminder if the user's git repository has at least `minNumberOfAuthors` authors.
 4. Only show the donation-reminder in development on chromium-based broswers.

That's it; every single line of code has as sole purpose the functionality listed above.

### CLI

To achieve `2.` and `3.`, the `@lsos/donation-reminder` implements the `lsos` CLI that when run

### Postinstall

To achieve `2.` and `3.`, the `@lsos/donation-reminder` package runs a `postinstall` script that essentially does two things:
 - Find the user config `~/lsos.json`. (
 - Find the number of authors of the user's git repository.

That's all


### Browser code

The browser code then 

Note that there is also. This is because we bundle all. If


