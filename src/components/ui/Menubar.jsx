import { cn } from './utils'

/**
 * Menubar Component - Application menu bar
 */
export function Menubar({ className, children, ...props }) {
  return (
    <nav
      className={cn(
        'flex h-9 items-center gap-1 rounded-md border border-border bg-background p-1 shadow-xs',
        className
      )}
      {...props}
    >
      {children}
    </nav>
  )
}

/**
 * MenubarMenu Component - Menu item
 */
export function MenubarMenu({ className, children, ...props }) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * MenubarTrigger Component - Trigger for menu dropdown
 */
export function MenubarTrigger({ className, children, onClick, ...props }) {
  return (
    <button
      className={cn(
        'flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary/50',
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
 * MenubarContent Component - Menu dropdown content
 */
export function MenubarContent({ className, children, align = 'start', ...props }) {
  const alignMap = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  }

  return (
    <div
      className={cn(
        'absolute top-full z-50 min-w-[12rem] rounded-md border border-border bg-background p-1 shadow-md',
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
 * MenubarItem Component - Menu item
 */
export function MenubarItem({ className, children, onClick, disabled = false, ...props }) {
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
 * MenubarSeparator Component - Divider in menu
 */
export function MenubarSeparator({ className, ...props }) {
  return (
    <div
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

/**
 * MenubarLabel Component - Label in menu
 */
export function MenubarLabel({ className, children, ...props }) {
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
 * MenubarGroup Component - Group of menu items
 */
export function MenubarGroup({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * MenubarCheckboxItem Component - Checkbox menu item
 */
export function MenubarCheckboxItem({ className, children, checked = false, onChange, ...props }) {
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
