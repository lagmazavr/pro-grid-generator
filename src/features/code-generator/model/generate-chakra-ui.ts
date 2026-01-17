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

  // Check if there are any vertical items (rowSpan > 1)
  const hasVerticalItems = items.some(item => item.rowSpan > 1)

  // Convert gap to Chakra UI spacing (Chakra UI spacing is typically 4px units)
  const gap = Math.round(config.gap / 4) || 4

  // If no vertical items, use Chakra UI's native grid system
  if (!hasVerticalItems && items.length > 0) {
    const sortedItems = [...items].sort((a, b) => {
      if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
      return a.colStart - b.colStart
    })

    const gridItems = sortedItems
      .map((item, index) => {
        const itemNumber = index + 1
        return `      <GridItem colSpan={${item.colSpan}}>
        Item ${itemNumber}
      </GridItem>`
      })
      .join('\n')

    return `import { Grid, GridItem } from "@chakra-ui/react"

const MyGrid = () => {
  return (
    <Grid templateColumns={\`repeat(${config.columns}, 1fr)\`} gap={${gap}}>
${gridItems}
    </Grid>
  )
}

export default MyGrid;`
  }

  if (items.length === 0) {
    return `import { Grid, GridItem } from "@chakra-ui/react"

const MyGrid = () => {
  return (
    <Grid
      style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`,
        gridTemplateRows: \`repeat(${config.rows}, 1fr)\`,
        gap: \`${config.gap}px\`,
      }}
    >
      {/* Add grid items here */}
    </Grid>
  )
}

export default MyGrid;`
  }

  // Sort items by row start, then column start for consistent ordering
  const sortedItems = [...items].sort((a, b) => {
    if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
    return a.colStart - b.colStart
  })

  const gridItems = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      const colEnd = item.colStart + item.colSpan
      const rowEnd = item.rowStart + item.rowSpan
      return `      <GridItem
        style={{
          gridColumnStart: ${item.colStart},
          gridColumnEnd: ${colEnd},
          gridRowStart: ${item.rowStart},
          gridRowEnd: ${rowEnd},
        }}
      >
        Item ${itemNumber}
      </GridItem>`
    })
    .join('\n')

  return `import { Grid, GridItem } from "@chakra-ui/react"

const MyGrid = () => {
  return (
    <Grid
      style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`,
        gridTemplateRows: \`repeat(${config.rows}, 1fr)\`,
        gap: \`${config.gap}px\`,
      }}
    >
${gridItems}
    </Grid>
  )
}

export default MyGrid;`
}
