import { cn } from './utils'

/**
 * Separator Component - Visual divider
 */
export function Separator({ className, decorative = true, orientation = 'horizontal', ...props }) {
  return (
    <div
      className={cn(
        'bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      role={decorative ? 'none' : 'separator'}
      {...props}
    />
  )
}
