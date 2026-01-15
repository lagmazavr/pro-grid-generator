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

  if (items.length === 0) {
    return `import { MantineProvider, Box, Paper } from "@mantine/core";

export default function App() {
  return (
    <MantineProvider>
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(${config.columns}, 1fr)",
          gridTemplateRows: "repeat(${config.rows}, 1fr)",
          gap: ${config.gap},
        }}
      >
        {/* Add grid items here */}
      </Box>
    </MantineProvider>
  );
}`
  }

  // Sort items by row start, then column start for consistent ordering
  const sortedItems = [...items].sort((a, b) => {
    if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
    return a.colStart - b.colStart
  })

  const gridItems = sortedItems
    .map((item) => {
      const colEnd = item.colStart + item.colSpan
      const rowEnd = item.rowStart + item.rowSpan
      return `        <Box style={{ gridColumn: "${item.colStart} / ${colEnd}", gridRow: "${item.rowStart} / ${rowEnd}" }}>
          <Paper withBorder p="md">${item.colSpan}×${item.rowSpan}</Paper>
        </Box>`
    })
    .join('\n')

  return `import { MantineProvider, Box, Paper } from "@mantine/core";

export default function App() {
  return (
    <MantineProvider>
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(${config.columns}, 1fr)",
          gridTemplateRows: "repeat(${config.rows}, 1fr)",
          gap: ${config.gap},
        }}
      >
${gridItems}
      </Box>
    </MantineProvider>
  );
}`
}
