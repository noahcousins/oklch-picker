import * as vscode from "vscode";
import { OklchColorProvider } from "./oklchColorProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("OKLCH Color Picker extension is now active!");

  // Register the color provider for CSS-like languages
  const colorProvider = new OklchColorProvider();

  const cssSelector = { scheme: "file", language: "css" };
  const scssSelector = { scheme: "file", language: "scss" };
  const lessSelector = { scheme: "file", language: "less" };
  const stylusSelector = { scheme: "file", language: "stylus" };

  context.subscriptions.push(
    vscode.languages.registerColorProvider(cssSelector, colorProvider),
    vscode.languages.registerColorProvider(scssSelector, colorProvider),
    vscode.languages.registerColorProvider(lessSelector, colorProvider),
    vscode.languages.registerColorProvider(stylusSelector, colorProvider)
  );
}

export function deactivate() {}
