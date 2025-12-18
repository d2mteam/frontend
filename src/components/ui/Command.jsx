import { cn } from './utils'

/**
 * Command Component - Command palette/search interface
 */
export function Command({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md border border-border bg-background',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CommandInput Component - Command search input
 */
export function CommandInput({ className, placeholder = 'Search...', ...props }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-3 py-2">
      <span className="text-muted-foreground">🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        className={cn(
          'flex h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground',
          className
        )}
        {...props}
      />
    </div>
  )
}

/**
 * CommandList Component - List of command items
 */
export function CommandList({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'max-h-[300px] overflow-y-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CommandEmpty Component - Message when no results
 */
export function CommandEmpty({ className, children = 'No results found', ...props }) {
  return (
    <div
      className={cn(
        'py-6 text-center text-sm text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CommandGroup Component - Group of command items
 */
export function CommandGroup({ className, heading, children, ...props }) {
  return (
    <div className={cn('overflow-hidden', className)} {...props}>
      {heading && (
        <div className="overflow-hidden px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      )}
      <div className="grid gap-0">
        {children}
      </div>
    </div>
  )
}

/**
 * CommandItem Component - Individual command item
 */
export function CommandItem({ className, children, onClick, ...props }) {
  return (
    <button
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus:bg-muted disabled:pointer-events-none disabled:opacity-50',
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
 * CommandSeparator Component - Divider between groups
 */
export function CommandSeparator({ className, ...props }) {
  return (
    <div
      className={cn('-mx-1 h-px bg-border', className)}
      {...props}
    />
  )
}
