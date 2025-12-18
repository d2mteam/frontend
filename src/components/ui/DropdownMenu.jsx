import { cn } from './utils'

/**
 * DropdownMenu Component - Dropdown menu wrapper
 */
export function DropdownMenu({ className, children, ...props }) {
  return (
    <div className={cn('relative inline-block', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * DropdownMenuTrigger Component - Button to open dropdown
 */
export function DropdownMenuTrigger({ className, children, onClick, ...props }) {
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
 * DropdownMenuContent Component - Dropdown content panel
 */
export function DropdownMenuContent({ className, children, align = 'start', ...props }) {
  const alignMap = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  }

  return (
    <div
      className={cn(
        'absolute top-full z-50 mt-2 min-w-[8rem] rounded-md border border-border bg-background p-1 shadow-md',
        alignMap[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * DropdownMenuItem Component - Individual dropdown item
 */
export function DropdownMenuItem({ className, children, onClick, disabled = false, ...props }) {
  return (
    <button
      className={cn(
        'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted focus:bg-muted disabled:pointer-events-none disabled:opacity-50',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * DropdownMenuSeparator Component - Divider in dropdown
 */
export function DropdownMenuSeparator({ className, ...props }) {
  return (
    <div
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

/**
 * DropdownMenuLabel Component - Label in dropdown
 */
export function DropdownMenuLabel({ className, children, ...props }) {
  return (
    <div
      className={cn('px-2 py-1.5 text-sm font-medium text-foreground', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * DropdownMenuGroup Component - Group of dropdown items
 */
export function DropdownMenuGroup({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * DropdownMenuCheckboxItem Component - Checkbox item in dropdown
 */
export function DropdownMenuCheckboxItem({ className, children, checked = false, onChange, ...props }) {
  return (
    <button
      className={cn(
        'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none hover:bg-muted focus:bg-muted',
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
