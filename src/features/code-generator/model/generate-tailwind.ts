/**
 * Tailwind CSS code generator
 * Generates React/TSX code using Tailwind CSS utility classes for CSS Grid
 */

import type { GridState } from '@/entities/grid'

/**
 * Generates Tailwind CSS Grid code from grid state
 * Uses Tailwind utility classes with CSS Grid
 */
export function generateTailwindCode(gridState: GridState): string {
  const { config, items } = gridState

  if (items.length === 0) {
    return `import React from 'react'

/**
 * Grid component generated from visual editor
 * Grid configuration: ${config.columns} columns × ${config.rows} rows, ${config.gap}px gap
 */
function MyGrid() {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`,
        gridTemplateRows: \`repeat(${config.rows}, 1fr)\`,
        gap: \`${config.gap}px\`,
      }}
    >
      {/* Add grid items here */}
    </div>
  )
}

export default MyGrid`
  }

  // Sort items by row start, then column start for consistent ordering
  const sortedItems = [...items].sort((a, b) => {
    if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
    return a.colStart - b.colStart
  })

  const gridItems = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      const colEnd = item.colStart + item.colSpan
      const rowEnd = item.rowStart + item.rowSpan
      return `      <div
        key="${item.id}"
        className="border border-gray-300 p-4 bg-gray-50 rounded"
        style={{
          gridColumnStart: ${item.colStart},
          gridColumnEnd: ${colEnd},
          gridRowStart: ${item.rowStart},
          gridRowEnd: ${rowEnd},
        }}
      >
        Item ${itemNumber}
      </div>`
    })
    .join('\n')

  return `import React from 'react'

/**
 * Grid component generated from visual editor
 * Grid configuration: ${config.columns} columns × ${config.rows} rows, ${config.gap}px gap
 * Contains ${items.length} item${items.length !== 1 ? 's' : ''}
 */
function MyGrid() {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`,
        gridTemplateRows: \`repeat(${config.rows}, 1fr)\`,
        gap: \`${config.gap}px\`,
      }}
    >
${gridItems}
    </div>
  )
}

export default MyGrid`
}
