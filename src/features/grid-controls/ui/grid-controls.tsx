/**
 * Grid controls feature
 * UI controls for adjusting grid configuration (columns, rows, gap)
 */

import { Input } from '@/shared/ui'
import type { GridConfig } from '@/entities/grid'

interface GridControlsProps {
  /** Current grid configuration */
  config: GridConfig
  /** Callback when configuration changes */
  onConfigChange: (config: GridConfig) => void
  /** Additional class name */
  className?: string
}

/**
 * GridControls - Controls for grid configuration
 * Allows users to adjust columns, rows, and gap
 */
function GridControls({ config, onConfigChange, className }: GridControlsProps) {
  const handleColumnsChange = (value: string) => {
    const columns = Math.max(1, Math.min(24, parseInt(value, 10) || 1))
    onConfigChange({ ...config, columns })
  }

  const handleRowsChange = (value: string) => {
    const rows = Math.max(1, Math.min(24, parseInt(value, 10) || 1))
    onConfigChange({ ...config, rows })
  }

  const handleGapChange = (value: string) => {
    const gap = Math.max(0, Math.min(100, parseInt(value, 10) || 0))
    onConfigChange({ ...config, gap })
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-4">
        {/* Columns control */}
        <div className="flex flex-col gap-2">
          <label htmlFor="grid-columns" className="text-sm font-medium text-foreground">
            Columns
          </label>
          <Input
            id="grid-columns"
            type="number"
            min={1}
            max={24}
            value={config.columns}
            onChange={(e) => handleColumnsChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Rows control */}
        <div className="flex flex-col gap-2">
          <label htmlFor="grid-rows" className="text-sm font-medium text-foreground">
            Rows
          </label>
          <Input
            id="grid-rows"
            type="number"
            min={1}
            max={24}
            value={config.rows}
            onChange={(e) => handleRowsChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Gap control */}
        <div className="flex flex-col gap-2">
          <label htmlFor="grid-gap" className="text-sm font-medium text-foreground">
            Gap (px)
          </label>
          <Input
            id="grid-gap"
            type="number"
            min={0}
            max={100}
            value={config.gap}
            onChange={(e) => handleGapChange(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

export { GridControls }

