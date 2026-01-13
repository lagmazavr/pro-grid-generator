/**
 * Code output UI component
 * Displays generated code with syntax highlighting
 */

import { useRef, useEffect } from 'react'
import { cn } from '@/shared/lib'

interface CodeOutputProps {
  /** Code to display */
  code: string
  /** Language label */
  language?: string
  /** Additional class name */
  className?: string
}

/**
 * CodeOutput - Displays code with syntax highlighting
 */
function CodeOutput({ code, language = 'tsx', className }: CodeOutputProps) {
  const preRef = useRef<HTMLPreElement>(null)

  // Scroll to top when code changes
  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = 0
    }
  }, [code])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className={cn('relative flex flex-col h-full bg-card', className)}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/50">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent/50"
        >
          Copy
        </button>
      </div>
      <pre
        ref={preRef}
        className={cn(
          'flex-1 overflow-auto p-4 text-sm font-mono leading-relaxed',
          'bg-background text-foreground',
          '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb]:hover:bg-border/80'
        )}
      >
        <code className="text-foreground/90">{code}</code>
      </pre>
    </div>
  )
}

export { CodeOutput }

