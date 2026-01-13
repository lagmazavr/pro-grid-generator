/**
 * Grid entity - single entry point
 * Exports all public types and utilities
 */

// Types
export type {
  GridConfig,
  GridItem,
  GridState,
  GridPreset,
} from './model/types'

// Utilities
export {
  createGridItem,
  createDefaultGridConfig,
  createDefaultGridState,
  isValidGridItem,
  itemsOverlap,
  generateGridItemId,
  clampGridItem,
} from './model/utils'

