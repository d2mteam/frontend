import { cn } from './utils'

/**
 * Popover Component - Popover wrapper
 */
export function Popover({ className, children, ...props }) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * PopoverTrigger Component - Button to open popover
 */
export function PopoverTrigger({ className, children, onClick, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 h-9 px-4 border border-border hover:bg-muted',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * PopoverContent Component - Popover content panel
 */
export function PopoverContent({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'absolute top-full left-0 z-50 mt-2 w-72 rounded-md border border-border bg-background p-4 shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
