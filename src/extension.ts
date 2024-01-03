import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "detab--don-t-outdent-" is now active!');

    let disposableShiftTab = vscode.commands.registerCommand('extension.shiftTab', () => {
        handleShiftTab();
    });

    context.subscriptions.push(disposableShiftTab);
}

function handleShiftTab() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No active editor
    }

    editor.edit(editBuilder => {
        editor.selections.forEach(selection => {
            if (selection.isEmpty) {
                // Handle single cursor movement
                const position = selection.active;
                modifyIndentationAtPosition(position, editBuilder);
            } else {
                // Handle selection modification
                for (let i = selection.start.line; i <= selection.end.line; i++) {
                    const position = new vscode.Position(i, selection.start.character);
                    modifyIndentationAtPosition(position, editBuilder);
                }
            }
        });
    });
}

function modifyIndentationAtPosition(position: vscode.Position, editBuilder: vscode.TextEditorEdit) {
    const editorConfig = vscode.workspace.getConfiguration('editor');
    const tabSize = editorConfig.get<number>('tabSize', 4);
    const insertSpaces = editorConfig.get<boolean>('insertSpaces', true);

    const lineText = vscode.window.activeTextEditor?.document.lineAt(position.line).text;
    if (!lineText) {
        return;
    }

    if (insertSpaces) {
        let spacesToRemove = 0;
        for (let i = position.character - 1; i >= 0; i--) {
            if (lineText[i] === ' ') {
                spacesToRemove++;
                if (spacesToRemove === tabSize) {
                    break;
                }
            } else {
                break;
            }
        }
        const rangeToRemove = new vscode.Range(position.translate(0, -spacesToRemove), position);
        editBuilder.delete(rangeToRemove);
    } else {
        const rangeToRemove = new vscode.Range(position.translate(0, -1), position);
        editBuilder.delete(rangeToRemove);
    }
}

export function deactivate() {}
