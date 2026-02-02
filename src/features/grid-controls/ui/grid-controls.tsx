'use client'

import { useTranslations } from 'next-intl'
import { Input } from '@/shared/ui'
import { GridActions } from '@/entities/grid'
import type { GridConfig } from '@/entities/grid'

interface GridControlsProps {
  config: GridConfig
  onConfigChange: (config: GridConfig) => void
  onReset?: () => void
  selectedItemId?: string | null
  onItemDelete?: () => void
  className?: string
}

function GridControls({ config, onConfigChange, onReset, selectedItemId, onItemDelete, className }: GridControlsProps) {
  const t = useTranslations()
  
  const handleColumnsChange = (value: string) => {
    if (value === '') {
      onConfigChange({ ...config, columns: 0 })
      return
    }
    const numValue = parseInt(value, 10)
    if (isNaN(numValue)) return
    const columns = Math.max(0, Math.min(12, numValue))
    onConfigChange({ ...config, columns })
  }

  const handleRowsChange = (value: string) => {
    if (value === '') {
      onConfigChange({ ...config, rows: 0 })
      return
    }
    const numValue = parseInt(value, 10)
    if (isNaN(numValue)) return
    const rows = Math.max(0, Math.min(12, numValue))
    onConfigChange({ ...config, rows })
  }

  const handleGapChange = (value: string) => {
    if (value === '') {
      onConfigChange({ ...config, gap: 0 })
      return
    }
    const numValue = parseInt(value, 10)
    if (isNaN(numValue)) return
    const gap = Math.max(0, Math.min(100, numValue))
    onConfigChange({ ...config, gap })
  }

  return (
    <div className={className}>
      <div className='flex flex-col gap-4'>
        <div className="grid grid-cols-3 sm:grid-cols-1 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="grid-columns" className="text-sm font-medium text-foreground">
              {t('common.columns')}
            </label>
            <Input
              id="grid-columns"
              type="number"
              min={0}
              max={12}
              value={config.columns}
              onChange={(e) => handleColumnsChange(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="grid-rows" className="text-sm font-medium text-foreground">
              {t('common.rows')}
            </label>
            <Input
              id="grid-rows"
              type="number"
              min={0}
              max={12}
              value={config.rows}
              onChange={(e) => handleRowsChange(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="grid-gap" className="text-sm font-medium text-foreground">
              {t('common.gap')}
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
        <div className="hidden lg:block">
          <GridActions
            onReset={onReset}
            selectedItemId={selectedItemId}
            onItemDelete={onItemDelete}
          />
        </div>
      </div>
    </div>
  )
}

export { GridControls }

