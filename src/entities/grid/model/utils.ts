import type { GridConfig, GridItem, GridState } from './types'

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

export function createDefaultGridConfig(): GridConfig {
  return {
    columns: 6,
    rows: 4,
    gap: 8,
  }
}

export function createDefaultGridState(): GridState {
  return {
    config: createDefaultGridConfig(),
    items: [],
  }
}

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

export function generateGridItemId(): string {
  return `grid-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

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

