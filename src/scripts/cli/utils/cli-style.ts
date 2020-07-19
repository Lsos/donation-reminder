const ANSI_CODES = getAnsiCodes();

export const symbolSuccess = "[" + colorSuccess("✔") + "] ";
export const symbolConfirmation = "[" + colorConfirmation("ℹ") + "] ";
export { fgGray };
export { fgGreen };

function colorSuccess(str: string): string {
  return ANSI_CODES.BOLD + ANSI_CODES.GREEN + str + ANSI_CODES._RESET;
}

function colorConfirmation(str: string): string {
  return ANSI_CODES.BOLD + ANSI_CODES.BLUE + str + ANSI_CODES._RESET;
}

function fgGray(str: string): string {
  return ANSI_CODES.DIM + str + ANSI_CODES._RESET;
}

function fgGreen(str: string) {
  return ANSI_CODES.GREEN + str + ANSI_CODES._RESET;
}

function getAnsiCodes() {
  return {
    GREEN: "\x1b[32m",
    BLUE: "\x1b[34m",

    BOLD: "\x1b[1m",
    DIM: "\x1b[2m",

    _RESET: "\x1b[0m",
  };
}
