/**
 * Grid domain model types
 * Core business entities for the grid generator
 */

/**
 * Grid configuration - defines the grid structure
 */
export interface GridConfig {
  /** Number of columns in the grid */
  columns: number
  /** Number of rows in the grid */
  rows: number
  /** Gap between grid items (in pixels) */
  gap: number
}

/**
 * Grid item - represents a single item in the grid
 */
export interface GridItem {
  /** Unique identifier for the item */
  id: string
  /** Column start position (1-based, CSS Grid style) */
  colStart: number
  /** Number of columns the item spans */
  colSpan: number
  /** Row start position (1-based, CSS Grid style) */
  rowStart: number
  /** Number of rows the item spans */
  rowSpan: number
}

/**
 * Complete grid state - combines config and items
 */
export interface GridState {
  /** Grid configuration */
  config: GridConfig
  /** Array of grid items */
  items: GridItem[]
}

/**
 * Grid preset - pre-configured grid layouts
 */
export interface GridPreset {
  /** Preset name */
  name: string
  /** Preset description */
  description: string
  /** Grid state for this preset */
  state: GridState
}

