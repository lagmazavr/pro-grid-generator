import type { GridState } from '@/entities/grid'
import {
  sortGridItems,
  hasVerticalItems,
  generateTailwindGridClasses,
  generateTailwindGapClass,
  generateTailwindGridColsClass,
  generateTailwindGridRowsClass,
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
    const gridItems = sortedItems
      .map((item, index) => {
        const itemNumber = index + 1
        const span = Math.round(item.colSpan * columnRatio)

        if (!withTailwind) {
          return `      <Col span={${span}}>
        <div>
          Item ${itemNumber}
        </div>
      </Col>`
        } else {
          return `      <Col span={${span}}>
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

  const gapClass = generateTailwindGapClass(config.gap)
  const gridColsClass = generateTailwindGridColsClass(config.columns)
  const gridRowsClass = generateTailwindGridRowsClass(config.rows)
  const variantProp = !withStyledBorders ? ' variant="borderless"' : ''

  const sortedItems = sortGridItems(items)
  const gridItems = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      const { colEnd, rowEnd } = calculateGridItemEnds(item)

      if (withTailwind) {
        const classes = generateTailwindGridClasses(item, false)
        return `      <Card${variantProp} className="${classes}">
        Item ${itemNumber}
      </Card>`
      } else {
        const styleContent = `{
          gridColumnStart: ${item.colStart},
          gridColumnEnd: ${colEnd},
          gridRowStart: ${item.rowStart},
          gridRowEnd: ${rowEnd},
        }`
        return `      <Card${variantProp}
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
