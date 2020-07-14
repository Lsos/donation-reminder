import assert from "assert";

export { styleConsoleLog };

function styleConsoleLog(strings = [], { defaultStyle = [] } = {}) {
  let str = "";
  const styles = [];
  strings.forEach((spec) => {
    if (spec.constructor === String) {
      spec = { text: spec };
    }
    spec.style = [...defaultStyle, ...(spec.style || [])];

    let wordsSpec = [spec];
    if (spec.enableLineBreak) {
      const wordsText = spec.text.split(" ");
      wordsSpec = wordsText.map((wordText, nthWord) => {
        const isFirstWord = nthWord !== 0;
        const isLastWord = nthWord === wordsText.length - 1;

        wordText += isLastWord ? "" : " ";

        const wordStyle = spec.style.filter((style) => {
          assert(!style.includes(";"));
          assert(/[^[a-z]/.test(style));
          if (style.startsWith("padding-left") && isFirstWord) {
            return false;
          }
          if (style.startsWith("padding-right") && !isLastWord) {
            return false;
          }
          assert(!style.startsWith("padding:"));
          return true;
        });

        const wordSpec = {
          text: wordText,
          style: wordStyle,
        };
        return wordSpec;
      });
    }
    wordsSpec.forEach((wordSpec) => {
      str += "%c" + wordSpec.text;
      styles.push(wordSpec.style.join(";"));
    });
  });
  return [str, ...styles];
}
