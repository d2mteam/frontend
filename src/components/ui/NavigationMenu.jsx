import { cn } from './utils'

/**
 * NavigationMenu Component - Top navigation menu
 */
export function NavigationMenu({ className, children, ...props }) {
  return (
    <nav
      className={cn('flex max-w-max flex-1 items-center justify-center', className)}
      {...props}
    >
      {children}
    </nav>
  )
}

/**
 * NavigationMenuList Component - List of navigation items
 */
export function NavigationMenuList({ className, children, ...props }) {
  return (
    <ul className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)} {...props}>
      {children}
    </ul>
  )
}

/**
 * NavigationMenuItem Component - Individual navigation item
 */
export function NavigationMenuItem({ className, children, ...props }) {
  return (
    <li className={cn('relative', className)} {...props}>
      {children}
    </li>
  )
}

/**
 * NavigationMenuTrigger Component - Dropdown trigger
 */
export function NavigationMenuTrigger({ className, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        'outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors',
        className
      )}
      {...props}
    >
      {children}
      <span className="ml-1">▼</span>
    </button>
  )
}

/**
 * NavigationMenuContent Component - Dropdown content
 */
export function NavigationMenuContent({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'absolute top-full left-0 w-full p-2 md:w-auto',
        'bg-popover text-popover-foreground rounded-md border border-border shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * NavigationMenuLink Component - Navigation link
 */
export function NavigationMenuLink({ className, children, href, ...props }) {
  return (
    <a
      href={href}
      className={cn(
        'flex items-center gap-1 rounded-sm px-2 py-1.5 text-sm',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground',
        'outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

/**
 * NavigationMenuIndicator Component - Visual indicator
 */
export function NavigationMenuIndicator({ className, ...props }) {
  return (
    <div
      className={cn(
        'absolute top-full z-10 flex h-1.5 items-end justify-center overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </div>
  )
}

/**
 * NavigationMenuViewport Component - Viewport for content
 */
export function NavigationMenuViewport({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'absolute top-full left-0 z-50 w-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
