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

export function generateAntDesignCode(gridState: GridState, options: GeneratorOptions = {}): string {
  const { withStyledBorders = true, withTailwind = false } = options
  const { config, items } = gridState

  const header = `// Quickstart: https://ant.design/docs/react/introduce`

  const hasVertical = hasVerticalItems(items)

  if (!hasVertical && items.length > 0) {
    const sortedItems = sortGridItems(items)
    const columnRatio = 24 / config.columns
    const borderStyle = generateBorderStyle(withStyledBorders)
    const gridItems = sortedItems
      .map((item, index) => {
        const itemNumber = index + 1
        const span = Math.round(item.colSpan * columnRatio)
        
        if (!withTailwind) {
          const divStyle = borderStyle ? ` style={{ ${borderStyle} }}` : ''
          return `      <Col span={${span}}>
        <div${divStyle}>
          Item ${itemNumber}
        </div>
      </Col>`
        } else {
          const styleProps = borderStyle ? ` style={{ ${borderStyle} }}` : ''
          return `      <Col span={${span}}${styleProps}>
        Item ${itemNumber}
      </Col>`
        }
      })
      .join('\n')

    return `${header}
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
    return `${header}
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
  return `${header}
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
