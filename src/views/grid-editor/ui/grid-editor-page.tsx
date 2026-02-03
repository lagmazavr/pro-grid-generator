'use client'

import {
  clampGridItem,
  createDefaultGridState,
  generateGridItemId,
  GridActions,
  isValidGridItem,
  type GridItem,
  type GridState,
} from '@/entities/grid'
import {
  CodeOutput,
  generateAntDesignCode,
  generateMaterialUICode,
  generateMantineCode,
  generateRawCSSCode,
  generateTailwindCode,
} from '@/features/code-generator'
import { CodeGeneratorOptions } from '@/features/code-generator-options'
import { GridControls } from '@/features/grid-controls'
import { LanguageToggle } from '@/features/language-toggle'
import { ThemeToggle } from '@/features/theme-toggle'
import { DEFAULT_TECHNOLOGY, type Technology } from '@/shared/types/routing'
import { useMediaQuery } from '@/shared/lib'
import { Card, CardContent, Logo } from '@/shared/ui'
import { AppFooter } from '@/widgets/app-footer'
import { GridCanvas } from '@/widgets/grid-canvas'
import { TechnologySelector } from '@/widgets/technology-selector'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

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
  const [isCodeLoading, setIsCodeLoading] = useState(false)
  const isFirstCodeRender = useRef(true)
  const codeLoadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTabletOrDesktop = useMediaQuery('(min-width: 768px)')
  
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
    router.push(`/${locale}/${tech}`, { scroll: false })
  }

  const generatedCode = useMemo(() => {
    switch (codeGeneratorType) {
      case 'material-ui':
        return generateMaterialUICode(gridState, { withStyledBorders })
      case 'ant-design':
        return generateAntDesignCode(gridState, { withStyledBorders })
      case 'mantine':
        return generateMantineCode(gridState, {
          withStyledBorders,
          withTailwind,
        })
      case 'raw-css':
        return generateRawCSSCode(gridState, codeFormat, { withStyledBorders })
      case 'tailwind':
        return generateTailwindCode(gridState, codeFormat, { withStyledBorders })
      default:
        return generateMaterialUICode(gridState, { withStyledBorders })
    }
  }, [gridState, codeGeneratorType, codeFormat, withStyledBorders, withTailwind])

  // Brief loading state when generated code inputs change (skip first render)
  useEffect(() => {
    if (isFirstCodeRender.current) {
      isFirstCodeRender.current = false
      return
    }
    if (codeLoadingTimeoutRef.current) {
      clearTimeout(codeLoadingTimeoutRef.current)
    }
    setIsCodeLoading(true)
    codeLoadingTimeoutRef.current = setTimeout(() => {
      setIsCodeLoading(false)
      codeLoadingTimeoutRef.current = null
    }, 220)
    return () => {
      if (codeLoadingTimeoutRef.current) {
        clearTimeout(codeLoadingTimeoutRef.current)
      }
    }
  }, [generatedCode])

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
    const colSpan = isTabletOrDesktop ? 1 : 2
    const rowSpan = isTabletOrDesktop ? 1 : 2
    const colStart = Math.max(1, Math.min(col, gridState.config.columns - colSpan + 1))
    const rowStart = Math.max(1, Math.min(row, gridState.config.rows - rowSpan + 1))

    const newItem = {
      id: generateGridItemId(),
      colStart,
      colSpan,
      rowStart,
      rowSpan,
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
        <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Logo size={28} className="shrink-0 sm:w-8 sm:h-8" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {t('header.title')}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col gap-8">
          <Card className="!p-0 bg-transparent border-none">
            <CardContent>
              <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_2.5fr]">
                <div>
                  <GridControls
                    className="flex flex-col gap-4 justify-between h-full"
                    config={gridState.config}
                    onConfigChange={handleConfigChange}
                    onReset={handleResetGrid}
                    selectedItemId={selectedItemId}
                    onItemDelete={handleDeleteItem}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-center rounded-lg w-full overflow-hidden">
                    <GridCanvas
                      gridState={gridState}
                      onItemClick={handleItemClick}
                      onEmptyCellClick={handleEmptyCellClick}
                      onItemChange={handleItemChange}
                      selectedItemId={selectedItemId}
                    />
                  </div>
                  <div className="lg:hidden">
                    <GridActions
                      onReset={handleResetGrid}
                      selectedItemId={selectedItemId}
                      onItemDelete={handleDeleteItem}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="flex flex-col min-h-0 p-0 bg-transparent border-none">
            <CardContent className="flex-1 flex flex-col min-h-0 gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <TechnologySelector
                  selectedTechnology={codeGeneratorType}
                  onTechnologyChange={handleTechnologyChange}
                />
              </div>
              <CodeGeneratorOptions
                technology={codeGeneratorType}
                codeFormat={codeFormat}
                onFormatChange={setCodeFormat}
                withStyledBorders={withStyledBorders}
                onStyledBordersChange={setWithStyledBorders}
                withTailwind={withTailwind}
                onTailwindChange={setWithTailwind}
                hasVerticalItems={hasVerticalItems}
                className="flex flex-col gap-4"
              />
              <CodeOutput
                code={generatedCode}
                language={codeFormat === 'html' || codeGeneratorType === 'raw-css' ? 'html' : 'tsx'}
                isLoading={isCodeLoading}
                className="flex-1"
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

export { GridEditorPage }

