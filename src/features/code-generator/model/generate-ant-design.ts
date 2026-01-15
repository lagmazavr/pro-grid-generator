/**
 * Ant Design code generator
 * Generates Ant Design code using CSS Grid with Card components
 * Since Ant Design's Row/Col doesn't support multi-row spanning items,
 * we use CSS Grid which provides full control over grid positioning
 */

import type { GridState } from '@/entities/grid'

/**
 * Generates Ant Design code from grid state
 * Uses CSS Grid layout with Ant Design Card components
 * This approach supports complex layouts with multi-row and multi-column items
 */
export function generateAntDesignCode(gridState: GridState): string {
  const { config, items } = gridState

  if (items.length === 0) {
    return `import React from 'react'
import { Card } from 'antd'

/**
 * Grid component generated from visual editor
 * Grid configuration: ${config.columns} columns × ${config.rows} rows, ${config.gap}px gap
 * 
 * Note: Using CSS Grid for complex layouts as Ant Design's Row/Col doesn't support
 * multi-row spanning items. This provides full control over grid positioning.
 */
function MyGrid() {
  return (
    <div
      style={{
        display: 'grid',
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

  const gridItems = items
    .map((item) => {
      const colEnd = item.colStart + item.colSpan
      const rowEnd = item.rowStart + item.rowSpan
      return `      <Card
        key="${item.id}"
        style={{
          gridColumnStart: ${item.colStart},
          gridColumnEnd: ${colEnd},
          gridRowStart: ${item.rowStart},
          gridRowEnd: ${rowEnd},
          border: '1px solid red',
        }}
      >
        Item ${item.id}
      </Card>`
    })
    .join('\n')

  return `import React from 'react'
import { Card } from 'antd'

/**
 * Grid component generated from visual editor
 * Grid configuration: ${config.columns} columns × ${config.rows} rows, ${config.gap}px gap
 * Contains ${items.length} item${items.length !== 1 ? 's' : ''}
 * 
 * Note: Using CSS Grid for complex layouts as Ant Design's Row/Col doesn't support
 * multi-row spanning items. This provides full control over grid positioning.
 */
function MyGrid() {
  return (
    <div
      style={{
        display: 'grid',
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
