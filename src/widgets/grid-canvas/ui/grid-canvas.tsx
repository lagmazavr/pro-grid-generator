/**
 * GridCanvas widget
 * Visual grid editor with CSS Grid rendering and grid lines
 * Supports drag and resize functionality
 */

import { useMemo, useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/shared/lib'
import type { GridState, GridItem } from '@/entities/grid'
import { itemsOverlap, isValidGridItem } from '@/entities/grid'

interface GridCanvasProps {
  /** Grid state to render */
  gridState: GridState
  /** Canvas container width */
  containerWidth?: number
  /** Canvas container height */
  containerHeight?: number
  /** Callback when an item is clicked */
  onItemClick?: (itemId: string) => void
  /** Callback when an empty cell is clicked */
  onEmptyCellClick?: (col: number, row: number) => void
  /** Callback when an item is moved or resized */
  onItemChange?: (itemId: string, item: GridItem) => void
  /** Selected item ID */
  selectedItemId?: string | null
  /** Class name for the canvas container */
  className?: string
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null

/**
 * GridCanvas - Visual grid editor widget
 * Renders a CSS Grid-based canvas with visual grid lines and items
 */
function GridCanvas({
  gridState,
  containerWidth = 800,
  containerHeight = 600,
  onItemClick,
  onEmptyCellClick,
  onItemChange,
  selectedItemId,
  className,
}: GridCanvasProps) {
  const { config, items } = gridState
  const containerRef = useRef<HTMLDivElement>(null)
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null)
  const [dragStart, setDragStart] = useState<{ x: number; y: number; colStart: number; rowStart: number } | null>(null)
  const [resizeStart, setResizeStart] = useState<{ item: GridItem; x: number; y: number } | null>(null)

  // Calculate cell size based on container dimensions and grid config
  const cellSize = useMemo(() => {
    const cellWidth = (containerWidth - config.gap * (config.columns - 1)) / config.columns
    const cellHeight = (containerHeight - config.gap * (config.rows - 1)) / config.rows
    return { width: cellWidth, height: cellHeight }
  }, [containerWidth, containerHeight, config.columns, config.rows, config.gap])

  // Convert pixel coordinates to grid position
  const pixelToGrid = useCallback(
    (x: number, y: number) => {
      const padding = 8
      const adjustedX = x - padding
      const adjustedY = y - padding

      const col = Math.round(adjustedX / (cellSize.width + config.gap)) + 1
      const row = Math.round(adjustedY / (cellSize.height + config.gap)) + 1

      return {
        col: Math.max(1, Math.min(col, config.columns)),
        row: Math.max(1, Math.min(row, config.rows)),
      }
    },
    [cellSize, config.gap, config.columns, config.rows]
  )

  // Check if a cell is occupied by any item
  const isCellOccupied = useMemo(() => {
    const occupied = new Set<string>()
    items.forEach((item) => {
      for (let row = item.rowStart; row < item.rowStart + item.rowSpan; row++) {
        for (let col = item.colStart; col < item.colStart + item.colSpan; col++) {
          occupied.add(`${col}-${row}`)
        }
      }
    })
    return occupied
  }, [items])

  // Check if a proposed item position/size would collide with other items (excluding the item being moved/resized)
  const wouldCollide = useCallback(
    (proposedItem: GridItem, excludeItemId?: string): boolean => {
      if (!isValidGridItem(proposedItem, config)) {
        return true
      }

      return items.some((item) => {
        if (item.id === excludeItemId) return false
        return itemsOverlap(proposedItem, item)
      })
    },
    [items, config]
  )

  // Calculate item styles for each grid item
  const itemStyles = useMemo(() => {
    return items.map((item) => {
      const left = (item.colStart - 1) * (cellSize.width + config.gap)
      const top = (item.rowStart - 1) * (cellSize.height + config.gap)
      const width = item.colSpan * cellSize.width + (item.colSpan - 1) * config.gap
      const height = item.rowSpan * cellSize.height + (item.rowSpan - 1) * config.gap

      return {
        item,
        style: {
          position: 'absolute' as const,
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        },
      }
    })
  }, [items, cellSize, config.gap])

  // Handle cell click
  const handleCellClick = (col: number, row: number) => {
    const cellKey = `${col}-${row}`
    if (!isCellOccupied.has(cellKey)) {
      onEmptyCellClick?.(col, row)
    }
  }

  // Handle mouse down on item
  const handleItemMouseDown = useCallback(
    (e: React.MouseEvent, item: GridItem) => {
      if (e.button !== 0) return // Only handle left mouse button

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const startX = e.clientX - rect.left
      const startY = e.clientY - rect.top

      setDraggedItemId(item.id)
      setDragStart({
        x: startX,
        y: startY,
        colStart: item.colStart,
        rowStart: item.rowStart,
      })

      e.preventDefault()
      e.stopPropagation()
    },
    []
  )

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return

      // Handle drag
      if (draggedItemId && dragStart) {
        const rect = containerRef.current.getBoundingClientRect()
        const currentX = e.clientX - rect.left
        const currentY = e.clientY - rect.top

        const currentPos = pixelToGrid(currentX, currentY)
        const item = items.find((i) => i.id === draggedItemId)
        if (!item) return

        const startGridPos = pixelToGrid(dragStart.x, dragStart.y)
        const deltaCol = currentPos.col - startGridPos.col
        const deltaRow = currentPos.row - startGridPos.row

        const newColStart = Math.max(1, Math.min(dragStart.colStart + deltaCol, config.columns - item.colSpan + 1))
        const newRowStart = Math.max(1, Math.min(dragStart.rowStart + deltaRow, config.rows - item.rowSpan + 1))

        // Check if the new position would collide with other items
        const proposedItem: GridItem = {
          ...item,
          colStart: newColStart,
          rowStart: newRowStart,
        }

        if (!wouldCollide(proposedItem, draggedItemId)) {
          if (newColStart !== item.colStart || newRowStart !== item.rowStart) {
            onItemChange?.(draggedItemId, proposedItem)
          }
        }
        return
      }

      // Handle resize
      if (resizeHandle && resizeStart) {
        const rect = containerRef.current.getBoundingClientRect()
        const currentX = e.clientX - rect.left
        const currentY = e.clientY - rect.top

        const currentPos = pixelToGrid(currentX, currentY)
        // Get current item state from items array (may have been updated)
        const currentItem = items.find((i) => i.id === resizeStart.item.id)
        if (!currentItem) return

        // Use initial item state for resize calculations (prevents cumulative errors)
        const initialItem = resizeStart.item
        let newColStart = initialItem.colStart
        let newRowStart = initialItem.rowStart
        let newColSpan = initialItem.colSpan
        let newRowSpan = initialItem.rowSpan

        // Calculate new bounds based on resize handle
        switch (resizeHandle) {
          case 'nw':
            newColStart = Math.max(1, Math.min(currentPos.col, initialItem.colStart + initialItem.colSpan - 1))
            newRowStart = Math.max(1, Math.min(currentPos.row, initialItem.rowStart + initialItem.rowSpan - 1))
            newColSpan = initialItem.colStart + initialItem.colSpan - newColStart
            newRowSpan = initialItem.rowStart + initialItem.rowSpan - newRowStart
            break
          case 'ne':
            newRowStart = Math.max(1, Math.min(currentPos.row, initialItem.rowStart + initialItem.rowSpan - 1))
            newColSpan = Math.max(1, Math.min(currentPos.col - initialItem.colStart + 1, config.columns - initialItem.colStart + 1))
            newRowSpan = initialItem.rowStart + initialItem.rowSpan - newRowStart
            break
          case 'sw':
            newColStart = Math.max(1, Math.min(currentPos.col, initialItem.colStart + initialItem.colSpan - 1))
            newColSpan = initialItem.colStart + initialItem.colSpan - newColStart
            newRowSpan = Math.max(1, Math.min(currentPos.row - initialItem.rowStart + 1, config.rows - initialItem.rowStart + 1))
            break
          case 'se':
            newColSpan = Math.max(1, Math.min(currentPos.col - initialItem.colStart + 1, config.columns - initialItem.colStart + 1))
            newRowSpan = Math.max(1, Math.min(currentPos.row - initialItem.rowStart + 1, config.rows - initialItem.rowStart + 1))
            break
          case 'n':
            newRowStart = Math.max(1, Math.min(currentPos.row, initialItem.rowStart + initialItem.rowSpan - 1))
            newRowSpan = initialItem.rowStart + initialItem.rowSpan - newRowStart
            break
          case 's':
            newRowSpan = Math.max(1, Math.min(currentPos.row - initialItem.rowStart + 1, config.rows - initialItem.rowStart + 1))
            break
          case 'e':
            newColSpan = Math.max(1, Math.min(currentPos.col - initialItem.colStart + 1, config.columns - initialItem.colStart + 1))
            break
          case 'w':
            newColStart = Math.max(1, Math.min(currentPos.col, initialItem.colStart + initialItem.colSpan - 1))
            newColSpan = initialItem.colStart + initialItem.colSpan - newColStart
            break
        }

        // Ensure minimum size of 1x1
        if (newColSpan < 1 || newRowSpan < 1) return

        // Ensure the item stays within grid bounds
        if (newColStart + newColSpan - 1 > config.columns || newRowStart + newRowSpan - 1 > config.rows) return

        // Check if the new size/position would collide with other items
        const proposedItem: GridItem = {
          ...initialItem,
          colStart: newColStart,
          rowStart: newRowStart,
          colSpan: newColSpan,
          rowSpan: newRowSpan,
        }

        if (!wouldCollide(proposedItem, initialItem.id)) {
          if (
            newColStart !== currentItem.colStart ||
            newRowStart !== currentItem.rowStart ||
            newColSpan !== currentItem.colSpan ||
            newRowSpan !== currentItem.rowSpan
          ) {
            onItemChange?.(initialItem.id, proposedItem)
          }
        }
      }
    },
    [draggedItemId, dragStart, resizeHandle, resizeStart, items, pixelToGrid, config, wouldCollide, onItemChange]
  )

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setDraggedItemId(null)
    setResizeHandle(null)
    setDragStart(null)
    setResizeStart(null)
  }, [])

  // Add global mouse event listeners
  useEffect(() => {
    if (draggedItemId || resizeHandle) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [draggedItemId, resizeHandle, handleMouseMove, handleMouseUp])

  // Handle resize handle mouse down
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, handle: ResizeHandle, item: GridItem) => {
      if (e.button !== 0 || !handle) return
      e.stopPropagation()
      e.preventDefault()

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const startX = e.clientX - rect.left
      const startY = e.clientY - rect.top

      setResizeHandle(handle)
      setResizeStart({
        item,
        x: startX,
        y: startY,
      })
    },
    []
  )

  return (
    <div
      ref={containerRef}
      className={cn('relative bg-card border border-border rounded-lg overflow-hidden', className)}
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      {/* Grid background with lines */}
      <div
        className="absolute inset-0"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
          gridTemplateRows: `repeat(${config.rows}, 1fr)`,
          gap: `${config.gap}px`,
          padding: '8px',
        }}
      >
        {/* Render grid cells for visual grid lines */}
        {Array.from({ length: config.columns * config.rows }).map((_, index) => {
          const col = (index % config.columns) + 1
          const row = Math.floor(index / config.columns) + 1
          const cellKey = `${col}-${row}`
          const isOccupied = isCellOccupied.has(cellKey)
          return (
            <div
              key={`cell-${col}-${row}`}
              className={cn(
                'border-2 transition-colors',
                isOccupied
                  ? 'border-border/40 bg-background/60 cursor-default'
                  : 'border-border/70 bg-background/40 hover:border-primary/60 hover:bg-primary/5 cursor-pointer'
              )}
              style={{
                minWidth: 0,
                minHeight: 0,
              }}
              onClick={() => handleCellClick(col, row)}
            />
          )
        })}
      </div>

      {/* Grid items */}
      <div className="absolute inset-0 p-2 pointer-events-none">
        {itemStyles.map(({ item, style }) => {
          const isSelected = selectedItemId === item.id
          const isDragging = draggedItemId === item.id
          return (
            <div
              key={item.id}
              className={cn(
                'bg-primary/20 border-2 rounded-md transition-all pointer-events-auto relative',
                'hover:bg-primary/30 hover:border-primary/50',
                isSelected && 'bg-primary/40 border-primary ring-2 ring-primary/20',
                isDragging && 'opacity-75 cursor-move',
                !isDragging && 'cursor-move',
                'flex items-center justify-center text-xs font-medium text-foreground'
              )}
              style={style}
              onMouseDown={(e) => handleItemMouseDown(e, item)}
              onClick={(e) => {
                e.stopPropagation()
                if (!draggedItemId) {
                  onItemClick?.(item.id)
                }
              }}
            >
              {/* Resize handles - show only when selected */}
              {isSelected && (
                <>
                  {/* Corner handles */}
                  <div
                    className="absolute top-0 left-0 w-3 h-3 bg-primary border border-primary-foreground rounded-sm cursor-nw-resize z-10"
                    onMouseDown={(e) => handleResizeMouseDown(e, 'nw', item)}
                  />
                  <div
                    className="absolute top-0 right-0 w-3 h-3 bg-primary border border-primary-foreground rounded-sm cursor-ne-resize z-10"
                    onMouseDown={(e) => handleResizeMouseDown(e, 'ne', item)}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-3 h-3 bg-primary border border-primary-foreground rounded-sm cursor-sw-resize z-10"
                    onMouseDown={(e) => handleResizeMouseDown(e, 'sw', item)}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-3 h-3 bg-primary border border-primary-foreground rounded-sm cursor-se-resize z-10"
                    onMouseDown={(e) => handleResizeMouseDown(e, 'se', item)}
                  />
                </>
              )}

              <div className="text-center px-2 py-1 pointer-events-none">
                <div className="font-semibold">{item.id}</div>
                <div className="text-muted-foreground text-[10px] mt-0.5">
                  {item.colSpan}×{item.rowSpan}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
          <div className="text-center">
            <div className="text-sm font-medium mb-1">Empty Grid</div>
            <div className="text-xs">Click on cells to add items</div>
          </div>
        </div>
      )}
    </div>
  )
}

export { GridCanvas }
