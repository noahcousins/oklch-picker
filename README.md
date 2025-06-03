# OKLCH Color Picker for VS Code

A VS Code extension that provides color picker support for OKLCH color values, similar to the built-in support for hex and rgba colors.

## Features

- **Color Detection**: Automatically detects OKLCH color values in CSS, SCSS, Less, and Stylus files
- **Visual Color Picker**: Click on any OKLCH color to open VS Code's built-in color picker
- **Accurate Conversion**: High-quality conversion between OKLCH and RGB color spaces
- **Format Preservation**: Maintains OKLCH format when editing colors

## Supported Formats

The extension recognizes OKLCH colors in the following formats:

- `oklch(0.7 0.15 180)`
- `oklch(70% 0.15 180deg)`
- `oklch(0.7 0.15 180 / 0.8)`
- `oklch(70% 0.15 180deg / 80%)`

## Installation

### From Source

1. Clone this repository
2. Install dependencies: `pnpm install`
3. Compile the extension: `pnpm run compile`
4. Press `F5` to run the extension in a new Extension Development Host window

### For Development

1. Open the project in VS Code
2. Press `F5` to run the extension in a new window
3. Open a CSS file with OKLCH colors to test

## Usage

1. Open a CSS file containing OKLCH color values
2. Look for small colored squares next to OKLCH color declarations
3. Click on the colored square to open the color picker
4. Choose a new color and the OKLCH value will be automatically updated

## Example

```css
:root {
  --primary: oklch(0.7 0.15 180);
  --secondary: oklch(0.5 0.2 45);
  --accent: oklch(0.8 0.1 300 / 0.9);
}
```

## About OKLCH

OKLCH is a perceptually uniform color space that offers several advantages:

- **Perceptual uniformity**: Equal changes in values result in equal perceived changes
- **Intuitive**: Lightness, chroma, and hue are separate, predictable parameters
- **Wide gamut**: Supports colors outside the sRGB color space
- **Future-proof**: Part of CSS Color Module Level 4

## Development

### Building

```bash
pnpm run compile
```

### Watching for changes

```bash
pnpm run watch
```

### Testing

Open a new VS Code window with the extension loaded:

```bash
# Press F5 in VS Code or run:
code --extensionDevelopmentPath=.
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Changelog

### 0.0.1

- Initial release
- Basic OKLCH color detection and conversion
- Color picker integration
