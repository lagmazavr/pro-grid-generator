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

export function generateMantineCode(gridState: GridState, options: GeneratorOptions = {}): string {
  const { withStyledBorders = true, withTailwind = false } = options
  const { config, items } = gridState

  const header = `// Quickstart: https://mantine.dev/getting-started/`

  const hasVertical = hasVerticalItems(items)

  if (!hasVertical && items.length > 0) {
    const sortedItems = sortGridItems(items)
    const columnRatio = 12 / config.columns
    const borderStyle = generateBorderStyle(withStyledBorders)
    const gridItems = sortedItems
      .map((item, index) => {
        const itemNumber = index + 1
        const span = Math.round(item.colSpan * columnRatio)
        const styleProps = borderStyle ? ` style={{ ${borderStyle} }}` : ''
        return `      <Grid.Col span={${span}}${styleProps}>
        Item ${itemNumber}
      </Grid.Col>`
      })
      .join('\n')

    const gap = config.gap % 4 === 0 ? config.gap / 4 : `\`${config.gap}px\``

    return `${header}
import { Grid } from "@mantine/core";

const MyGrid = () => {
  return (
    <Grid gutter={${gap}}>
${gridItems}
    </Grid>
  );
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
    
    const gridTag = withTailwind
      ? `<Grid ${containerStyle}>`
      : `<Grid
      ${containerStyle}
    >`
    return `${header}
import { Grid } from "@mantine/core";

const MyGrid = () => {
  return (
    ${gridTag}
      {/* Grid items code will appear here */}
    </Grid>
  );
}

export default MyGrid;`
  }

  const sortedItems = sortGridItems(items)
  const borderStyle = generateBorderStyle(withStyledBorders)
  const gapClass = generateTailwindGapClass(config.gap)
  const gridColsClass = generateTailwindGridColsClass(config.columns)
  const gridRowsClass = generateTailwindGridRowsClass(config.rows)
  
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
import { Card } from "@mantine/core";

const MyGrid = () => {
  return (
    ${containerTag}
${gridItems}
    </div>
  );
}

export default MyGrid;`
}