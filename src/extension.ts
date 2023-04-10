// src/extension.ts

import * as vscode from 'vscode';
import { organizeHeaders } from './headerOrganizer';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('cpp-header-organizer.organize', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      if (document.languageId === 'cpp') {
        const content = document.getText();
		const currentFile = document.fileName.replace(/^.*[\\\/]/, '');
        const organizedContent = organizeHeaders(content, currentFile);
        const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(content.length));
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, fullRange, organizedContent);
        vscode.workspace.applyEdit(edit);
      } else {
        vscode.window.showErrorMessage('Not a C++ file');
      }
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
