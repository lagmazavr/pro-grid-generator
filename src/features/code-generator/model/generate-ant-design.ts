/**
 * Ant Design code generator
 * Generates clean, copy-ready code for Ant Design Grid system (Row/Col)
 */

import type { GridState } from '@/entities/grid'

/**
 * Generates Ant Design code from grid state
 * Uses Row and Col components with span props
 */
export function generateAntDesignCode(gridState: GridState): string {
  const { config, items } = gridState

  if (items.length === 0) {
    return `import { Row, Col } from 'antd'

function MyGrid() {
  return (
    <Row gutter={[${config.gap}, ${config.gap}]}>
      {/* Add grid items here */}
    </Row>
  )
}

export default MyGrid`
  }

  // Group items by row for better code structure
  const itemsByRow = new Map<number, typeof items>()
  items.forEach((item) => {
    const row = item.rowStart
    if (!itemsByRow.has(row)) {
      itemsByRow.set(row, [])
    }
    itemsByRow.get(row)!.push(item)
  })

  // Sort rows
  const sortedRows = Array.from(itemsByRow.keys()).sort((a, b) => a - b)

  const rows = sortedRows.map((rowNum) => {
    const rowItems = itemsByRow.get(rowNum)!.sort((a, b) => a.colStart - b.colStart)
    return rowItems
      .map((item) => {
        // Calculate offset (colStart - 1)
        const offset = item.colStart > 1 ? ` offset={${item.colStart - 1}}` : ''
        const span = item.colSpan
        return `        <Col${offset} span={${span}}>Item ${item.id}</Col>`
      })
      .join('\n')
  })

  return `import { Row, Col } from 'antd'

function MyGrid() {
  return (
    <Row gutter={[${config.gap}, ${config.gap}]}>
${rows.join('\n')}
    </Row>
  )
}

export default MyGrid`
}

