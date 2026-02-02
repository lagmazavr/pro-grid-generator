'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/shared/ui'

interface GridActionsProps {
  onReset?: () => void
  selectedItemId?: string | null
  onItemDelete?: () => void
  className?: string
}

function GridActions({ onReset, selectedItemId, onItemDelete, className }: GridActionsProps) {
  const t = useTranslations()

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
        <Button
          size="sm"
          variant="default"
          onClick={onReset}
          className={`w-full cursor-pointer ${!(selectedItemId && onItemDelete) ? 'col-span-2 sm:col-span-1' : ''}`}
        >
          {t('common.reset')}
        </Button>
        {selectedItemId && onItemDelete && (
          <Button
            size="sm"
            variant="destructive"
            onClick={onItemDelete}
            className="w-full cursor-pointer"
          >
            {t('common.deleteGridItem')}
          </Button>
        )}
      </div>
    </div>
  )
}

export { GridActions }
