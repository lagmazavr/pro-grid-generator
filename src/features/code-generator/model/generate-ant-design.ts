import type { GridState } from '@/entities/grid'
import {
  sortGridItems,
  hasVerticalItems,
  calculateGridItemEnds,
} from './utils'

interface GeneratorOptions {
  withStyledBorders?: boolean
}

export function generateAntDesignCode(gridState: GridState, options: GeneratorOptions = {}): string {
  const { withStyledBorders = true } = options
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
        return `      <Col span={${span}}>
        <div>
          Item ${itemNumber}
        </div>
      </Col>`
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
    return `${header}
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
      {/* Grid items code will appear here */}
    </div>
  )
}

export default MyGrid;`
  }

  const variantProp = !withStyledBorders ? ' variant="borderless"' : ''
  const sortedItems = sortGridItems(items)
  const gridItems = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      const { colEnd, rowEnd } = calculateGridItemEnds(item)
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
    })
    .join('\n')

  return `${header}
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
