The `env/` directory holds constants set by the postinstall script and consumed by the browser-side code;
it essentially bridges information from the postinstall step to the browser-side code.

For example, the donation-reminder browser-side business logic needs to know whether the user ran `lsos remove`;
for that, the postinstall script copies the user config content from `~/.lsos.json` to `env/userConfig.ts`,
while the browser-side code imports `env/userConfig.ts`.
