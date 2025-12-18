import { cn } from './utils'

/**
 * ContextMenu Component - Right-click context menu wrapper
 */
export function ContextMenu({ className, children, ...props }) {
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={cn('relative', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ContextMenuTrigger Component - Element that triggers context menu
 */
export function ContextMenuTrigger({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * ContextMenuContent Component - Context menu content panel
 */
export function ContextMenuContent({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'absolute z-50 min-w-[8rem] rounded-md border border-border bg-background p-1 shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ContextMenuItem Component - Individual context menu item
 */
export function ContextMenuItem({ className, children, onClick, ...props }) {
  return (
    <button
      className={cn(
        'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus:bg-muted disabled:pointer-events-none disabled:opacity-50',
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
 * ContextMenuSeparator Component - Divider in context menu
 */
export function ContextMenuSeparator({ className, ...props }) {
  return (
    <div
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

/**
 * ContextMenuCheckboxItem Component - Checkbox item in context menu
 */
export function ContextMenuCheckboxItem({ className, children, checked = false, onChange, ...props }) {
  return (
    <button
      className={cn(
        'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none hover:bg-muted focus:bg-muted disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={() => onChange?.(!checked)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && '✓'}
      </span>
      {children}
    </button>
  )
}

/**
 * ContextMenuLabel Component - Label text in context menu
 */
export function ContextMenuLabel({ className, children, ...props }) {
  return (
    <div
      className={cn('px-2 py-1.5 text-sm font-medium text-foreground', className)}
      {...props}
    >
      {children}
    </div>
  )
}
