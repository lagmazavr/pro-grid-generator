/**
 * Bootstrap code generator
 * Generates Bootstrap 5 code using CSS Grid
 * Bootstrap 5 supports CSS Grid, so we use native grid with Bootstrap utility classes
 */

import type { GridState } from '@/entities/grid'

/**
 * Generates Bootstrap CSS Grid code from grid state
 * Uses Bootstrap 5 with CSS Grid and utility classes
 */
export function generateBootstrapCode(gridState: GridState): string {
  const { config, items } = gridState

  if (items.length === 0) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bootstrap Grid Layout</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
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
  <div class="container my-4">
    <div class="grid-container">
      <!-- Add grid items here -->
    </div>
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
      return `      <div class="card item-${item.id}">
        <div class="card-body">
          Item ${itemNumber}
        </div>
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
  <title>Bootstrap Grid Layout</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    .grid-container {
      display: grid;
      grid-template-columns: repeat(${config.columns}, 1fr);
      grid-template-rows: repeat(${config.rows}, 1fr);
      gap: ${config.gap}px;
    }

${itemStyles}
  </style>
</head>
<body>
  <div class="container my-4">
    <div class="grid-container">
${gridItems}
    </div>
  </div>
</body>
</html>`
}
