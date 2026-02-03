'use client'

import { useTranslations } from 'next-intl'
import { Button, Checkbox } from '@/shared/ui'
import type { CodeFormat } from '@/shared/types/code-generator'
import type { Technology } from '@/shared/types/routing'

interface CodeGeneratorOptionsProps {
  technology: Technology
  codeFormat: CodeFormat
  onFormatChange: (format: CodeFormat) => void
  withStyledBorders: boolean
  onStyledBordersChange: (value: boolean) => void
  withTailwind: boolean
  onTailwindChange: (value: boolean) => void
  hasVerticalItems: boolean
  className?: string
}

function CodeGeneratorOptions({
  technology,
  codeFormat,
  onFormatChange,
  withStyledBorders,
  onStyledBordersChange,
  withTailwind,
  onTailwindChange,
  hasVerticalItems,
  className,
}: CodeGeneratorOptionsProps) {
  const t = useTranslations()

  const isFormatBased = technology === 'raw-css' || technology === 'tailwind'
  const isComponentBased = technology === 'material-ui' || technology === 'ant-design'
  const isMantine = technology === 'mantine'
  const showTailwindOption = isMantine && hasVerticalItems

  const showBordersOption = isFormatBased || isComponentBased || isMantine

  return (
    <div className={className}>
      {isFormatBased && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={codeFormat === 'jsx' ? 'default' : 'outline'}
            onClick={() => onFormatChange('jsx')}
          >
            {t('formats.jsx')}
          </Button>
          <Button
            size="sm"
            variant={codeFormat === 'html' ? 'default' : 'outline'}
            onClick={() => onFormatChange('html')}
          >
            {t('formats.html')}
          </Button>
        </div>
      )}

      {showBordersOption && (
        <div className="flex gap-4">
          <Checkbox
            id="with-styled-borders"
            checked={withStyledBorders}
            onChange={(e) => onStyledBordersChange(e.target.checked)}
            label={t('options.withBorders')}
          />
          {showTailwindOption && (
            <Checkbox
              id="with-tailwind"
              checked={withTailwind}
              onChange={(e) => onTailwindChange(e.target.checked)}
              label={t('options.withTailwind')}
            />
          )}
        </div>
      )}
    </div>
  )
}

export { CodeGeneratorOptions }
