# Project Structure Overview

## Directory Tree

```
tailwindgen/
├── src/
│   ├── shared/              # Shared layer - Reusable utilities and components
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx   # Button component with variants
│   │   │   ├── card.tsx     # Card component with subcomponents
│   │   │   ├── input.tsx    # Input component
│   │   │   └── index.ts     # Exports all UI components
│   │   ├── lib/             # Utility functions
│   │   │   ├── cn.ts        # Class name merger (clsx + tailwind-merge)
│   │   │   └── index.ts     # Exports all utilities
│   │   ├── api/             # API client configuration (empty)
│   │   ├── hooks/           # Shared React hooks (empty)
│   │   ├── config/          # App configuration (empty)
│   │   └── stores/          # Global state management (empty)
│   │
│   ├── entities/            # Entities layer - Business entities
│   │   └── user/            # Example: User entity
│   │       ├── model/
│   │       │   └── types.ts # User type definitions
│   │       ├── ui/
│   │       │   └── user-card.tsx # UserCard component
│   │       └── index.ts     # Single entry point - exports types and components
│   │
│   ├── features/            # Features layer - User scenarios
│   │   └── theme-toggle/    # Example: Theme toggle feature
│   │       ├── ui/
│   │       │   └── theme-toggle.tsx # Theme toggle button
│   │       └── index.ts     # Single entry point
│   │
│   ├── widgets/             # Widgets layer - Composite UI blocks (empty)
│   │
│   ├── pages/               # Pages layer - Application pages
│   │   └── home/            # Home page
│   │       ├── ui/
│   │       │   └── home-page.tsx # Home page component with demo
│   │       └── index.ts     # Single entry point
│   │
│   ├── App.tsx              # Root App component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Tailwind CSS with theme variables
│
├── public/                  # Static assets
│   └── vite.svg
│
├── components.json          # shadcn/ui configuration
├── tailwind.config.js       # Tailwind CSS v4 configuration
├── postcss.config.js        # PostCSS with @tailwindcss/postcss
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # TypeScript app configuration with path aliases
├── vite.config.ts           # Vite configuration with path aliases
├── package.json             # Dependencies and scripts
├── README.md                # Project overview
├── SETUP.md                 # Detailed setup and development guide
└── .cursor/
    └── rules                # Cursor IDE rules for code style and FSD

```

## FSD Layer Dependencies

```
┌──────────────────────────────────────────────────────────┐
│  Pages        (Can import from all layers)               │
├──────────────────────────────────────────────────────────┤
│  Widgets      (Can import: shared, entities, features)   │
├──────────────────────────────────────────────────────────┤
│  Features     (Can import: shared, entities)             │
├──────────────────────────────────────────────────────────┤
│  Entities     (Can import: shared)                       │
├──────────────────────────────────────────────────────────┤
│  Shared       (Can import: shared only)                  │
└──────────────────────────────────────────────────────────┘
```

## File Organization Pattern

Each slice (entity/feature/widget) follows this pattern:

```
slice-name/
├── model/           # Business logic, types, utilities
├── ui/              # UI components
├── api/             # API calls (optional)
└── index.ts         # Single entry point - manually exports public API
```

## Example Usage

### Importing from Shared

```tsx
// ✅ Import from shared layer
import { cn } from '@/src/shared/lib'
import { Button, Card, Input } from '@/src/shared/ui'
```

### Importing from Entities

```tsx
// ✅ Import from entity entry point
import { User, UserCard } from '@/src/entities/user'

// ❌ DO NOT import directly from subfolders
import { User } from '@/src/entities/user/model/types'
```

### Importing from Features

```tsx
// ✅ Import from feature entry point
import { ThemeToggle } from '@/src/features/theme-toggle'
```

### Importing from Pages

```tsx
// ✅ Import from page entry point
import { HomePage } from '@/src/pages/home'
```

## Current Implementation Status

### ✅ Implemented

- [x] Vite + React + TypeScript setup
- [x] Tailwind CSS v4 with @tailwindcss/postcss
- [x] FSD directory structure
- [x] Path aliases (@/* pointing to root)
- [x] shadcn/ui base components (Button, Card, Input)
- [x] Shared utilities (cn function)
- [x] Example entity (user)
- [x] Example feature (theme-toggle)
- [x] Example page (home)
- [x] Cursor rules for code style
- [x] TypeScript strict mode
- [x] Development server running

### 📝 Ready to Add

- [ ] React Router or TanStack Router for navigation
- [ ] State management (Zustand, Jotai, or Zustand)
- [ ] API client setup (axios or fetch wrapper)
- [ ] More shadcn/ui components as needed
- [ ] More entities based on your domain
- [ ] More features based on user scenarios
- [ ] Widgets for composite UI blocks
- [ ] Authentication feature
- [ ] Form validation (React Hook Form + Zod)

## Development

```bash
# Start dev server (currently running)
npm run dev          # → http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI library |
| TypeScript | 5.9 | Type safety |
| Vite | 7 | Build tool |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | latest | UI components |
| class-variance-authority | 0.7 | Component variants |
| lucide-react | latest | Icons |

## Next Steps

1. Browse the demo at http://localhost:5173
2. Read SETUP.md for detailed development guide
3. Add more shadcn/ui components from ui.shadcn.com
4. Create your own entities, features, and pages
5. Follow the FSD methodology for scalable architecture

