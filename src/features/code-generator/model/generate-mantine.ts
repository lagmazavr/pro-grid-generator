/**
 * Mantine code generator
 * Generates Mantine code using CSS Grid with Box and Paper components
 * Uses simple CSS Grid with MantineProvider wrapper
 */

import type { GridState } from '@/entities/grid'

/**
 * Generates Mantine Grid code from grid state
 * Uses Box component with CSS Grid and Paper for items
 */
export function generateMantineCode(gridState: GridState): string {
  const { config, items } = gridState

  // Check if there are any vertical items (rowSpan > 1)
  const hasVerticalItems = items.some(item => item.rowSpan > 1)

  // If no vertical items, use Mantine's native grid system
  if (!hasVerticalItems && items.length > 0) {
    const sortedItems = [...items].sort((a, b) => {
      if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
      return a.colStart - b.colStart
    })

    // Mantine Grid uses 12 columns, calculate span (each item spans config.columns/12 * colSpan)
    const columnRatio = 12 / config.columns
    const gridItems = sortedItems
      .map((item, index) => {
        const itemNumber = index + 1
        const span = Math.round(item.colSpan * columnRatio)
        return `        <Grid.Col span={${span}}>
          Item ${itemNumber}
        </Grid.Col>`
      })
      .join('\n')

    const gap = config.gap % 4 === 0 ? config.gap / 4 : `\`${config.gap}px\``

    return `import { MantineProvider, Grid } from "@mantine/core";

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
    return `import { MantineProvider, Grid } from "@mantine/core";

const MyGrid = () => {
  return (
    <MantineProvider>
      <Grid
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(${config.columns}, 1fr)",
          gridTemplateRows: "repeat(${config.rows}, 1fr)",
          gap: \`${config.gap}px\`,
        }}
      >
        {/* Add grid items here */}
      </Grid>
    </MantineProvider>
  );
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
      return `        <Grid.Col style={{ gridColumnStart: ${item.colStart}, gridColumnEnd: ${colEnd}, gridRowStart: ${item.rowStart}, gridRowEnd: ${rowEnd} }}>
          Item ${itemNumber}
        </Grid.Col>`
    })
    .join('\n')

  return `import { MantineProvider, Grid } from "@mantine/core";

const MyGrid = () => {
  return (
    <MantineProvider>
      <Grid
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(${config.columns}, 1fr)",
          gridTemplateRows: "repeat(${config.rows}, 1fr)",
          gap: \`${config.gap}px\`,
        }}
      >
${gridItems}
      </Grid>
    </MantineProvider>
  );
}

export default MyGrid;`
}
