/**
 * Chakra UI code generator
 * Generates Chakra UI code using Grid and GridItem components
 * Chakra UI Grid natively supports rowSpan and colSpan, making it perfect for complex layouts
 */

import type { GridState } from '@/entities/grid'

/**
 * Generates Chakra UI Grid code from grid state
 * Uses Grid container with GridItem components that support rowSpan and colSpan
 */
export function generateChakraUICode(gridState: GridState): string {
  const { config, items } = gridState

  // Convert gap to Chakra UI spacing (Chakra UI spacing is typically 4px units)
  const gap = Math.round(config.gap / 4) || 4

  if (items.length === 0) {
    return `import { Grid, GridItem, Box } from "@chakra-ui/react"

/**
 * Grid component generated from visual editor
 * Grid configuration: ${config.columns} columns × ${config.rows} rows, ${config.gap}px gap
 */
const Demo = () => {
  return (
    <Grid
      templateRows={\`repeat(${config.rows}, 1fr)\`}
      templateColumns={\`repeat(${config.columns}, 1fr)\`}
      gap={${gap}}
    >
      {/* Add grid items here */}
    </Grid>
  )
}

export default Demo`
  }

  // Sort items by row start, then column start for consistent ordering
  const sortedItems = [...items].sort((a, b) => {
    if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
    return a.colStart - b.colStart
  })

  const gridItems = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      // Chakra UI GridItem supports rowSpan and colSpan props
      // Only show rowSpan/colSpan when > 1 (matching Chakra UI convention)
      // Use gridColumnStart and gridRowStart for explicit positioning
      const props = [
        item.rowSpan > 1 && `rowSpan={${item.rowSpan}}`,
        item.colSpan > 1 && `colSpan={${item.colSpan}}`,
        item.colStart > 1 && `gridColumnStart={${item.colStart}}`,
        item.rowStart > 1 && `gridRowStart={${item.rowStart}}`,
      ]
        .filter(Boolean)
        .join(' ')
      
      return `      <GridItem${props ? ` ${props}` : ''}>
        <Box>Item ${itemNumber}</Box>
      </GridItem>`
    })
    .join('\n')

  return `import { Grid, GridItem, Box } from "@chakra-ui/react"

/**
 * Grid component generated from visual editor
 * Grid configuration: ${config.columns} columns × ${config.rows} rows, ${config.gap}px gap
 * Contains ${items.length} item${items.length !== 1 ? 's' : ''}
 */
const Demo = () => {
  return (
    <Grid
      templateRows={\`repeat(${config.rows}, 1fr)\`}
      templateColumns={\`repeat(${config.columns}, 1fr)\`}
      gap={${gap}}
    >
${gridItems}
    </Grid>
  )
}

export default Demo`
}
