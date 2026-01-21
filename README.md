# Pro Grid Generator

A modern grid generator built with Next.js 15, React 19, TypeScript, and following Feature-Sliced Design (FSD) architecture. Generate grid code for multiple UI frameworks and CSS approaches with a visual drag-and-drop interface.

## Tech Stack

- **Framework**: Next.js 15 with React 19 and TypeScript
- **Internationalization**: next-intl (EN, ES, RU)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Architecture**: Feature-Sliced Design (FSD)
- **Utilities**: class-variance-authority, clsx, tailwind-merge

## Supported Technologies

- Material UI v7
- Ant Design v6
- Mantine v8
- CSS Grid (raw CSS)
- Tailwind CSS

## Features

- Visual grid editor with drag-and-drop interface
- Multi-language support (English, Spanish, Russian)
- Technology-specific routing (`/en/material-ui`, `/es/ant-design`, etc.)
- SEO optimized with technology-specific metadata
- Dark mode support
- Real-time code generation

## Project Structure

```
app/
├── [locale]/
│   └── [technology]/
│       ├── layout.tsx      # SEO metadata generation
│       └── page.tsx        # Grid editor page
├── layout.tsx              # Root layout
└── globals.css             # Tailwind styles

src/
├── i18n/                   # next-intl configuration
├── shared/                 # Reusable code (UI, lib, config, providers)
│   ├── ui/                 # shadcn/ui components
│   ├── lib/                # Utilities
│   ├── config/             # App configuration (SEO, etc.)
│   ├── providers/          # React providers (theme, etc.)
│   └── types/              # TypeScript types
├── entities/               # Business entities
├── features/               # User scenarios and features
├── widgets/                # Composite UI blocks
└── pages/                  # Application pages

messages/
├── en.json                 # English translations
├── es.json                 # Spanish translations
└── ru.json                 # Russian translations
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

The app will be available at `http://localhost:3000` and will redirect to `/en/material-ui` by default.

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Routing

The application uses technology-based routing with locale support:

- `/` → Redirects to `/en/material-ui`
- `/[locale]` → Redirects to `/[locale]/material-ui`
- `/[locale]/[technology]` → Grid editor for specific technology

### Supported Routes

- `/en/material-ui`, `/es/material-ui`, `/ru/material-ui`
- `/en/ant-design`, `/es/ant-design`, `/ru/ant-design`
- `/en/mantine`, `/es/mantine`, `/ru/mantine`
- `/en/raw-css`, `/es/raw-css`, `/ru/raw-css`
- `/en/tailwind`, `/es/tailwind`, `/ru/tailwind`

## Internationalization

The project uses `next-intl` for internationalization. Translation files are located in the `messages/` directory.

### Adding Translations

1. Add translation keys to `messages/en.json`
2. Add corresponding translations to `messages/es.json` and `messages/ru.json`
3. Use `useTranslations()` hook in components:

```tsx
import { useTranslations } from 'next-intl'

function MyComponent() {
  const t = useTranslations()
  return <h1>{t('header.title')}</h1>
}
```

## SEO

Each technology page has optimized SEO metadata including:
- Technology-specific titles and descriptions
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Language alternates

Metadata is generated in `src/shared/config/seo.ts` and configured in `app/[locale]/[technology]/layout.tsx`.

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
- `Checkbox` - Checkbox input

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
- CSS variables are defined in `app/globals.css` for theming
- Supports dark mode with the `.dark` class

## Code Style

- Use function declarations for React components (not arrow functions)
- Use TypeScript interfaces for props
- Follow strict TypeScript configuration
- Use the FSD import rules
- Add `'use client'` directive to components using hooks or browser APIs

## License

MIT
