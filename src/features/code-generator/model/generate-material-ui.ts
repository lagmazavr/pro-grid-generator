/**
 * Material UI code generator
 * Generates clean, copy-ready code for Material UI Grid v2
 * Uses container / item / xs props
 */

import type { GridState } from '@/entities/grid'

/**
 * Generates Material UI Grid v2 code from grid state
 * Uses Grid2 component with container/item/xs props
 */
export function generateMaterialUICode(gridState: GridState): string {
  const { config, items } = gridState

  if (items.length === 0) {
    return `import Grid2 from '@mui/material/Grid2'

function MyGrid() {
  return (
    <Grid2 container spacing={${config.gap}}>
      {/* Add grid items here */}
    </Grid2>
  )
}

export default MyGrid`
  }

  // Material UI Grid v2 uses xs prop for span
  // 12 columns is the default, so we need to calculate span as a percentage
  // Material UI uses a 12-column system, so we map our columns to 12
  const colSpanMultiplier = 12 / config.columns

  const gridItems = items
    .map((item) => {
      // Calculate xs span (Material UI uses 12-column system)
      const xsSpan = Math.round(item.colSpan * colSpanMultiplier)
      // For positioning, we use sx prop with gridColumn
      const gridColumnStart = item.colStart
      const gridColumnSpan = item.colSpan

      return `      <Grid2 
        item 
        xs={${xsSpan}}
        sx={{ 
          gridColumnStart: ${gridColumnStart},
          gridColumnEnd: ${gridColumnStart + gridColumnSpan},
          gridRowStart: ${item.rowStart},
          gridRowEnd: ${item.rowStart + item.rowSpan}
        }}
      >
        Item ${item.id}
      </Grid2>`
    })
    .join('\n')

  return `import Grid2 from '@mui/material/Grid2'

function MyGrid() {
  return (
    <Grid2 
      container 
      spacing={${config.gap}}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(${config.columns}, 1fr)',
        gridTemplateRows: 'repeat(${config.rows}, 1fr)'
      }}
    >
${gridItems}
    </Grid2>
  )
}

export default MyGrid`
}

