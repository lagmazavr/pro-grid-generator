import { cn } from '@/shared/lib/utils'

interface LogoProps {
  className?: string
  size?: number
}

function Logo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-foreground', className)}
    >
      {/* Grid background */}
      <rect width="32" height="32" rx="4" fill="currentColor" fillOpacity="0.1" />
      
      {/* Grid lines */}
      <line x1="10.67" y1="0" x2="10.67" y2="32" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <line x1="21.33" y1="0" x2="21.33" y2="32" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <line x1="0" y1="10.67" x2="32" y2="10.67" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <line x1="0" y1="21.33" x2="32" y2="21.33" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      
      {/* Highlighted cells to show grid functionality */}
      <rect x="2" y="2" width="8" height="8" fill="currentColor" fillOpacity="0.2" rx="1" />
      <rect x="12" y="2" width="8" height="8" fill="currentColor" fillOpacity="0.2" rx="1" />
      <rect x="2" y="12" width="6" height="8" fill="currentColor" fillOpacity="0.2" rx="1" />
      <rect x="10" y="12" width="12" height="8" fill="currentColor" fillOpacity="0.2" rx="1" />
    </svg>
  )
}

export { Logo }
