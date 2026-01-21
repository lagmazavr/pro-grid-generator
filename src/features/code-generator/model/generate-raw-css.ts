import type { GridState } from '@/entities/grid'
import {
  sortGridItems,
  generateBorderStyle,
  generateBorderCSS,
  calculateGridItemEnds,
} from './utils'

interface GeneratorOptions {
  withStyledBorders?: boolean
}

export function generateRawCSSCode(
  gridState: GridState,
  format: 'jsx' | 'html' = 'html',
  options: GeneratorOptions = {}
): string {
  const { withStyledBorders = true } = options
  const { config, items } = gridState

  const sortedItems = sortGridItems(items)
  const borderStyle = generateBorderStyle(withStyledBorders)
  const borderCSS = generateBorderCSS(withStyledBorders)

  const gridItems = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      const { colEnd, rowEnd } = calculateGridItemEnds(item)
      
      if (format === 'jsx') {
        const baseStyle = `gridColumnStart: ${item.colStart}, gridColumnEnd: ${colEnd}, gridRowStart: ${item.rowStart}, gridRowEnd: ${rowEnd}`
        const style = borderStyle ? `${baseStyle}, ${borderStyle}` : baseStyle
        return `      <div style={{ ${style} }}>
        Item ${itemNumber}
      </div>`
      }
      return `    <div class="grid-item-${itemNumber}">
      Item ${itemNumber}
    </div>`
    })
    .join('\n')

  const gridItemStyles = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      const { colEnd, rowEnd } = calculateGridItemEnds(item)
      const borderRule = borderCSS ? `\n      ${borderCSS}` : ''
      return `    .grid-item-${itemNumber} {
      grid-column-start: ${item.colStart};
      grid-column-end: ${colEnd};
      grid-row-start: ${item.rowStart};
      grid-row-end: ${rowEnd};${borderRule}
    }`
    })
    .join('\n')

  if (format === 'jsx') {
    if (items.length === 0) {
      return `import React from 'react'

const MyGrid = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`, gridTemplateRows: \`repeat(${config.rows}, 1fr)\`, gap: \`${config.gap}px\` }}>
      {/* Grid items code will appear here */}
    </div>
  )
}

export default MyGrid;`
    }
    return `import React from 'react'

const MyGrid = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`, gridTemplateRows: \`repeat(${config.rows}, 1fr)\`, gap: \`${config.gap}px\` }}>
${gridItems}
    </div>
  )
}

export default MyGrid;`
  }

  // HTML format
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
${gridItemStyles}
  </style>
</head>
<body>
  <div class="grid-container">
${gridItems}
  </div>
</body>
</html>`
}
