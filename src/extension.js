const vscode = require("vscode");
const graphqlToFlow = require("./graphql-to-flow");

const updateSelection = (updater) => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const { document, selection } = editor;
  const text = document.getText(selection);
  editor.edit((editBuilder) => editBuilder.replace(selection, updater(text)));
};

const parse = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return {};
  }
};

const register = ([command, handler]) =>
  vscode.commands.registerCommand(command, handler);

/**
 * this method is called when your extension is activated
 * your extension is activated the very first time the command is executed
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // vscode.window.showInformationMessage('Danielo is here to help....');

  const convertToArrayString = () => {
    updateSelection((text) => JSON.stringify(text.split("\n"), null, 2));
  };
  const saveRegex = async () => {
    const regex = await vscode.window.showInputBox({
      prompt: "Input the regular expression",
    });
    const name = await vscode.window.showInputBox({
      prompt: "Give the regex a name",
    });
    if (!regex || !name) {
      vscode.window.showInformationMessage("Operation cancelled");
      return;
    }
    const store = parse(context.globalState.get("stored-regex"));
    store[name] = regex;
    context.globalState.update("stored-regex", JSON.stringify(store));
    vscode.window.showInformationMessage("Regex saved");
  };

  const loadRegex = async () => {
    const store = parse(context.globalState.get("stored-regex"));
    const options = Object.keys(store);
    const selection = await vscode.window.showQuickPick(options);
    const message = "Here is your regex: " + (store[selection] || "Not found");
    vscode.window.showInformationMessage(message);
  };

  const commands = [
    ["danieloTools.convertToArrayString", convertToArrayString],
    ["danieloTools.saveRegex", saveRegex],
    ["danieloTools.loadRegex", loadRegex],
    ["danieloTools.graphql-to-flow", graphqlToFlow],
  ].map(register);

  context.subscriptions.push(...commands);
}

module.exports = {
  activate,
};
