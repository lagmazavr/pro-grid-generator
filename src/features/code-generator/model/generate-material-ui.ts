/**
 * Material UI code generator
 * Generates Material UI code using Grid component with CSS Grid override
 * Matches exact layout from grid canvas using CSS Grid positioning
 */

import type { GridState } from '@/entities/grid'

/**
 * Generates Material UI Grid code from grid state
 * Uses Grid container with CSS Grid styling to match canvas layout exactly
 */
export function generateMaterialUICode(gridState: GridState): string {
  const { config, items } = gridState

  // Check if there are any vertical items (rowSpan > 1)
  const hasVerticalItems = items.some(item => item.rowSpan > 1)

  // Convert gap to spacing (Material UI spacing is typically 8px units)
  const spacing = Math.round(config.gap / 8) || 2

  // If no vertical items, use Material UI's native 12-column grid system
  if (!hasVerticalItems && items.length > 0) {
    const sortedItems = [...items].sort((a, b) => {
      if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
      return a.colStart - b.colStart
    })

    // Material UI uses 12 columns, calculate xs prop (each item spans config.columns/12 * colSpan)
    const columnRatio = 12 / config.columns
    const gridItems = sortedItems
      .map((item, index) => {
        const itemNumber = index + 1
        const xs = Math.round(item.colSpan * columnRatio)
        return `      <Grid2 size={${xs}}>
        Item ${itemNumber}
      </Grid2>`
      })
      .join('\n')

    return `import { Grid2 } from '@mui/material'

const MyGrid = () => {
  return (
    <Grid2 container spacing={${spacing}}>
${gridItems}
    </Grid2>
  )
}

export default MyGrid;`
  }

  if (items.length === 0) {
    return `import { Grid2 } from '@mui/material'

const MyGrid = () => {
  return (
    <Grid2
      container
      spacing={${spacing}}
      sx={{
        display: 'grid',
        gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`,
        gridTemplateRows: \`repeat(${config.rows}, 1fr)\`,
        gap: \`${config.gap}px\`,
      }}
    >
      {/* Add grid items here */}
    </Grid2>
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
      return `      <Grid2
        sx={{
          gridColumnStart: ${item.colStart},
          gridColumnEnd: ${colEnd},
          gridRowStart: ${item.rowStart},
          gridRowEnd: ${rowEnd},
        }}
      >
        Item ${itemNumber}
      </Grid2>`
    })
    .join('\n')

  return `import { Grid2 } from '@mui/material'

const MyGrid = () => {
  return (
    <Grid2
      container
      spacing={${spacing}}
      sx={{
        display: 'grid',
        gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`,
        gridTemplateRows: \`repeat(${config.rows}, 1fr)\`,
        gap: \`${config.gap}px\`,
      }}
    >
${gridItems}
    </Grid2>
  )
}

export default MyGrid;`
}
