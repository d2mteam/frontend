import { cn } from './utils'

/**
 * HoverCard Component - Card that appears on hover
 */
export function HoverCard({ className, children, ...props }) {
  return (
    <div className={cn('group relative inline-block', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * HoverCardTrigger Component - Element that triggers hover card
 */
export function HoverCardTrigger({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * HoverCardContent Component - Hover card content
 */
export function HoverCardContent({ className, children, side = 'top', ...props }) {
  const sideMap = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  }

  return (
    <div
      className={cn(
        'absolute z-50 w-64 rounded-lg border border-border bg-background p-4 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto',
        sideMap[side],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
