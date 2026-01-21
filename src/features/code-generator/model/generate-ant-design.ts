/**
 * Ant Design code generator
 * Generates Ant Design code using CSS Grid with Card components
 * Since Ant Design's Row/Col doesn't support multi-row spanning items,
 * we use CSS Grid which provides full control over grid positioning
 */

import type { GridState } from '@/entities/grid'
import {
  sortGridItems,
  hasVerticalItems,
  generateTailwindGridClasses,
  generateTailwindGapClass,
  generateTailwindGridColsClass,
  generateTailwindGridRowsClass,
  generateBorderStyle,
  calculateGridItemEnds,
} from './utils'

interface GeneratorOptions {
  withStyledBorders?: boolean
  withTailwind?: boolean
}

/**
 * Generates Ant Design code from grid state
 * Uses CSS Grid layout with Ant Design Card components
 * This approach supports complex layouts with multi-row and multi-column items
 */
export function generateAntDesignCode(gridState: GridState, options: GeneratorOptions = {}): string {
  const { withStyledBorders = true, withTailwind = false } = options
  const { config, items } = gridState

  const hasVertical = hasVerticalItems(items)

  // If no vertical items, use Ant Design's native Row/Col system
  if (!hasVertical && items.length > 0) {
    const sortedItems = sortGridItems(items)
    const columnRatio = 24 / config.columns
    const borderStyle = generateBorderStyle(withStyledBorders)
    const gridItems = sortedItems
      .map((item, index) => {
        const itemNumber = index + 1
        const span = Math.round(item.colSpan * columnRatio)
        const styleProps = borderStyle ? ` style={{ ${borderStyle} }}` : ''
        return `      <Col span={${span}}${styleProps}>
        Item ${itemNumber}
      </Col>`
      })
      .join('\n')

    return `// npm install antd --save
import React from 'react'
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
    const gapClass = generateTailwindGapClass(config.gap)
    const gridColsClass = generateTailwindGridColsClass(config.columns)
    const gridRowsClass = generateTailwindGridRowsClass(config.rows)
    const containerStyle = withTailwind
      ? `className="grid ${gridColsClass} ${gridRowsClass} ${gapClass}"`
      : `style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`,
        gridTemplateRows: \`repeat(${config.rows}, 1fr)\`,
        gap: \`${config.gap}px\`,
      }}`
    
    const containerTag = withTailwind
      ? `<div ${containerStyle}>`
      : `<div
      ${containerStyle}
    >`
    return `// npm install antd --save
import React from 'react'
import { Card } from 'antd'

const MyGrid = () => {
  return (
    ${containerTag}
      {/* Grid items code will appear here */}
    </div>
  )
}

export default MyGrid;`
  }

  const borderStyle = generateBorderStyle(withStyledBorders)
  const gapClass = generateTailwindGapClass(config.gap)
  const gridColsClass = generateTailwindGridColsClass(config.columns)
  const gridRowsClass = generateTailwindGridRowsClass(config.rows)
  
  const sortedItems = sortGridItems(items)
  const gridItems = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      const { colEnd, rowEnd } = calculateGridItemEnds(item)
      
      if (withTailwind) {
        const classes = generateTailwindGridClasses(item, withStyledBorders)
        return `      <Card className="${classes}">
        Item ${itemNumber}
      </Card>`
      } else {
        const styleContent = borderStyle
          ? `{
          gridColumnStart: ${item.colStart},
          gridColumnEnd: ${colEnd},
          gridRowStart: ${item.rowStart},
          gridRowEnd: ${rowEnd},
          ${borderStyle}
        }`
          : `{
          gridColumnStart: ${item.colStart},
          gridColumnEnd: ${colEnd},
          gridRowStart: ${item.rowStart},
          gridRowEnd: ${rowEnd},
        }`
        return `      <Card
        style={${styleContent}}
      >
        Item ${itemNumber}
      </Card>`
      }
    })
    .join('\n')

  const containerStyle = withTailwind
    ? `className="grid ${gridColsClass} ${gridRowsClass} ${gapClass}"`
    : `style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`,
        gridTemplateRows: \`repeat(${config.rows}, 1fr)\`,
        gap: \`${config.gap}px\`,
      }}`

  const containerTag = withTailwind
    ? `<div ${containerStyle}>`
    : `<div
      ${containerStyle}
    >`
  return `// npm install antd --save
import React from 'react'
import { Card } from 'antd'

const MyGrid = () => {
  return (
    ${containerTag}
${gridItems}
    </div>
  )
}

export default MyGrid;`
}
