import type { GridItem } from '@/entities/grid'

export function sortGridItems(items: GridItem[]): GridItem[] {
  return [...items].sort((a, b) => {
    if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
    return a.colStart - b.colStart
  })
}

export function generateTailwindGridClasses(
  item: GridItem,
  withStyledBorders: boolean
): string {
  const classes = [
    `col-span-${item.colSpan}`,
    `row-span-${item.rowSpan}`,
    item.colStart > 1 ? `col-start-${item.colStart}` : '',
    item.rowStart > 1 ? `row-start-${item.rowStart}` : '',
    withStyledBorders ? 'border border-gray-600' : '',
  ].filter(Boolean)
  
  return classes.join(' ')
}

export function generateTailwindGapClass(gap: number): string {
  return gap % 4 === 0 ? `gap-${gap / 4}` : `gap-[${gap}px]`
}

export function generateTailwindGridColsClass(columns: number): string {
  return `grid-cols-${columns}`
}

export function generateTailwindGridRowsClass(rows: number): string {
  return `grid-rows-${rows}`
}

export function generateBorderStyle(withStyledBorders: boolean): string {
  return withStyledBorders ? "border: '1px solid #4a5565'" : ''
}

export function generateBorderCSS(withStyledBorders: boolean): string {
  return withStyledBorders ? 'border: 1px solid #4a5565;' : ''
}

export function hasVerticalItems(items: GridItem[]): boolean {
  return items.some(item => item.rowSpan > 1)
}

export function calculateGridItemEnds(item: GridItem): {
  colEnd: number
  rowEnd: number
} {
  return {
    colEnd: item.colStart + item.colSpan,
    rowEnd: item.rowStart + item.rowSpan,
  }
}
