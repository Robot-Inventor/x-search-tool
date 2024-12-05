// eslint-disable-next-line import-x/no-unassigned-import
import "../css/style.css";
// eslint-disable-next-line import-x/no-unassigned-import
import "./components/command-group";

const commandEditor = document.querySelector("#command-editor");
if (!commandEditor) {
    throw new Error("No command editor found");
}

const commandExecutor = document.querySelector("#command-executor");
if (!commandExecutor) {
    throw new Error("No command executor found");
}

const commandResult = document.querySelector("#command-result");
if (!commandResult) {
    throw new Error("No command result found");
}

const topLevelCommandGroup = document.createElement("command-group");
topLevelCommandGroup.isTopLevel = true;

commandEditor.appendChild(topLevelCommandGroup);

commandExecutor.addEventListener("click", () => {
    const command = topLevelCommandGroup.getCommand();
    commandResult.textContent = command;
});
