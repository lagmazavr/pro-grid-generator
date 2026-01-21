import type { GridState } from '@/entities/grid'
import {
  sortGridItems,
  hasVerticalItems,
  calculateGridItemEnds,
} from './utils'

export function generateChakraUICode(gridState: GridState): string {
  const { config, items } = gridState

  const hasVertical = hasVerticalItems(items)
  const gap = Math.round(config.gap / 4) || 4

  if (!hasVertical && items.length > 0) {
    const sortedItems = sortGridItems(items)

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
      {/* Grid items code will appear here */}
    </Grid>
  )
}

export default MyGrid;`
  }

  const sortedItems = sortGridItems(items)

  const gridItems = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      const { colEnd, rowEnd } = calculateGridItemEnds(item)
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
