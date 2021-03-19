const vscode = require("vscode");
const cleanupFields = ["form", "name", "validate"];
const inputToSpring = (inputStr) => {
  return inputStr
    .replace(/type (\w+) /g, "type $1 = ")
    .replace(/: Int!?/g, ": number,")
    .replace(/String!?/g, "string,")
    .replace(/: ID!?/g, ": string,")
    .replace(/Time!?/g, "Date,")
    .replace(/Boolean!?/g, "bool,")
    .replace(/: \[(\w+)!?\]/g, ": $1[]")
    .replace(/!$/gm, ","); // remaining non recogniced types
};
const graphqlToFlow = async () => {
  // s. https://code.visualstudio.com/api/references/vscode-api
  const editor = vscode.window.activeTextEditor;
  const selection = editor.selection;
  console.log(selection);
  editor.edit((builder) => {
    builder.replace(
      selection,
      inputToSpring(editor.document.getText(selection))
    );
  });

  vscode.window.showInformationMessage(`Ran the command`);
};

module.exports = graphqlToFlow;
