import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "detab--don-t-outdent-" is now active!');

	let disposableShiftTab = vscode.commands.registerCommand('extension.shiftTab', () => {
        handleShiftTab();
    });

	context.subscriptions.push(disposableShiftTab);
}

function handleShiftTab() {
    const editorConfig = vscode.workspace.getConfiguration('editor');
    const tabSize = editorConfig.get<number>('tabSize', 4);
    const insertSpaces = editorConfig.get<boolean>('insertSpaces', true);

    console.log('handleShiftTab function called');

    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        const originalPosition = selection.start;

        if (insertSpaces) {
            const lineText = document.lineAt(originalPosition.line).text;
            let spacesToRemove = 0;
            for (let i = originalPosition.character - 1; i >= 0; i--) {
                if (lineText[i] === ' ') {
                    spacesToRemove++;
                    if (spacesToRemove === tabSize) {
                        break;
                    }
                } else {
                    break;
                }
            }
            const rangeToRemove = new vscode.Range(originalPosition.translate(0, -spacesToRemove), originalPosition);
            editor.edit(editBuilder => {
                editBuilder.delete(rangeToRemove);
            });
        } else {
            const rangeToRemove = new vscode.Range(originalPosition.translate(0, -1), originalPosition);
            editor.edit(editBuilder => {
                editBuilder.delete(rangeToRemove);
            });
        }
    }
}

export function deactivate() {}