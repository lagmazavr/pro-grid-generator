# Quick Start Guide 🚀

## What You Have

A fully configured **Vite + React + TypeScript** frontend project with:

- ✅ **Tailwind CSS 4** for styling
- ✅ **shadcn/ui** components (Button, Card, Input)
- ✅ **Feature-Sliced Design** architecture
- ✅ Path aliases configured (`@/*`)
- ✅ Example components showing FSD structure

## View the Demo

The development server is running at: **http://localhost:5173**

Open this URL to see:
- shadcn/ui components showcase
- Different button variants and sizes
- Card components with various layouts
- Input fields
- All styled with Tailwind CSS

## Project Commands

```bash
# Development (already running)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Adding New Components

### 1. Add a shadcn/ui Component

Visit https://ui.shadcn.com/, pick a component, then:

```bash
# Create the component file
touch src/shared/ui/badge.tsx

# Copy the component code from shadcn/ui
# Then export it from src/shared/ui/index.ts
```

### 2. Create a New Entity

```bash
# Create directories
mkdir -p src/entities/product/{model,ui}

# Create types
touch src/entities/product/model/types.ts

# Create UI component
touch src/entities/product/ui/product-card.tsx

# Create entry point
touch src/entities/product/index.ts
```

**Example entity structure:**

```tsx
// src/entities/product/model/types.ts
export interface Product {
  id: string
  name: string
  price: number
}

// src/entities/product/ui/product-card.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/src/shared/ui'
import type { Product } from '../model/types'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>${product.price}</p>
      </CardContent>
    </Card>
  )
}

export { ProductCard }

// src/entities/product/index.ts
export type { Product } from './model/types'
export { ProductCard } from './ui/product-card'
```

### 3. Create a New Feature

```bash
# Create directories
mkdir -p src/features/search/ui

# Create component
touch src/features/search/ui/search-bar.tsx

# Create entry point
touch src/features/search/index.ts
```

### 4. Create a New Page

```bash
# Create directories
mkdir -p src/pages/products/ui

# Create component
touch src/pages/products/ui/products-page.tsx

# Create entry point
touch src/pages/products/index.ts
```

## Import Patterns

### ✅ Correct Imports

```tsx
// From shared
import { cn } from '@/src/shared/lib'
import { Button, Card } from '@/src/shared/ui'

// From entities
import { Product, ProductCard } from '@/src/entities/product'

// From features
import { SearchBar } from '@/src/features/search'

// From pages
import { HomePage } from '@/src/pages/home'
```

### ❌ Incorrect Imports

```tsx
// DON'T import from subfolders directly
import { Product } from '@/src/entities/product/model/types'
import { ProductCard } from '@/src/entities/product/ui/product-card'
```

## FSD Rules

1. **One `index.ts` per slice** - Only at the root level of each entity/feature/widget
2. **Manual exports** - Explicitly export what other layers need
3. **Import hierarchy** - Lower layers can't import from upper layers
4. **Layer structure**:
   - `shared` → base utilities
   - `entities` → business entities
   - `features` → user scenarios
   - `widgets` → composite UI blocks
   - `pages` → application pages

## Component Style

### ✅ Use Function Declarations

```tsx
function MyComponent() {
  return <div>Hello</div>
}

export { MyComponent }
```

### ❌ Don't Use Arrow Functions

```tsx
// Don't do this
export const MyComponent = () => <div>Hello</div>
```

## Styling with Tailwind

Use utility classes for everything:

```tsx
function Component() {
  return (
    <div className="bg-background p-4 rounded-lg border border-border">
      <h1 className="text-2xl font-bold text-foreground">Title</h1>
      <p className="text-muted-foreground">Description</p>
    </div>
  )
}
```

Use the `cn()` utility for conditional classes:

```tsx
import { cn } from '@/src/shared/lib'

function Component({ active }: { active: boolean }) {
  return (
    <div className={cn(
      'p-4 rounded-lg',
      active ? 'bg-primary' : 'bg-muted'
    )}>
      Content
    </div>
  )
}
```

## Theme Toggle

The project includes a theme toggle feature:

```tsx
import { ThemeToggle } from '@/src/features/theme-toggle'

// Use it in your layout
<ThemeToggle />
```

## Available shadcn/ui Components

Current components in `src/shared/ui/`:
- `Button` - With variants: default, destructive, outline, secondary, ghost, link
- `Card` - With subcomponents: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- `Input` - Text input field

Add more from: https://ui.shadcn.com/docs/components

## More Resources

- 📖 **SETUP.md** - Detailed setup and development guide
- 📁 **PROJECT_STRUCTURE.md** - Full project structure overview
- 📚 **README.md** - General project information

## Next Steps

1. ✅ View the demo at http://localhost:5173
2. 🎨 Add more shadcn/ui components you need
3. 🏗️ Create your entities (data models)
4. ⚡ Build features (user interactions)
5. 📦 Compose widgets (reusable blocks)
6. 📄 Create pages (routes)
7. 🚀 Build your app!

## Need Help?

- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/
- React: https://react.dev/
- Feature-Sliced Design: https://feature-sliced.design/
- Vite: https://vitejs.dev/

---

**Happy coding! 🎉**

