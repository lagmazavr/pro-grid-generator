/**
 * Raw CSS code generator
 * Generates pure CSS Grid code with HTML markup
 * No framework dependencies - just vanilla CSS Grid
 */

import type { GridState } from '@/entities/grid'

/**
 * Generates raw CSS Grid code from grid state
 * Uses pure CSS Grid with HTML and CSS
 */
export function generateRawCSSCode(gridState: GridState): string {
  const { config, items } = gridState

  if (items.length === 0) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grid Layout</title>
  <style>
    .grid-container {
      display: grid;
      grid-template-columns: repeat(${config.columns}, 1fr);
      grid-template-rows: repeat(${config.rows}, 1fr);
      gap: ${config.gap}px;
    }
  </style>
</head>
<body>
  <div class="grid-container">
    <!-- Add grid items here -->
  </div>
</body>
</html>`
  }

  // Sort items by row start, then column start for consistent ordering
  const sortedItems = [...items].sort((a, b) => {
    if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
    return a.colStart - b.colStart
  })

  const gridItems = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      return `    <div class="grid-item item-${item.id}">
      Item ${itemNumber}
    </div>`
    })
    .join('\n')

  const itemStyles = sortedItems
    .map((item) => {
      const colEnd = item.colStart + item.colSpan
      const rowEnd = item.rowStart + item.rowSpan
      return `  .item-${item.id} {
    grid-column-start: ${item.colStart};
    grid-column-end: ${colEnd};
    grid-row-start: ${item.rowStart};
    grid-row-end: ${rowEnd};
  }`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grid Layout</title>
  <style>
    .grid-container {
      display: grid;
      grid-template-columns: repeat(${config.columns}, 1fr);
      grid-template-rows: repeat(${config.rows}, 1fr);
      gap: ${config.gap}px;
    }

    .grid-item {
      border: 1px solid #ccc;
      padding: 1rem;
      background-color: #f5f5f5;
    }

${itemStyles}
  </style>
</head>
<body>
  <div class="grid-container">
${gridItems}
  </div>
</body>
</html>`
}
