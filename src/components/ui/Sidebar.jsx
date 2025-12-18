import { cn } from './utils'

/**
 * Sidebar Component - Application sidebar navigation
 */
export function Sidebar({ className, children, side = 'left', variant = 'sidebar', ...props }) {
  return (
    <aside
      className={cn(
        'bg-sidebar text-sidebar-foreground flex h-screen w-64 flex-col border-r border-border',
        side === 'right' && 'border-l border-r-0 ml-auto',
        className
      )}
      data-sidebar={true}
      {...props}
    >
      {children}
    </aside>
  )
}

/**
 * SidebarTrigger Component - Button to toggle sidebar
 */
export function SidebarTrigger({ className, onClick, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium',
        'h-9 w-9 px-0',
        'hover:bg-muted hover:text-muted-foreground',
        'transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        className
      )}
      onClick={onClick}
      {...props}
    >
      ☰
    </button>
  )
}

/**
 * SidebarContent Component - Main content area of sidebar
 */
export function SidebarContent({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * SidebarHeader Component - Sidebar header
 */
export function SidebarHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-2 border-b border-border', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * SidebarFooter Component - Sidebar footer
 */
export function SidebarFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-2 border-t border-border mt-auto', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * SidebarMenu Component - Menu list
 */
export function SidebarMenu({ className, children, ...props }) {
  return (
    <ul
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    >
      {children}
    </ul>
  )
}

/**
 * SidebarMenuItem Component - Menu item
 */
export function SidebarMenuItem({ className, children, ...props }) {
  return (
    <li
      className={cn('group/menu-item relative', className)}
      {...props}
    >
      {children}
    </li>
  )
}

/**
 * SidebarMenuButton Component - Menu button/link
 */
export function SidebarMenuButton({ className, children, isActive = false, asChild = false, ...props }) {
  const Comp = asChild ? 'a' : 'button'
  return (
    <Comp
      className={cn(
        'peer/menu-button flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none',
        'transition-colors hover:bg-muted hover:text-muted-foreground',
        'focus-visible:ring-2 focus-visible:ring-primary/50',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive && 'bg-accent text-accent-foreground font-medium',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

/**
 * SidebarMenuBadge Component - Badge for menu item
 */
export function SidebarMenuBadge({ className, children, ...props }) {
  return (
    <span
      className={cn(
        'ml-auto text-xs font-medium px-2 py-0.5 rounded-full',
        'bg-primary/20 text-primary',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/**
 * SidebarSeparator Component - Divider
 */
export function SidebarSeparator({ className, ...props }) {
  return (
    <div
      className={cn('bg-border h-px mx-2 my-2', className)}
      {...props}
    />
  )
}

/**
 * SidebarGroup Component - Group of menu items
 */
export function SidebarGroup({ className, children, ...props }) {
  return (
    <div
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * SidebarGroupLabel Component - Group label
 */
export function SidebarGroupLabel({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'text-xs font-medium text-muted-foreground px-2 py-1.5 mb-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * SidebarGroupContent Component - Group content
 */
export function SidebarGroupContent({ className, children, ...props }) {
  return (
    <div
      className={cn('w-full text-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * SidebarInset Component - Main content area
 */
export function SidebarInset({ className, children, ...props }) {
  return (
    <main
      className={cn(
        'bg-background relative flex w-full flex-1 flex-col',
        className
      )}
      {...props}
    >
      {children}
    </main>
  )
}

/**
 * SidebarProvider Component - Sidebar context provider
 */
export function SidebarProvider({ className, children, ...props }) {
  return (
    <div
      className={cn('flex h-screen w-full', className)}
      {...props}
    >
      {children}
    </div>
  )
}
