export { assert };

function assert(bool, ...msgs) {
  if (bool) {
    return;
  }
  throw new Error("[assertion-fail] " + msgs.join(""));
}
