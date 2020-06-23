type Text = string & { _brand?: "Text" };
type Style = string[] & { _brand?: "Style" };

type LogFragment = {
  text: Text;
  style: Style;
};

export { Style };
export { LogFragment };
