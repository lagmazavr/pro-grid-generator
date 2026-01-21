/**
 * Grid Editor Page
 * Main page for the grid generator application
 */

import { useState, useMemo } from 'react'
import { GridCanvas } from '@/widgets/grid-canvas'
import { GridControls } from '@/features/grid-controls'
import {
  generateMaterialUICode,
  generateChakraUICode,
  generateRawCSSCode,
  generateTailwindCode,
  generateMantineCode,
  generateAntDesignCode,
  CodeOutput,
} from '@/features/code-generator'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui'
import { Button, Checkbox } from '@/shared/ui'
import {
  createDefaultGridState,
  generateGridItemId,
  clampGridItem,
  isValidGridItem,
  type GridState,
  type GridItem,
} from '@/entities/grid'

type CodeGeneratorType =
  | 'material-ui'
  | 'chakra-ui'
  | 'mantine'
  | 'ant-design'
  | 'raw-css'
  | 'tailwind'

type CodeFormat = 'jsx' | 'html'

/**
 * GridEditorPage - Main grid editor page
 * Combines grid controls, canvas, and code generation
 */
function GridEditorPage() {
  const [gridState, setGridState] = useState<GridState>(createDefaultGridState())
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [codeGeneratorType, setCodeGeneratorType] = useState<CodeGeneratorType>('material-ui')
  const [codeFormat, setCodeFormat] = useState<CodeFormat>('jsx')
  const [withStyledBorders, setWithStyledBorders] = useState(true)
  const [withTailwind, setWithTailwind] = useState(false)

  // Check if there are vertical items (rowSpan > 1) to determine if tailwind option should be shown
  const hasVerticalItems = useMemo(() => {
    return gridState.items.some(item => item.rowSpan > 1)
  }, [gridState.items])

  // Generate code based on selected generator type and format
  const generatedCode = useMemo(() => {
    const options = {
      withStyledBorders,
      withTailwind,
    }
    switch (codeGeneratorType) {
      case 'material-ui':
        return generateMaterialUICode(gridState, options)
      case 'chakra-ui':
        return generateChakraUICode(gridState)
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

  // Handle grid config changes
  const handleConfigChange = (config: GridState['config']) => {
    // Validate and clamp items when config changes
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

  // Handle item click
  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId === selectedItemId ? null : itemId)
  }

  // Handle empty cell click - create new item
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

  // Handle item change (move or resize)
  const handleItemChange = (itemId: string, updatedItem: GridItem) => {
    setGridState({
      ...gridState,
      items: gridState.items.map((item) => (item.id === itemId ? updatedItem : item)),
    })
  }

  // Delete selected item
  const handleDeleteItem = () => {
    if (selectedItemId) {
      setGridState({
        ...gridState,
        items: gridState.items.filter((item) => item.id !== selectedItemId),
      })
      setSelectedItemId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Grid Generator</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Visual grid editor for multiple frameworks and CSS approaches
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col gap-6">
          {/* Grid Canvas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <CardTitle>Grid Canvas</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    EN: Click on cells to add items • ES: Haz clic en las celdas para agregar elementos • 
                    FR: Cliquez sur les cellules pour ajouter des éléments • DE: Klicken Sie auf Zellen, um Elemente hinzuzufügen • 
                    RU: Нажмите на ячейки, чтобы добавить элементы • ZH: 单击单元格以添加项目
                  </p>
                </div>
                {selectedItemId && (
                  <Button size="sm" variant="destructive" onClick={handleDeleteItem}>
                    Delete
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 md:grid md:grid-cols-[0.75fr_2.5fr]">
                {/* Grid controls */}
                <div>
                  <GridControls config={gridState.config} onConfigChange={handleConfigChange} />
                </div>
                
                {/* Grid canvas */}
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

          {/* Code output */}
          <Card className="flex flex-col min-h-0">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Generated Code</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={codeGeneratorType === 'raw-css' ? 'default' : 'outline'}
                    onClick={() => setCodeGeneratorType('raw-css')}
                  >
                    CSS Grid
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={codeGeneratorType === 'tailwind' ? 'default' : 'outline'}
                    onClick={() => setCodeGeneratorType('tailwind')}
                  >
                    Tailwind
                  </Button>
                  <Button
                    size="sm"
                    variant={codeGeneratorType === 'material-ui' ? 'default' : 'outline'}
                    onClick={() => setCodeGeneratorType('material-ui')}
                  >
                    Material UI v7
                  </Button>
                  <Button
                    size="sm"
                    variant={codeGeneratorType === 'ant-design' ? 'default' : 'outline'}
                    onClick={() => setCodeGeneratorType('ant-design')}
                  >
                    Ant Design v6
                  </Button>
                  {/* <Button
                    size="sm"
                    variant={codeGeneratorType === 'chakra-ui' ? 'default' : 'outline'}
                    onClick={() => setCodeGeneratorType('chakra-ui')}
                  >
                    Chakra UI
                  </Button> */}
                  <Button
                    size="sm"
                    variant={codeGeneratorType === 'mantine' ? 'default' : 'outline'}
                    onClick={() => setCodeGeneratorType('mantine')}
                  >
                    Mantine v8
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              {(codeGeneratorType === 'raw-css' || codeGeneratorType === 'tailwind') && (
                <div className="flex gap-2 mb-2">
                  <Button
                    size="sm"
                    variant={codeFormat === 'jsx' ? 'default' : 'outline'}
                    onClick={() => setCodeFormat('jsx')}
                  >
                    JSX
                  </Button>
                  <Button
                    size="sm"
                    variant={codeFormat === 'html' ? 'default' : 'outline'}
                    onClick={() => setCodeFormat('html')}
                  >
                    HTML
                  </Button>
                </div>
              )}
              {(codeGeneratorType === 'material-ui' || codeGeneratorType === 'ant-design' || codeGeneratorType === 'mantine') && (
                <div className="flex gap-4 mb-2">
                  <Checkbox
                    id="with-styled-borders"
                    checked={withStyledBorders}
                    onChange={(e) => setWithStyledBorders(e.target.checked)}
                    label="With styled borders"
                  />
                  {hasVerticalItems && (
                    <Checkbox
                      id="with-tailwind"
                      checked={withTailwind}
                      onChange={(e) => setWithTailwind(e.target.checked)}
                      label="With tailwind"
                    />
                  )}
                </div>
              )}
              {(codeGeneratorType === 'raw-css' || codeGeneratorType === 'tailwind') && (
                <div className="flex gap-4 mb-2">
                  <Checkbox
                    id="with-styled-borders-css"
                    checked={withStyledBorders}
                    onChange={(e) => setWithStyledBorders(e.target.checked)}
                    label="With styled borders"
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

