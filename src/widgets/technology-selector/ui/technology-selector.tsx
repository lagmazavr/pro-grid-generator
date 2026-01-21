'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/shared/ui'
import type { Technology } from '@/shared/types/routing'

interface TechnologySelectorProps {
  selectedTechnology: Technology
  onTechnologyChange: (tech: Technology) => void
  className?: string
}

function TechnologySelector({ selectedTechnology, onTechnologyChange, className }: TechnologySelectorProps) {
  const t = useTranslations()

  const technologies: Technology[] = ['raw-css', 'tailwind', 'material-ui', 'ant-design']

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <Button
            key={tech}
            size="sm"
            variant={selectedTechnology === tech ? 'default' : 'outline'}
            onClick={() => onTechnologyChange(tech)}
          >
            {t(`technologies.${tech}`)}
          </Button>
        ))}
      </div>
    </div>
  )
}

export { TechnologySelector }
