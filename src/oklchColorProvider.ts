import * as vscode from "vscode";
import {
  parseOklch,
  oklchToRgb,
  rgbToOklch,
  formatOklch,
  OKLCH_REGEX,
  OklchColor,
  RgbColor,
} from "./oklchUtils";

export class OklchColorProvider implements vscode.DocumentColorProvider {
  /**
   * Provide colors found in the document
   */
  public provideDocumentColors(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.ColorInformation[]> {
    const colors: vscode.ColorInformation[] = [];
    const text = document.getText();

    // Reset regex lastIndex to ensure fresh search
    OKLCH_REGEX.lastIndex = 0;

    let match;
    while ((match = OKLCH_REGEX.exec(text)) !== null) {
      const oklchString = match[0];
      const oklchColor = parseOklch(oklchString);

      if (oklchColor) {
        const rgbColor = oklchToRgb(oklchColor);
        const vscodeColor = new vscode.Color(
          rgbColor.r / 255,
          rgbColor.g / 255,
          rgbColor.b / 255,
          rgbColor.alpha || 1
        );

        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPos, endPos);

        colors.push(new vscode.ColorInformation(range, vscodeColor));
      }
    }

    return colors;
  }

  /**
   * Provide color presentations (how the color should be formatted when edited)
   */
  public provideColorPresentations(
    color: vscode.Color,
    context: { document: vscode.TextDocument; range: vscode.Range },
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.ColorPresentation[]> {
    const rgbColor: RgbColor = {
      r: Math.round(color.red * 255),
      g: Math.round(color.green * 255),
      b: Math.round(color.blue * 255),
      alpha: color.alpha,
    };

    const oklchColor = rgbToOklch(rgbColor);
    const oklchString = formatOklch(oklchColor);

    const presentation = new vscode.ColorPresentation(oklchString);
    presentation.textEdit = new vscode.TextEdit(context.range, oklchString);

    return [presentation];
  }
}
