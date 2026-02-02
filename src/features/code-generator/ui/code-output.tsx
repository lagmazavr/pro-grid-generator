'use client'

import { useRef, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/shared/lib'

interface CodeOutputProps {
  code: string
  language?: string
  isLoading?: boolean
  className?: string
}

function CodeOutput({ code, language = 'tsx', isLoading = false, className }: CodeOutputProps) {
  const t = useTranslations()
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (preRef.current && !isLoading) {
      preRef.current.scrollTop = 0
    }
  }, [code, isLoading])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('relative flex flex-col h-full bg-card', className)}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/50">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          disabled={isLoading}
          className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent/50 flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              {t('common.copied') || 'Copied'}
            </>
          ) : (
            t('common.copy')
          )}
        </button>
      </div>
      <pre
        ref={preRef}
        className={cn(
          'relative flex-1 overflow-auto p-4 text-sm font-mono leading-relaxed min-h-[120px]',
          'bg-background text-foreground',
          '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb]:hover:bg-border/80'
        )}
      >
        <code className="text-foreground/90">{code}</code>
        {isLoading && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-[2px] text-muted-foreground"
            aria-live="polite"
            aria-busy="true"
          >
            <Loader2 className="h-6 w-6 animate-spin shrink-0" aria-hidden />
            <span className="text-xs">{t('codeOutput.generating') ?? 'Generating…'}</span>
          </div>
        )}
      </pre>
    </div>
  )
}

export { CodeOutput }

