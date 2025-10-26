# JSON Formatter Pro

A modern, feature-rich JSON formatting, validation, and conversion tool built with Next.js 14, React, and TypeScript.

## 🚀 Features

### Core Features
- **JSON Formatter & Beautifier** - Format minified JSON with customizable indentation (2, 3, or 4 spaces)
- **JSON Validator** - Real-time syntax validation with detailed error messages
- **JSON Minifier** - Compress JSON by removing whitespace
- **Tree View Explorer** - Interactive collapsible tree structure with search
- **JSON Comparison** - Side-by-side diff tool for comparing JSON files
- **Format Converter** - Convert JSON to CSV, XML, or YAML

### Advanced Features
- **File Upload & Download** - Support for files up to 10MB
- **Auto-Save** - Automatically saves your work in browser localStorage
- **Dark/Light Mode** - Eye-friendly themes with user preference persistence
- **Keyboard Shortcuts** - Fast workflow with Ctrl+Enter to format, Ctrl+C to copy
- **Image Preview** - Hover over image URLs to see inline previews
- **Mobile Responsive** - Optimized for all screen sizes
- **SEO Optimized** - Server-side rendering with proper meta tags and schema markup

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/json-formatter-pro.git
cd json-formatter-pro

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** React Icons
- **JSON Processing:** Native JSON.parse(), jsonlint-mod
- **Conversion Libraries:** js-yaml, xml-js, json2csv

## 📁 Project Structure

```
JSON Formatter/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles
│   ├── json-formatter/      # Formatter tool page
│   ├── json-validator/      # Validator tool page
│   ├── json-minifier/       # Minifier tool page
│   ├── json-converter/      # Converter tool page
│   ├── json-compare/        # Comparison tool page
│   ├── blog/                # Blog section
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt configuration
├── components/
│   ├── ThemeProvider.tsx   # Dark/Light theme provider
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer
│   ├── JsonFormatter.tsx   # Main formatter component
│   ├── JsonEditor.tsx      # Code editor component
│   ├── JsonTreeView.tsx    # Tree view explorer
│   ├── JsonComparison.tsx  # Diff comparison tool
│   ├── JsonConverter.tsx   # Format converter
│   ├── FAQSection.tsx      # FAQ with schema markup
│   └── FeaturesSection.tsx # Features showcase
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🎨 Key Features Implementation

### JSON Formatting
- Configurable indentation (2, 3, or 4 spaces)
- Syntax highlighting for keys, strings, numbers, booleans
- Real-time validation with line/column error reporting

### Theme Support
- System preference detection
- localStorage persistence
- Smooth transitions between themes

### SEO Optimization
- Server-side rendering (SSR)
- Proper meta tags and Open Graph
- JSON-LD schema markup for FAQs
- Dynamic sitemap and robots.txt
- Semantic HTML structure

## 🚦 Usage

1. **Format JSON**: Paste your JSON into the input box and click "Format/Beautify"
2. **Validate**: Errors are shown instantly with line numbers
3. **Minify**: Click "Minify" to compress your JSON
4. **Convert**: Switch to "Convert" tab to transform JSON to CSV, XML, or YAML
5. **Compare**: Use "Compare" tab to diff two JSON files
6. **Tree View**: Switch to "Tree View" for interactive exploration

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Format JSON
- `Ctrl/Cmd + C` - Copy formatted output

## 🔒 Privacy & Security

All processing happens entirely in your browser using JavaScript. Your JSON data never leaves your computer or gets sent to any server.

## 📈 Performance

- Optimized with Next.js SSR and SWC compiler
- Lazy loading for optimal performance
- Core Web Vitals optimized
- Fast JSON processing with native methods

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please visit our website or open an issue on GitHub.

---

Built with ❤️ using Next.js and React
