# Ionic Theme Builder

A visual design tool for crafting custom [Ionic Framework](https://ionicframework.com/) themes with real-time preview. Build, customize, and export production-ready CSS variables for your Ionic Angular applications — no manual variable hunting required.

![Angular](https://img.shields.io/badge/Angular-21-dd0031?logo=angular)
![Ionic](https://img.shields.io/badge/Ionic-8-3880ff?logo=ionic)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🎨 Global Theme Editor
- **9 Ionic color palette** customization (primary, secondary, tertiary, success, warning, danger, dark, medium, light)
- **Custom colors** — add unlimited named colors with auto-generated `ion-color-*` utility classes
- **Global properties** — background, text, toolbar, items, cards, tab bar, fonts, borders
- **Stepped colors** — automatically generated for smooth color transitions

### 📱 Live Phone Preview
- **Realistic device frames** — iOS (Dynamic Island) and Android (punch-hole camera)
- **Per-component mode** — each Ionic component independently renders in iOS or Material Design mode
- **Instant feedback** — CSS variable changes reflect immediately in the preview
- **All Ionic components** — toolbar, buttons, cards, segments, lists, inputs, selects, toggles, checkboxes, radios, ranges, progress bars, spinners, chips, badges, accordions, breadcrumbs, datetime, FAB, tab bar, and more

### 🧩 Component Overrides
- **Per-component CSS variable** editing for 25+ Ionic components
- **Numeric inputs** with unit selectors (px / rem) for size variables
- **Per-component platform mode** — override individual components to iOS or Material Design
- **Tailwind CSS v4 integration** — optional one-click conversion to Tailwind design tokens:
  - `--border-radius` → `var(--radius-lg)`
  - `--padding-*` → `var(--spacing-4)`
  - `--box-shadow` → `var(--shadow-md)`

### 🌗 Dark Mode
- **Three strategies** — always, system preference (`prefers-color-scheme`), or class-based (`.ion-palette-dark`)
- **Independent dark palette** — separate color overrides for dark mode
- **Live toggle** — switch between light and dark in the preview

### 📋 CSS Output
- **Production-ready CSS** — copy or download the generated stylesheet
- **Mode-aware selectors** — output scoped to `:root`, `:root.ios`, or `:root.md`
- **Component selectors** — per-component overrides with proper specificity
- **Custom color utility classes** — `.ion-color-{name}` with full variable mapping

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
git clone https://github.com/medbenmakhlouf/ionic-theme-builder.git
cd ionic-theme-builder
npm install
```

### Development

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

### Build

```bash
ng build
```

Production artifacts are output to `dist/ionic-theme-builder/`.

---

## 🏗️ Architecture

```
src/app/
├── core/
│   ├── models/          # Theme interfaces, defaults, Tailwind tokens
│   ├── services/        # ThemeService (central state management with signals)
│   └── utils/           # Color generation utilities (contrast, shade, tint, RGB)
├── features/
│   ├── theme-editor/    # Main layout, header controls
│   │   ├── global-colors/      # Color palette + custom colors + global properties
│   │   ├── component-editor/   # Per-component variable overrides
│   │   └── dark-mode-editor/   # Dark mode configuration
│   ├── preview/         # Live phone frame preview with all Ionic components
│   └── css-output/      # Generated CSS display with copy/download
└── app.ts              # Root component with routing
```

### Key Design Decisions

- **Angular Signals** for reactive state management (no RxJS for UI state)
- **Standalone components** (Angular 21+ default)
- **CUSTOM_ELEMENTS_SCHEMA** for Ionic web components in preview
- **Static `mode` attributes** with `@if`/`@else` branching — Ionic reads mode once at init, so dynamic binding doesn't work
- **Tailwind CSS v4** for the builder UI itself (utility-first styling)
- **OnPush change detection** throughout for performance

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Angular | 21 | Application framework |
| Ionic Framework | 8 | Component library (preview target) |
| Tailwind CSS | 4 | Builder UI styling |
| TypeScript | 5.8 | Type safety |
| Vitest | — | Unit testing |

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
