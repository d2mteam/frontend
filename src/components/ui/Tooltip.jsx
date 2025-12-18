import { cn } from './utils'

/**
 * Tooltip Component - Tooltip wrapper
 */
export function Tooltip({ className, children, ...props }) {
  return (
    <div className={cn('relative inline-block group', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * TooltipTrigger Component - Element that triggers tooltip
 */
export function TooltipTrigger({ className, children, ...props }) {
  return (
    <div className={cn('cursor-help', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * TooltipContent Component - Tooltip content
 */
export function TooltipContent({ className, children, side = 'top', ...props }) {
  const sideMap = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  }

  return (
    <div
      className={cn(
        'absolute z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap',
        sideMap[side],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
