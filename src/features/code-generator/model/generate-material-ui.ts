import type { GridState } from '@/entities/grid'
import {
  sortGridItems,
  hasVerticalItems,
  generateBorderStyle,
  calculateGridItemEnds,
} from './utils'

interface GeneratorOptions {
  withStyledBorders?: boolean
}

export function generateMaterialUICode(gridState: GridState, options: GeneratorOptions = {}): string {
  const { withStyledBorders = true } = options
  const { config, items } = gridState

  const header = `// Quickstart: https://mui.com/material-ui/getting-started/installation/`

  const hasVertical = hasVerticalItems(items)
  const spacing = Math.round(config.gap / 8) || 2

  if (!hasVertical && items.length > 0) {
    const sortedItems = sortGridItems(items)
    const columnRatio = 12 / config.columns
    const borderStyle = generateBorderStyle(withStyledBorders)

    const gridItems = sortedItems
      .map((item, index) => {
        const itemNumber = index + 1
        const size = Math.round(item.colSpan * columnRatio)
        const sxProps = borderStyle ? ` sx={{ ${borderStyle} }}` : ''
        return `      <Grid size={${size}}${sxProps}>
        Item ${itemNumber}
      </Grid>`
      })
      .join('\n')

    return `${header}
import { Grid } from '@mui/material'

const MyGrid = () => {
  return (
    <Grid container spacing={${spacing}}>
${gridItems}
    </Grid>
  )
}

export default MyGrid;`
  }

  if (items.length === 0) {
    return `${header}
import { Grid } from '@mui/material'

const MyGrid = () => {
  return (
    <Grid
      container
      spacing={${spacing}}
      sx={{
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
  const borderStyle = generateBorderStyle(withStyledBorders)

  const gridItems = sortedItems
    .map((item, index) => {
      const itemNumber = index + 1
      const { colEnd, rowEnd } = calculateGridItemEnds(item)
      const sxContent = borderStyle
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
        sx={${sxContent}}
      >
        Item ${itemNumber}
      </Card>`
    })
    .join('\n')

  return `${header}
import { Box, Card } from '@mui/material'

const MyGrid = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`,
        gridTemplateRows: \`repeat(${config.rows}, 1fr)\`,
        gap: \`${config.gap}px\`,
      }}
    >
${gridItems}
    </Box>
  )
}

export default MyGrid;`
}
