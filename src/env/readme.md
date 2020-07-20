The `env/` directory holds constant that are determined and set by the postinstall Node.js script and consumed by the browser.

The `env/` directory is essentially about bridging information from Node.js to the browser.

For example, the donation-reminder browser-side business logic needs to know whether the user has ran `lsos remove` and opted into removing the donation-reminder; we need to pass the user config `~/.lsos.json` over to the browser.
