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

export function generateMaterialUICode(gridState: GridState, options: GeneratorOptions = {}): string {
  const { withStyledBorders = true, withTailwind = false } = options
  const { config, items } = gridState

  const header = `// Quickstart: https://mui.com/material-ui/getting-started/installation/`

  const hasVertical = hasVerticalItems(items)
  const spacing = Math.round(config.gap / 8) || 2

  if (!hasVertical && items.length > 0) {
    const sortedItems = sortGridItems(items)
    const columnRatio = 12 / config.columns
    const borderStyle = generateBorderStyle(withStyledBorders)
    
    if (withTailwind) {
      const gapClass = generateTailwindGapClass(config.gap)
      const gridItems = sortedItems
        .map((item, index) => {
          const itemNumber = index + 1
          const size = Math.round(item.colSpan * columnRatio)
          const borderClass = withStyledBorders ? '!border !border-gray-600' : ''
          const classes = `col-span-${size} ${borderClass}`.trim()
          return `      <Card className="${classes}">
        Item ${itemNumber}
      </Card>`
        })
        .join('\n')

      return `${header}
import { Box, Card } from '@mui/material'

const MyGrid = () => {
  return (
    <Box className="grid grid-cols-12 ${gapClass}">
${gridItems}
    </Box>
  )
}

export default MyGrid;`
    }
    
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
    const gapClass = generateTailwindGapClass(config.gap)
    const gridColsClass = generateTailwindGridColsClass(config.columns)
    const gridRowsClass = generateTailwindGridRowsClass(config.rows)
    const containerSx = withTailwind
      ? `className="grid ${gridColsClass} ${gridRowsClass} ${gapClass}"`
      : `sx={{
          display: 'grid',
          gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`,
          gridTemplateRows: \`repeat(${config.rows}, 1fr)\`,
          gap: \`${config.gap}px\`,
        }}`
    
    if (withTailwind) {
      return `${header}
import { Box } from '@mui/material'

const MyGrid = () => {
  return (
    <Box className="grid ${gridColsClass} ${gridRowsClass} ${gapClass}">
      {/* Grid items code will appear here */}
    </Box>
  )
}

export default MyGrid;`
    }
    return `${header}
import { Grid } from '@mui/material'

const MyGrid = () => {
  return (
    <Grid
      container
      spacing={${spacing}}
      ${containerSx}
    >
      {/* Grid items code will appear here */}
    </Grid>
  )
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
      }
    })
    .join('\n')

  const containerSx = withTailwind
    ? `className="grid ${gridColsClass} ${gridRowsClass} ${gapClass}"`
    : `sx={{
        display: 'grid',
        gridTemplateColumns: \`repeat(${config.columns}, 1fr)\`,
        gridTemplateRows: \`repeat(${config.rows}, 1fr)\`,
        gap: \`${config.gap}px\`,
      }}`

  if (withTailwind) {
    return `${header}
import { Box, Card } from '@mui/material'

const MyGrid = () => {
  return (
    <Box className="grid ${gridColsClass} ${gridRowsClass} ${gapClass}">
${gridItems}
    </Box>
  )
}

export default MyGrid;`
  }
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
