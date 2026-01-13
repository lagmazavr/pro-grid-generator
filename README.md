# TailwindGen

A modern frontend project built with Vite, React, TypeScript, and following Feature-Sliced Design (FSD) architecture.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 with @tailwindcss/vite
- **UI Components**: shadcn/ui
- **Architecture**: Feature-Sliced Design (FSD)
- **Utilities**: class-variance-authority, clsx, tailwind-merge

## Project Structure

```
src/
├── shared/       # Reusable code (UI, lib, api, hooks, stores, config)
│   ├── ui/       # shadcn/ui components (Button, Card, Input, etc.)
│   ├── lib/      # Utilities (cn function, helpers)
│   ├── hooks/    # Shared React hooks
│   ├── api/      # API client configuration
│   ├── config/   # App configuration
│   └── stores/   # Global state management
├── entities/     # Business entities
├── features/     # User scenarios and features
├── widgets/      # Composite UI blocks
└── pages/        # Application pages
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## shadcn/ui Components

This project uses shadcn/ui components. To add new components:

```bash
npx shadcn@latest add button
```

**Note:** Due to path alias resolution, shadcn creates files in a literal `@` folder. After adding components, move them to the correct location:

```bash
# Add component
npx shadcn@latest add dialog

# Move to correct location
mv ./@/shared/ui/dialog.tsx ./src/shared/ui/
rm -rf ./@

# Export from index.ts
# Add to src/shared/ui/index.ts: export { Dialog } from './dialog'
```

### Available Components

Current components in `src/shared/ui/`:
- `Button` - With variants: default, destructive, outline, secondary, ghost, link
- `Card` - With subcomponents: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- `Input` - Text input field

Add more from: https://ui.shadcn.com/docs/components

## Feature-Sliced Design (FSD)

This project follows the FSD methodology for better code organization and scalability.

### Import Rules

- **Shared layer**: Can import from shared only
- **Entities layer**: Can import from shared and entities
- **Features layer**: Can import from shared, entities, and features
- **Widgets layer**: Can import from shared, entities, features, and widgets
- **Pages layer**: Can import from all layers

### Entry Point Pattern

Each slice (entity, feature, widget) has **exactly ONE** `index.ts` file at its root level for manual control over exports.

Example:
```ts
// entities/user/index.ts
export type { User } from './model/types'
export { UserCard } from './ui/user-card'
```

## Path Aliases

The project uses `@/*` as a path alias pointing to `./src/*`:

```tsx
import { Button } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { User } from '@/entities/user'
```

## Styling

- Use Tailwind CSS utility classes for styling
- Use the `cn()` utility function for conditional class names
- CSS variables are defined in `src/index.css` for theming
- Supports dark mode with the `.dark` class

## Code Style

- Use function declarations for React components (not arrow functions)
- Use TypeScript interfaces for props
- Follow strict TypeScript configuration
- Use the FSD import rules

## License

MIT
