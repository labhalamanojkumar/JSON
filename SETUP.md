# JSON Formatter Pro - Installation & Setup Guide

## 🚀 Quick Start

Follow these steps to get your JSON Formatter website up and running:

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Step 1: Install Dependencies

```bash
cd "/Users/manojkumar/Desktop/Work flow/JSON Formatter"
npm install
```

> Note: After this change you'll need to install the MongoDB driver as a new dependency (the repo was updated to use MongoDB). If you re-run `npm install` it will pull the `mongodb` package automatically.

### Step 2: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Step 3: Build for Production

```bash
npm run build
npm start
```

## 📋 Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🎨 Features Implemented

### ✅ Core Features
- [x] JSON Formatter & Beautifier with customizable indentation
- [x] Real-time JSON Validator with error detection
- [x] JSON Minifier for compression
- [x] Interactive Tree View Explorer
- [x] JSON Comparison Tool (side-by-side diff)
- [x] JSON to CSV/XML/YAML Converter
- [x] File Upload & Download (up to 10MB)
- [x] Copy to Clipboard functionality
- [x] Auto-save in localStorage

### ✅ UI/UX Features
- [x] Dark/Light Mode with preference persistence
- [x] Fully Responsive Design (mobile-friendly)
- [x] Keyboard Shortcuts (Ctrl+Enter, Ctrl+C)
- [x] Drag & Drop file upload
- [x] Image URL preview on hover
- [x] Syntax highlighting
- [x] Clean, minimal UI

### ✅ SEO Optimization
- [x] Server-side rendering (SSR) with Next.js 14
- [x] Optimized meta tags and Open Graph
- [x] JSON-LD schema markup for FAQs
- [x] Dynamic sitemap.xml
- [x] Robots.txt configuration
- [x] Semantic HTML with ARIA roles
- [x] Keyword-optimized page titles and descriptions
- [x] Internal linking structure

### ✅ Dedicated Pages
- [x] Homepage (/) - Main JSON Formatter tool
- [x] /json-formatter - Dedicated formatter page
- [x] /json-validator - Validation tool page
- [x] /json-minifier - Minification tool page
- [x] /json-converter - Format conversion page
- [x] /json-compare - Comparison tool page
- [x] /blog - Blog section with SEO articles

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | React Icons |
| JSON Processing | Native JSON.parse(), jsonlint-mod |
| Converters | js-yaml, xml-js, json2csv |
| State Management | React Hooks, localStorage |

## 📁 Project Structure

```
JSON Formatter/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles
│   ├── json-formatter/      # Formatter tool
│   ├── json-validator/      # Validator tool
│   ├── json-minifier/       # Minifier tool
│   ├── json-converter/      # Converter tool
│   ├── json-compare/        # Comparison tool
│   ├── blog/                # Blog pages
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt
├── components/              # React components
│   ├── ThemeProvider.tsx   # Theme management
│   ├── Header.tsx          # Navigation
│   ├── Footer.tsx          # Footer links
│   ├── JsonFormatter.tsx   # Main formatter
│   ├── JsonEditor.tsx      # Code editor
│   ├── JsonTreeView.tsx    # Tree explorer
│   ├── JsonComparison.tsx  # Diff tool
│   ├── JsonConverter.tsx   # Format converter
│   ├── FAQSection.tsx      # FAQ with schema
│   └── FeaturesSection.tsx # Features grid
├── public/                  # Static files
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind config
└── next.config.js          # Next.js config
```

## 🎯 Key Features Explained

### 1. JSON Formatter
- Accepts raw/minified JSON input
- Configurable indentation (2, 3, or 4 spaces)
- Syntax highlighting for better readability
- Copy and download formatted output

### 2. JSON Validator
- Real-time syntax error detection
- Detailed error messages with line/column numbers
- Highlights invalid JSON structure
- Suggests common fixes

### 3. Minifier & Prettify
- Toggle between compact and readable formats
- Reduces file size by removing whitespace
- Optimizes JSON for APIs and storage

### 4. Tree View Explorer
- Interactive expand/collapse nodes
- Search functionality for keys/values
- Image URL preview on hover
- Navigate complex JSON structures easily

### 5. JSON Comparison
- Side-by-side diff view
- Highlights additions, deletions, modifications
- Type change detection
- Perfect for debugging API changes

### 6. Format Converter
- JSON to CSV (for Excel/Google Sheets)
- JSON to XML (for legacy systems)
- JSON to YAML (for config files)
- Download converted output

### 7. Dark/Light Mode
- System preference detection
- Manual toggle with persistence
- Smooth transitions
- Eye-friendly for long coding sessions

## 🔑 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Format JSON |
| `Ctrl/Cmd + C` | Copy formatted output |

## 📊 SEO Features

### Meta Tags
- Unique title and description for each page
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs

### Structured Data
- FAQPage JSON-LD schema
- Proper heading hierarchy (H1, H2, H3)
- Semantic HTML elements

### Performance
- Server-side rendering (SSR)
- Optimized Core Web Vitals
- Fast JSON processing
- Lazy loading where applicable

## 🔒 Privacy & Security
- All processing happens client-side
- No data sent to servers
- localStorage for auto-save
- No tracking or analytics by default

## 🌐 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS/Android)

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📦 MongoDB (optional, recommended for admin data)

This project can persist admin data (ad providers, analytics) in MongoDB instead of the included file-based JSON storage. To enable MongoDB:

1. Create a MongoDB database (MongoDB Atlas or your own server).
2. Obtain a connection URI (example: `mongodb+srv://user:password@cluster0.abcd.mongodb.net/jsonformatter?retryWrites=true&w=majority`).
3. In your local development root create a `.env.local` file with:

```bash
MONGODB_URI="your-mongodb-connection-uri"
# optional: override default DB name from the URI
MONGODB_DB="jsonformatter"
```

4. Restart the dev server:

```bash
npm run dev
```

Notes:
- The admin APIs (`/api/admin/*`) will use the `MONGODB_URI` if provided. If it is not set, admin endpoints that read/write data will fail.
- For production, set `MONGODB_URI` (and `MONGODB_DB` if needed) in your deployment environment variables.
- You must also set `ADMIN_TOKEN` for protected admin write operations (see earlier in this doc).


### Other Platforms
The app can be deployed to:
- Netlify
- AWS Amplify
- Google Cloud
- Any Node.js hosting

## 📝 Customization

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#your-color',
    // ...
  }
}
```

### Add New Features
1. Create component in `/components`
2. Import in relevant page
3. Update navigation in `Header.tsx`

### Modify SEO
Edit metadata in each page's `page.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Title',
  description: 'Your Description',
  // ...
}
```

## 🐛 Troubleshooting

### Dependencies not installing?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port already in use?
```bash
# Use different port
npm run dev -- -p 3001
```

### Build errors?
```bash
npm run lint
npm run build
```

## 📧 Support

For issues or questions:
1. Check the README.md
2. Review the code comments
3. Open an issue on GitHub

## 🎉 You're All Set!

Your JSON Formatter website is ready to use. Visit `http://localhost:3000` to start formatting JSON!

---

**Next Steps:**
1. Customize branding and colors
2. Add Google Analytics (optional)
3. Deploy to production
4. Set up custom domain
5. Monitor performance metrics
