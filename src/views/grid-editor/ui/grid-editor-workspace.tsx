'use client'

import {
  GridActions,
  type GridConfig,
  type GridItem,
  type GridState,
} from '@/entities/grid'
import { GridControls } from '@/features/grid-controls'
import { Card, CardContent } from '@/shared/ui'
import { GridCanvas } from '@/widgets/grid-canvas'

interface GridEditorWorkspaceProps {
  gridState: GridState
  selectedItemId: string | null
  onConfigChange: (config: GridConfig) => void
  onItemClick: (itemId: string) => void
  onEmptyCellClick: (col: number, row: number) => void
  onItemChange: (itemId: string, item: GridItem) => void
  onReset: () => void
  onItemDelete: () => void
}

function GridEditorWorkspace({
  gridState,
  selectedItemId,
  onConfigChange,
  onItemClick,
  onEmptyCellClick,
  onItemChange,
  onReset,
  onItemDelete,
}: GridEditorWorkspaceProps) {
  return (
    <Card className="!p-0 bg-transparent border-none">
      <CardContent>
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_2.5fr]">
          <div>
            <GridControls
              className="flex flex-col gap-4 justify-between h-full"
              config={gridState.config}
              onConfigChange={onConfigChange}
              onReset={onReset}
              selectedItemId={selectedItemId}
              onItemDelete={onItemDelete}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-center rounded-lg w-full overflow-hidden">
              <GridCanvas
                gridState={gridState}
                onItemClick={onItemClick}
                onEmptyCellClick={onEmptyCellClick}
                onItemChange={onItemChange}
                selectedItemId={selectedItemId}
              />
            </div>
            <div className="lg:hidden">
              <GridActions
                onReset={onReset}
                selectedItemId={selectedItemId}
                onItemDelete={onItemDelete}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { GridEditorWorkspace }
