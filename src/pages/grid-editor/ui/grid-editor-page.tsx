'use client'

import { useState, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { GridCanvas } from '@/widgets/grid-canvas'
import { GridControls } from '@/features/grid-controls'
import {
  generateMaterialUICode,
  generateRawCSSCode,
  generateTailwindCode,
  generateMantineCode,
  generateAntDesignCode,
  CodeOutput,
} from '@/features/code-generator'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui'
import { Button, Checkbox } from '@/shared/ui'
import { ThemeToggle } from '@/features/theme-toggle'
import { LanguageToggle } from '@/features/language-toggle'
import {
  createDefaultGridState,
  generateGridItemId,
  clampGridItem,
  isValidGridItem,
  type GridState,
  type GridItem,
} from '@/entities/grid'
import { DEFAULT_TECHNOLOGY, type Technology } from '@/shared/types/routing'

type CodeGeneratorType = Technology

type CodeFormat = 'jsx' | 'html'

interface GridEditorPageProps {
  technology?: Technology
}

const STORAGE_KEY = 'grid-editor-state'

interface PersistedState {
  gridState: GridState
  codeFormat: CodeFormat
  withStyledBorders: boolean
  withTailwind: boolean
}

function loadPersistedState(): Partial<PersistedState> | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load persisted state:', e)
  }
  return null
}

function savePersistedState(state: PersistedState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save persisted state:', e)
  }
}

function GridEditorPage({ technology: initialTechnology }: GridEditorPageProps) {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations()
  const locale = (params?.locale as string) || 'en'
  const urlTechnology = (params?.technology as Technology) || DEFAULT_TECHNOLOGY
  
  // Initialize with defaults for SSR (will be updated from localStorage on client)
  const [gridState, setGridState] = useState<GridState>(createDefaultGridState())
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [codeGeneratorType, setCodeGeneratorType] = useState<CodeGeneratorType>(
    initialTechnology || urlTechnology || DEFAULT_TECHNOLOGY
  )
  const [codeFormat, setCodeFormat] = useState<CodeFormat>('jsx')
  const [withStyledBorders, setWithStyledBorders] = useState(true)
  const [withTailwind, setWithTailwind] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Load persisted state only on client after mount (prevents hydration mismatch)
  useEffect(() => {
    const persistedState = loadPersistedState()
    if (persistedState) {
      if (persistedState.gridState) {
        setGridState(persistedState.gridState)
      }
      if (persistedState.codeFormat) {
        setCodeFormat(persistedState.codeFormat)
      }
      if (persistedState.withStyledBorders !== undefined) {
        setWithStyledBorders(persistedState.withStyledBorders)
      }
      if (persistedState.withTailwind !== undefined) {
        setWithTailwind(persistedState.withTailwind)
      }
    }
    setIsHydrated(true)
  }, [])
  
  // Persist state whenever it changes (only after hydration to avoid saving defaults)
  useEffect(() => {
    if (isHydrated) {
      savePersistedState({
        gridState,
        codeFormat,
        withStyledBorders,
        withTailwind,
      })
    }
  }, [gridState, codeFormat, withStyledBorders, withTailwind, isHydrated])
  
  useEffect(() => {
    if (urlTechnology && urlTechnology !== codeGeneratorType) {
      setCodeGeneratorType(urlTechnology)
    }
  }, [urlTechnology, codeGeneratorType])

  const hasVerticalItems = useMemo(() => {
    return gridState.items.some(item => item.rowSpan > 1)
  }, [gridState.items])

  const handleTechnologyChange = (tech: Technology) => {
    setCodeGeneratorType(tech)
    router.push(`/${locale}/${tech}`)
  }

  const generatedCode = useMemo(() => {
    const options = {
      withStyledBorders,
      withTailwind,
    }
    switch (codeGeneratorType) {
      case 'material-ui':
        return generateMaterialUICode(gridState, options)
      case 'mantine':
        return generateMantineCode(gridState, options)
      case 'ant-design':
        return generateAntDesignCode(gridState, options)
      case 'raw-css':
        return generateRawCSSCode(gridState, codeFormat, { withStyledBorders })
      case 'tailwind':
        return generateTailwindCode(gridState, codeFormat, { withStyledBorders })
      default:
        return generateMaterialUICode(gridState, options)
    }
  }, [gridState, codeGeneratorType, codeFormat, withStyledBorders, withTailwind])

  const handleConfigChange = (config: GridState['config']) => {
    const validItems = gridState.items
      .map((item) => {
        const clamped = clampGridItem(item, config)
        return isValidGridItem(clamped, config) ? clamped : null
      })
      .filter((item): item is GridItem => item !== null)

    setGridState({
      config,
      items: validItems,
    })
  }

  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId === selectedItemId ? null : itemId)
  }

  const handleEmptyCellClick = (col: number, row: number) => {
    const newItem = {
      id: generateGridItemId(),
      colStart: col,
      colSpan: 1,
      rowStart: row,
      rowSpan: 1,
    }
    setGridState({
      ...gridState,
      items: [...gridState.items, newItem],
    })
    setSelectedItemId(newItem.id)
  }

  const handleItemChange = (itemId: string, updatedItem: GridItem) => {
    setGridState({
      ...gridState,
      items: gridState.items.map((item) => (item.id === itemId ? updatedItem : item)),
    })
  }

  const handleDeleteItem = () => {
    if (selectedItemId) {
      setGridState({
        ...gridState,
        items: gridState.items.filter((item) => item.id !== selectedItemId),
      })
      setSelectedItemId(null)
    }
  }

  const handleResetGrid = () => {
    setGridState({
      ...gridState,
      items: [],
    })
    setSelectedItemId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {t('header.title')}
              </h1>
              {/* <p className="text-sm text-muted-foreground mt-2">
                {t('header.subtitle')}
              </p> */}
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="flex flex-col gap-8">
          <Card className="p-0 bg-transparent border-none">
            <CardContent>
              <div className="flex flex-col gap-6 md:grid md:grid-cols-[1fr_2.5fr]">
                <div>
                  <GridControls 
                    className='flex flex-col gap-4 justify-between h-full'
                    config={gridState.config} 
                    onConfigChange={handleConfigChange}
                    onReset={handleResetGrid}
                    selectedItemId={selectedItemId}
                    onItemDelete={handleDeleteItem}
                  />
                </div>
                
                <div className="flex justify-center rounded-lg">
                  <GridCanvas
                    gridState={gridState}
                    containerWidth={800}
                    containerHeight={600}
                    onItemClick={handleItemClick}
                    onEmptyCellClick={handleEmptyCellClick}
                    onItemChange={handleItemChange}
                    selectedItemId={selectedItemId}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="flex flex-col min-h-0 bg-transparent border-none">
            <CardContent className="flex-1 flex flex-col min-h-0 gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={codeGeneratorType === 'raw-css' ? 'default' : 'outline'}
                    onClick={() => handleTechnologyChange('raw-css')}
                  >
                    {t('technologies.raw-css')}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={codeGeneratorType === 'tailwind' ? 'default' : 'outline'}
                    onClick={() => handleTechnologyChange('tailwind')}
                  >
                    {t('technologies.tailwind')}
                  </Button>
                  <Button
                    size="sm"
                    variant={codeGeneratorType === 'material-ui' ? 'default' : 'outline'}
                    onClick={() => handleTechnologyChange('material-ui')}
                  >
                    {t('technologies.material-ui')}
                  </Button>
                  <Button
                    size="sm"
                    variant={codeGeneratorType === 'ant-design' ? 'default' : 'outline'}
                    onClick={() => handleTechnologyChange('ant-design')}
                  >
                    {t('technologies.ant-design')}
                  </Button>
                  <Button
                    size="sm"
                    variant={codeGeneratorType === 'mantine' ? 'default' : 'outline'}
                    onClick={() => handleTechnologyChange('mantine')}
                  >
                    {t('technologies.mantine')}
                  </Button>
                </div>
              </div>
              {(codeGeneratorType === 'raw-css' || codeGeneratorType === 'tailwind') && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={codeFormat === 'jsx' ? 'default' : 'outline'}
                    onClick={() => setCodeFormat('jsx')}
                  >
                    {t('formats.jsx')}
                  </Button>
                  <Button
                    size="sm"
                    variant={codeFormat === 'html' ? 'default' : 'outline'}
                    onClick={() => setCodeFormat('html')}
                  >
                    {t('formats.html')}
                  </Button>
                </div>
              )}
              {(codeGeneratorType === 'material-ui' || codeGeneratorType === 'ant-design' || codeGeneratorType === 'mantine') && (
                <div className="flex gap-4">
                  <Checkbox
                    id="with-styled-borders"
                    checked={withStyledBorders}
                    onChange={(e) => setWithStyledBorders(e.target.checked)}
                    label={t('options.withStyledBorders')}
                  />
                  {hasVerticalItems && (
                    <Checkbox
                      id="with-tailwind"
                      checked={withTailwind}
                      onChange={(e) => setWithTailwind(e.target.checked)}
                      label={t('options.withTailwind')}
                    />
                  )}
                </div>
              )}
              {(codeGeneratorType === 'raw-css' || codeGeneratorType === 'tailwind') && (
                <div className="flex gap-4">
                  <Checkbox
                    id="with-styled-borders-css"
                    checked={withStyledBorders}
                    onChange={(e) => setWithStyledBorders(e.target.checked)}
                    label={t('options.withStyledBorders')}
                  />
                </div>
              )}
              <CodeOutput
                code={generatedCode}
                language={codeFormat === 'html' || codeGeneratorType === 'raw-css' ? 'html' : 'tsx'}
                className="flex-1"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export { GridEditorPage }

