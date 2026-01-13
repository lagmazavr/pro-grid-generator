# TailwindGen Setup Guide

## ✅ Setup Complete

The project is now properly configured with:

- ✅ Vite 7 + React 19 + TypeScript 5
- ✅ Tailwind CSS 4 with @tailwindcss/vite plugin
- ✅ Feature-Sliced Design (FSD) architecture
- ✅ shadcn/ui CLI integration (Button, Card, Input)
- ✅ Path aliases configured (`@/*` → `./src/*`)
- ✅ Cursor rules for code style and methodology

## Development Server

```bash
npm run dev  # Runs on http://localhost:5173
```

## Adding shadcn/ui Components

### Method 1: Using shadcn CLI (Recommended)

```bash
# Add a component
npx shadcn@latest add dialog

# Move it to the correct location (shadcn creates in @/ folder)
mv ./@/shared/ui/dialog.tsx ./src/shared/ui/
rm -rf ./@

# Export from index.ts
echo "export { Dialog } from './dialog'" >> src/shared/ui/index.ts
```

### Method 2: Manual Copy

1. Visit https://ui.shadcn.com/docs/components/dialog
2. Copy the component code
3. Create `src/shared/ui/dialog.tsx`
4. Paste and adjust imports
5. Export from `src/shared/ui/index.ts`

## Why the Manual Move?

The shadcn CLI interprets `@/shared/ui` literally and creates a directory named `@` instead of resolving the path alias. This is a known issue with path alias resolution in the shadcn CLI.

## Component Configuration

The `components.json` file configures shadcn:

```json
{
  "style": "new-york",
  "aliases": {
    "components": "@/shared",
    "utils": "@/shared/lib/utils",
    "ui": "@/shared/ui"
  }
}
```

## Project Structure

```
tailwindgen/
├── src/
│   ├── shared/           # Shared utilities and components
│   │   ├── ui/           # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── index.ts
│   │   └── lib/          # Utility functions
│   │       ├── utils.ts  # cn() function
│   │       └── index.ts
│   ├── entities/         # Business entities
│   ├── features/         # User features
│   ├── widgets/          # Composite UI blocks
│   └── pages/            # Application pages
├── components.json       # shadcn/ui configuration
├── tailwind.config.js    # Tailwind CSS configuration (auto-generated)
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Example: Adding a New Component

```bash
# 1. Add the component
npx shadcn@latest add badge

# 2. Move to correct location
mv ./@/shared/ui/badge.tsx ./src/shared/ui/
rm -rf ./@

# 3. Export it
echo "export { Badge } from './badge'" >> src/shared/ui/index.ts

# 4. Use it in your code
```

```tsx
import { Badge } from '@/shared/ui'

function MyComponent() {
  return <Badge>New</Badge>
}
```

## FSD Architecture

### Creating a New Entity

```bash
mkdir -p src/entities/product/{model,ui}
```

```tsx
// src/entities/product/model/types.ts
export interface Product {
  id: string
  name: string
  price: number
}

// src/entities/product/ui/product-card.tsx
import { Card } from '@/shared/ui'
import type { Product } from '../model/types'

function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </Card>
  )
}

export { ProductCard }

// src/entities/product/index.ts
export type { Product } from './model/types'
export { ProductCard } from './ui/product-card'
```

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run linter
```

## Troubleshooting

### shadcn components not found

If shadcn creates components in the `@` folder:
```bash
# Move them manually
mv ./@/shared/ui/*.tsx ./src/shared/ui/
rm -rf ./@
```

### Build fails

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Dark mode not working

Add the `dark` class to the `<html>` element:
```tsx
document.documentElement.classList.toggle('dark')
```

## Next Steps

1. ✅ Project is ready for development
2. Add more shadcn/ui components as needed
3. Create your entities, features, and widgets
4. Follow the FSD methodology for scalable architecture

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Vite Documentation](https://vitejs.dev/)
