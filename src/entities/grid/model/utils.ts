/**
 * Grid domain model utilities
 * Helper functions for working with grid state
 */

import type { GridConfig, GridItem, GridState } from './types'

/**
 * Creates a new grid item with default values
 */
export function createGridItem(
  id: string,
  colStart: number = 1,
  rowStart: number = 1,
  colSpan: number = 1,
  rowSpan: number = 1
): GridItem {
  return {
    id,
    colStart,
    colSpan,
    rowStart,
    rowSpan,
  }
}

/**
 * Creates default grid configuration
 */
export function createDefaultGridConfig(): GridConfig {
  return {
    columns: 12,
    rows: 6,
    gap: 16,
  }
}

/**
 * Creates default grid state
 */
export function createDefaultGridState(): GridState {
  return {
    config: createDefaultGridConfig(),
    items: [],
  }
}

/**
 * Validates if a grid item fits within the grid configuration
 */
export function isValidGridItem(item: GridItem, config: GridConfig): boolean {
  const colEnd = item.colStart + item.colSpan - 1
  const rowEnd = item.rowStart + item.rowSpan - 1

  return (
    item.colStart >= 1 &&
    item.rowStart >= 1 &&
    item.colSpan > 0 &&
    item.rowSpan > 0 &&
    colEnd <= config.columns &&
    rowEnd <= config.rows
  )
}

/**
 * Checks if two grid items overlap
 */
export function itemsOverlap(item1: GridItem, item2: GridItem): boolean {
  const item1ColEnd = item1.colStart + item1.colSpan - 1
  const item1RowEnd = item1.rowStart + item1.rowSpan - 1
  const item2ColEnd = item2.colStart + item2.colSpan - 1
  const item2RowEnd = item2.rowStart + item2.rowSpan - 1

  return !(
    item1ColEnd < item2.colStart ||
    item1.colStart > item2ColEnd ||
    item1RowEnd < item2.rowStart ||
    item1.rowStart > item2RowEnd
  )
}

/**
 * Generates a unique ID for a grid item
 */
export function generateGridItemId(): string {
  return `grid-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Clamps a grid item position to fit within the grid configuration
 */
export function clampGridItem(item: GridItem, config: GridConfig): GridItem {
  const colStart = Math.max(1, Math.min(item.colStart, config.columns))
  const rowStart = Math.max(1, Math.min(item.rowStart, config.rows))
  const maxColSpan = config.columns - colStart + 1
  const maxRowSpan = config.rows - rowStart + 1
  const colSpan = Math.max(1, Math.min(item.colSpan, maxColSpan))
  const rowSpan = Math.max(1, Math.min(item.rowSpan, maxRowSpan))

  return {
    ...item,
    colStart,
    rowStart,
    colSpan,
    rowSpan,
  }
}

