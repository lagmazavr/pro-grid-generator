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

  // Check if there are any vertical items (rowSpan > 1)
  const hasVerticalItems = items.some(item => item.rowSpan > 1)

  // If no vertical items, use Ant Design's native Row/Col system
  if (!hasVerticalItems && items.length > 0) {
    const sortedItems = [...items].sort((a, b) => {
      if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
      return a.colStart - b.colStart
    })

    // Ant Design uses 24 columns, calculate span (each item spans config.columns/24 * colSpan)
    const columnRatio = 24 / config.columns
    const gridItems = sortedItems
      .map((item, index) => {
        const itemNumber = index + 1
        const span = Math.round(item.colSpan * columnRatio)
        return `      <Col span={${span}}>
        Item ${itemNumber}
      </Col>`
      })
      .join('\n')

    return `import React from 'react'
import { Row, Col } from 'antd'

const MyGrid = () => {
  return (
    <Row gutter={[${config.gap}, ${config.gap}]}>
${gridItems}
    </Row>
  )
}

export default MyGrid;`
  }

  if (items.length === 0) {
    return `import React from 'react'
import { Card } from 'antd'

const MyGrid = () => {
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

export default MyGrid;`
  }

  const gridItems = items
    .map((item) => {
      const colEnd = item.colStart + item.colSpan
      const rowEnd = item.rowStart + item.rowSpan
      return `      <Card
        style={{
          gridColumnStart: ${item.colStart},
          gridColumnEnd: ${colEnd},
          gridRowStart: ${item.rowStart},
          gridRowEnd: ${rowEnd},
        }}
      >
        Item ${item.id}
      </Card>`
    })
    .join('\n')

  return `import React from 'react'
import { Card } from 'antd'

const MyGrid = () => {
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

export default MyGrid;`
}
