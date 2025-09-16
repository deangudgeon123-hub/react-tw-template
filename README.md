# React Tailwind Template

A modern React template built with TypeScript, Tailwind CSS, and Web3 integration. This template provides a solid foundation for building responsive web applications with built-in support for blockchain interactions, internationalization, and a comprehensive UI component library.

## ✨ Features

- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Vite** for fast development and building
- **Web3 Integration** with Wagmi and Reown AppKit
- **Multi-chain Support** (Bitcoin, Solana, Ethereum)
- **UI Components** based on Radix UI
- **Internationalization** (i18n) with react-i18next
- **State Management** with Zustand
- **Form Handling** with React Hook Form + Zod validation
- **Routing** with React Router DOM
- **Charts** with Recharts
- **Drag & Drop** with dnd-kit
- **Code Quality** tools (ESLint, Prettier, TypeScript)
- **Git Hooks** with Lefthook
- **Docker** support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd react-tw-template
```

2. Install dependencies
```bash
pnpm install
```

3. Copy environment variables
```bash
cp .env.example .env
```

4. Start development server
```bash
pnpm start
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

### Development
```bash
pnpm start          # Start development server
pnpm preview        # Preview production build locally
```

### Building
```bash
pnpm build          # Build for production
pnpm analyze        # Build with bundle analyzer
```

### Code Quality
```bash
pnpm lint           # Lint TypeScript and locale files
pnpm lint:scripts   # Lint TypeScript files only
pnpm lint:locales   # Lint locale JSON files only
pnpm format         # Check code formatting
pnpm format:fix     # Fix code formatting
pnpm type-check     # Run TypeScript type checking
```

### Web3 Development
```bash
pnpm generate:ethers-types  # Generate TypeScript types from ABI files
```

## 🏗️ Project Structure

```
src/
├── assets/         # Static assets (icons, images)
├── contexts/       # React contexts (Theme, Web3)
├── helpers/        # Utility functions
├── hooks/          # Custom React hooks
├── localization/   # i18n configuration and translations
├── pages/          # Page components
├── store/          # Zustand stores
├── theme/          # Global styles and theme utilities
└── ui/             # Reusable UI components
```

## 🌐 Environment Variables

Create a `.env` file based on `.env.example`:

```bash
VITE_API_URL=       # Backend API URL
VITE_APP_NAME=      # Application name
```

### Runtime Environment Variables

Environment variables can be updated at runtime using the `public/env.js` file. This allows for dynamic configuration without rebuilding the application.

## 🎨 UI Components

The template includes a comprehensive set of UI components built on top of Radix UI:

- **Layout**: Sidebar, Breadcrumb, Separator
- **Forms**: Input, Label, Select, Checkbox, Toggle
- **Navigation**: Dropdown Menu, Tabs
- **Feedback**: Toast, Tooltip, Badge
- **Data Display**: Table, Avatar, Card, Chart
- **Overlays**: Dialog, Drawer, Sheet
- **Interactive**: Button, Collapsible

## 🔗 Web3 Integration

The template comes with pre-configured Web3 support:

- **Wagmi** for Ethereum interactions
- **Reown AppKit** for wallet connections
- **Multi-chain support** (Bitcoin, Solana, Ethereum)
- **Smart contract types** generation from ABI files

Place your smart contract ABI files in the `abis/` directory and run `pnpm generate:ethers-types` to generate TypeScript types.

## 🌍 Internationalization

The app supports multiple languages using react-i18next:

- Translations are stored in `src/localization/resources/`
- Add new language files as needed
- Use the `useTranslation` hook in components

## 🐳 Docker Support

Build and run with Docker:

```bash
# Build image
docker build --no-cache --progress=plain --build-arg BUILD_VERSION=1.0.0 -t react-tw-template .

# Run container
docker run -p 3000:80 react-tw-template
```

## 📋 Development Guidelines

### Code Quality

The project uses several tools to maintain code quality:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Lefthook** for git hooks

### Commit Hooks

Pre-commit hooks automatically run:
- Linting
- Type checking
- Formatting

## 📋 Customization Checklist

Before deploying your application, customize the following elements to match your project:

### 🏷️ Metadata & SEO

- [ ] **App Metadata** (`src/App.tsx`)

- [ ] **HTML Meta Tags** (`index.html`)
  - [ ] Update `<title>` tag
  - [ ] Add structured data (JSON-LD) if applicable

- [ ] **Environment Variables** (`.env`)
  - [ ] Set `VITE_APP_NAME` to your application name
  - [ ] Set `VITE_API_URL` to your backend API
  - [ ] Add any additional environment variables

### 🎨 Branding & Visual Identity

- [ ] **Favicons & Icons** (`public/branding/`)
  - [ ] Replace `favicon.ico` (16x16, 32x32, 48x48)
  - [ ] Replace `favicon-16x16.png`
  - [ ] Replace `favicon-32x32.png`
  - [ ] Replace `apple-touch-icon.png` (180x180)
  - [ ] Replace `android-chrome-192x192.png`
  - [ ] Replace `android-chrome-512x512.png`
  - [ ] Replace `logo.svg` with your logo
  - [ ] Replace `og-img.svg` with your Open Graph image (1200x630)

- [ ] **Progressive Web App** (`public/site.webmanifest`)
  - [ ] Update `name` field
  - [ ] Update `short_name` field
  - [ ] Update icon paths if moved
  - [ ] Update `theme_color` to match your brand
  - [ ] Update `background_color`
  - [ ] Verify `display` mode preference

- [ ] **Browser Configuration** (`public/browserconfig.xml`)
  - [ ] Update `TileColor` for Windows tiles
  - [ ] Update tile image path if needed

### 🖼️ Images & Assets

- [ ] **Open Graph Image**
  - [ ] Create 1200x630px image for social sharing
  - [ ] Update path in metadata and place in `public/branding/`
  - [ ] Test with Facebook Sharing Debugger and Twitter Card Validator

- [ ] **App Icons & Logos**
  - [ ] Update main logo in navigation/header
  - [ ] Update any brand imagery throughout the app
  - [ ] Ensure all icons are SVG or high-resolution PNG

### 🌐 Domain & Hosting

- [ ] **Domain Configuration**
  - [ ] Update all hardcoded URLs to your domain

- [ ] **SEO Configuration**
  - [ ] Submit sitemap to Google Search Console
  - [ ] Submit sitemap to Bing Webmaster Tools
  - [ ] Set up Google Analytics or alternative
  - [ ] Configure robots.txt
  - [ ] Set up error pages (404, 500)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
