/**
 * Mantine code generator
 * Generates Mantine code using CSS Grid with Box and Paper components
 * Uses simple CSS Grid with MantineProvider wrapper
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
 * Generates Mantine Grid code from grid state
 * Uses Box component with CSS Grid and Paper for items
 */
export function generateMantineCode(gridState: GridState, options: GeneratorOptions = {}): string {
  const { withStyledBorders = true, withTailwind = false } = options
  const { config, items } = gridState

  const hasVertical = hasVerticalItems(items)

  // If no vertical items, use Mantine's native grid system
  if (!hasVertical && items.length > 0) {
    const sortedItems = sortGridItems(items)
    const columnRatio = 12 / config.columns
    const borderStyle = generateBorderStyle(withStyledBorders)
    const gridItems = sortedItems
      .map((item, index) => {
        const itemNumber = index + 1
        const span = Math.round(item.colSpan * columnRatio)
        const styleProps = borderStyle ? ` style={{ ${borderStyle} }}` : ''
        return `        <Grid.Col span={${span}}${styleProps}>
          Item ${itemNumber}
        </Grid.Col>`
      })
      .join('\n')

    const gap = config.gap % 4 === 0 ? config.gap / 4 : `\`${config.gap}px\``

    return `// npm install @mantine/core
import { MantineProvider, Grid } from "@mantine/core";

const MyGrid = () => {
  return (
    <MantineProvider>
      <Grid gutter={${gap}}>
${gridItems}
      </Grid>
    </MantineProvider>
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
          display: "grid",
          gridTemplateColumns: "repeat(${config.columns}, 1fr)",
          gridTemplateRows: "repeat(${config.rows}, 1fr)",
          gap: \`${config.gap}px\`,
        }}`
    
    const gridTag = withTailwind
      ? `<Grid ${containerStyle}>`
      : `<Grid
        ${containerStyle}
      >`
    return `// npm install @mantine/core
import { MantineProvider, Grid } from "@mantine/core";

const MyGrid = () => {
  return (
    <MantineProvider>
      ${gridTag}
        {/* Grid items code will appear here */}
      </Grid>
    </MantineProvider>
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
        return `        <Grid.Col className="${classes}">
          Item ${itemNumber}
        </Grid.Col>`
      } else {
        const styleContent = borderStyle
          ? `{ gridColumnStart: ${item.colStart}, gridColumnEnd: ${colEnd}, gridRowStart: ${item.rowStart}, gridRowEnd: ${rowEnd}, ${borderStyle} }`
          : `{ gridColumnStart: ${item.colStart}, gridColumnEnd: ${colEnd}, gridRowStart: ${item.rowStart}, gridRowEnd: ${rowEnd} }`
        return `        <Grid.Col style={${styleContent}}>
          Item ${itemNumber}
        </Grid.Col>`
      }
    })
    .join('\n')

  const containerStyle = withTailwind
    ? `className="grid ${gridColsClass} ${gridRowsClass} ${gapClass}"`
    : `style={{
        display: "grid",
        gridTemplateColumns: "repeat(${config.columns}, 1fr)",
        gridTemplateRows: "repeat(${config.rows}, 1fr)",
        gap: \`${config.gap}px\`,
      }}`

  const gridTag = withTailwind
    ? `<Grid ${containerStyle}>`
    : `<Grid
        ${containerStyle}
      >`
  return `// npm install @mantine/core
import { MantineProvider, Grid } from "@mantine/core";

const MyGrid = () => {
  return (
    <MantineProvider>
      ${gridTag}
${gridItems}
      </Grid>
    </MantineProvider>
  );
}

export default MyGrid;`
}
