'use client'

import { CodeOutput } from '@/features/code-generator'
import { CodeGeneratorOptions } from '@/features/code-generator-options'
import type { CodeFormat } from '@/shared/types/code-generator'
import type { Technology } from '@/shared/types/routing'
import { Card, CardContent } from '@/shared/ui'
import { TechnologySelector } from '@/widgets/technology-selector'

interface CodeGeneratorPanelProps {
  selectedTechnology: Technology
  onTechnologyChange: (tech: Technology) => void
  codeFormat: CodeFormat
  onFormatChange: (format: CodeFormat) => void
  withStyledBorders: boolean
  onStyledBordersChange: (value: boolean) => void
  withTailwind: boolean
  onTailwindChange: (value: boolean) => void
  hasVerticalItems: boolean
  generatedCode: string
  isCodeLoading: boolean
  codeLanguage: 'tsx' | 'html'
}

function CodeGeneratorPanel({
  selectedTechnology,
  onTechnologyChange,
  codeFormat,
  onFormatChange,
  withStyledBorders,
  onStyledBordersChange,
  withTailwind,
  onTailwindChange,
  hasVerticalItems,
  generatedCode,
  isCodeLoading,
  codeLanguage,
}: CodeGeneratorPanelProps) {
  return (
    <Card className="flex flex-col min-h-0 p-0 bg-transparent border-none">
      <CardContent className="flex-1 flex flex-col min-h-0 gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TechnologySelector
            selectedTechnology={selectedTechnology}
            onTechnologyChange={onTechnologyChange}
          />
        </div>
        <CodeGeneratorOptions
          technology={selectedTechnology}
          codeFormat={codeFormat}
          onFormatChange={onFormatChange}
          withStyledBorders={withStyledBorders}
          onStyledBordersChange={onStyledBordersChange}
          withTailwind={withTailwind}
          onTailwindChange={onTailwindChange}
          hasVerticalItems={hasVerticalItems}
          className="flex flex-col gap-4"
        />
        <CodeOutput
          code={generatedCode}
          language={codeLanguage}
          isLoading={isCodeLoading}
          className="flex-1"
        />
      </CardContent>
    </Card>
  )
}

export { CodeGeneratorPanel }
