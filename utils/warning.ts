import assert from "assert";

export { warning };

function warning(bool, msg?) {
    if (!isDev()) {
        return;
    }
    assert(bool, msg);
}

function isDev() {
    return process.cwd().startsWith("/home/romu");
}
