'use client'

import { useRef, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib'

interface CodeOutputProps {
  code: string
  language?: string
  className?: string
}

function CodeOutput({ code, language = 'tsx', className }: CodeOutputProps) {
  const t = useTranslations()
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = 0
    }
  }, [code])

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
          className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent/50 flex items-center gap-1.5"
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

