/**
 * Tailwind CSS code generator
 * Generates React/TSX code using Tailwind CSS utility classes for CSS Grid
 */

import type { GridState } from '@/entities/grid'
import {
  sortGridItems,
  generateTailwindGridClasses,
  generateTailwindGapClass,
  generateTailwindGridColsClass,
  generateTailwindGridRowsClass,
} from './utils'

interface GeneratorOptions {
  withStyledBorders?: boolean
}

/**
 * Generates Tailwind CSS Grid code from grid state
 * Uses Tailwind utility classes with CSS Grid
 */
export function generateTailwindCode(
  gridState: GridState,
  format: 'jsx' | 'html' = 'jsx',
  options: GeneratorOptions = {}
): string {
  const { withStyledBorders = true } = options
  const { config, items } = gridState

  const gapClass = generateTailwindGapClass(config.gap)
  const gridColsClass = generateTailwindGridColsClass(config.columns)
  const gridRowsClass = generateTailwindGridRowsClass(config.rows)
  const sortedItems = sortGridItems(items)

  const gridItems = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      const classes = generateTailwindGridClasses(item, withStyledBorders)
      const className = format === 'jsx' ? 'className' : 'class'
      return `      <div ${className}="${classes}">
        Item ${itemNumber}
      </div>`
    })
    .join('\n')

  if (format === 'html') {
    if (items.length === 0) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind Grid Layout</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="grid ${gridColsClass} ${gridRowsClass} ${gapClass}">
    <!-- Add grid items here -->
  </div>
</body>
</html>`
    }
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind Grid Layout</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="grid ${gridColsClass} ${gridRowsClass} ${gapClass}">
${gridItems}
  </div>
</body>
</html>`
  }

  // JSX format
  if (items.length === 0) {
    return `import React from 'react'

const MyGrid = () => {
  return (
    <div className="grid ${gridColsClass} ${gridRowsClass} ${gapClass}">
      {/* Grid items code will appear here */}
    </div>
  )
}

export default MyGrid;`
  }

  return `import React from 'react'

const MyGrid = () => {
  return (
    <div className="grid ${gridColsClass} ${gridRowsClass} ${gapClass}">
${gridItems}
    </div>
  )
}

export default MyGrid;`
}
