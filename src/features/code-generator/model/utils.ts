/**
 * Shared utilities for code generators
 * Common functions used across all generator implementations
 */

import type { GridItem } from '@/entities/grid'

/**
 * Sort grid items by row start, then column start for consistent ordering
 */
export function sortGridItems(items: GridItem[]): GridItem[] {
  return [...items].sort((a, b) => {
    if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
    return a.colStart - b.colStart
  })
}

/**
 * Generate Tailwind CSS classes for grid positioning
 */
export function generateTailwindGridClasses(
  item: GridItem,
  withStyledBorders: boolean
): string {
  const classes = [
    `col-span-${item.colSpan}`,
    `row-span-${item.rowSpan}`,
    item.colStart > 1 ? `col-start-${item.colStart}` : '',
    item.rowStart > 1 ? `row-start-${item.rowStart}` : '',
    withStyledBorders ? '!border !border-gray-600' : '',
  ].filter(Boolean)
  
  return classes.join(' ')
}

/**
 * Generate Tailwind gap class
 */
export function generateTailwindGapClass(gap: number): string {
  return gap % 4 === 0 ? `gap-${gap / 4}` : `gap-[${gap}px]`
}

/**
 * Generate Tailwind grid columns class
 */
export function generateTailwindGridColsClass(columns: number): string {
  return `grid-cols-${columns}`
}

/**
 * Generate Tailwind grid rows class
 */
export function generateTailwindGridRowsClass(rows: number): string {
  return `grid-rows-${rows}`
}

/**
 * Generate border style for inline styles (JSX/React)
 */
export function generateBorderStyle(withStyledBorders: boolean): string {
  return withStyledBorders ? "border: '1px solid #4a5565'," : ''
}

/**
 * Generate border CSS rule for CSS files
 */
export function generateBorderCSS(withStyledBorders: boolean): string {
  return withStyledBorders ? 'border: 1px solid #4a5565;' : ''
}

/**
 * Check if grid has vertical items (rowSpan > 1)
 */
export function hasVerticalItems(items: GridItem[]): boolean {
  return items.some(item => item.rowSpan > 1)
}

/**
 * Calculate grid item end positions
 */
export function calculateGridItemEnds(item: GridItem): {
  colEnd: number
  rowEnd: number
} {
  return {
    colEnd: item.colStart + item.colSpan,
    rowEnd: item.rowStart + item.rowSpan,
  }
}
