import { cn } from './utils'

/**
 * Select Component - Dropdown select wrapper
 */
export function Select({ className, children, ...props }) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * SelectTrigger Component - Button to open select
 */
export function SelectTrigger({ className, children, onClick, ...props }) {
  return (
    <button
      className={cn(
        'flex h-9 w-full items-center justify-between rounded-md border border-border bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
      <svg
        className="h-4 w-4 opacity-50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  )
}

/**
 * SelectContent Component - Dropdown content wrapper
 */
export function SelectContent({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'relative z-50 max-h-96 w-full overflow-y-auto rounded-md border border-border bg-background p-1 shadow-md animate-in fade-in-0 zoom-in-95 -translate-y-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * SelectItem Component - Select option item
 */
export function SelectItem({ className, children, onClick, selected, ...props }) {
  return (
    <button
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-muted focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        selected && 'bg-primary text-primary-foreground',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {selected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          ✓
        </span>
      )}
      {children}
    </button>
  )
}

/**
 * SelectValue Component - Display selected value
 */
export function SelectValue({ placeholder, ...props }) {
  return <span {...props}>{placeholder}</span>
}
