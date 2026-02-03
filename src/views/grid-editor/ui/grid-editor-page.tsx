'use client'

import {
  clampGridItem,
  createDefaultGridState,
  generateGridItemId,
  isValidGridItem,
  type GridItem,
  type GridState,
} from '@/entities/grid'
import {
  generateAntDesignCode,
  generateMaterialUICode,
  generateMantineCode,
  generateRawCSSCode,
  generateTailwindCode,
} from '@/features/code-generator'
import type { CodeFormat } from '@/shared/types/code-generator'
import { DEFAULT_TECHNOLOGY, type Technology } from '@/shared/types/routing'
import { useMediaQuery } from '@/shared/lib'
import { AppFooter } from '@/widgets/app-footer'
import { CodeGeneratorPanel } from './code-generator-panel'
import { GridEditorHeader } from './grid-editor-header'
import { GridEditorWorkspace } from './grid-editor-workspace'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

type CodeGeneratorType = Technology

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

  const codeLanguage =
    codeFormat === 'html' || codeGeneratorType === 'raw-css' ? 'html' : 'tsx'

  return (
    <div className="min-h-screen bg-background">
      <GridEditorHeader />

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col gap-8">
          <GridEditorWorkspace
            gridState={gridState}
            selectedItemId={selectedItemId}
            onConfigChange={handleConfigChange}
            onItemClick={handleItemClick}
            onEmptyCellClick={handleEmptyCellClick}
            onItemChange={handleItemChange}
            onReset={handleResetGrid}
            onItemDelete={handleDeleteItem}
          />
          <CodeGeneratorPanel
            selectedTechnology={codeGeneratorType}
            onTechnologyChange={handleTechnologyChange}
            codeFormat={codeFormat}
            onFormatChange={setCodeFormat}
            withStyledBorders={withStyledBorders}
            onStyledBordersChange={setWithStyledBorders}
            withTailwind={withTailwind}
            onTailwindChange={setWithTailwind}
            hasVerticalItems={hasVerticalItems}
            generatedCode={generatedCode}
            isCodeLoading={isCodeLoading}
            codeLanguage={codeLanguage}
          />
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

export { GridEditorPage }

