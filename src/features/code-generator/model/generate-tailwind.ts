/**
 * Tailwind CSS code generator
 * Generates React/TSX code using Tailwind CSS utility classes for CSS Grid
 */

import type { GridState } from '@/entities/grid'

/**
 * Generates Tailwind CSS Grid code from grid state
 * Uses Tailwind utility classes with CSS Grid
 */
export function generateTailwindCode(gridState: GridState, format: 'jsx' | 'html' = 'jsx'): string {
  const { config, items } = gridState

  // Convert gap to Tailwind spacing (Tailwind spacing is typically 4px units, but we'll use arbitrary values for precision)
  const gapClass = config.gap % 4 === 0 ? `gap-${config.gap / 4}` : `gap-[${config.gap}px]`
  const gridColsClass = `grid-cols-${config.columns}`
  const gridRowsClass = `grid-rows-${config.rows}`

  // Sort items by row start, then column start for consistent ordering
  const sortedItems = [...items].sort((a, b) => {
    if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
    return a.colStart - b.colStart
  })

  const gridItems = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      const classes = [
        `col-span-${item.colSpan}`,
        `row-span-${item.rowSpan}`,
        item.colStart > 1 ? `col-start-${item.colStart}` : '',
        item.rowStart > 1 ? `row-start-${item.rowStart}` : '',
      ].filter(Boolean).join(' ')
      
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
      {/* Add grid items here */}
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
