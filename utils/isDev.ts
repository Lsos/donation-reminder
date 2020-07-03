export { isDev };

function isDev() {
  return process.cwd().startsWith("/home/romu");
}
