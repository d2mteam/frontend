import { cn } from './utils'

/**
 * Breadcrumb Component - Navigation breadcrumb trail
 */
export function Breadcrumb({ className, children, ...props }) {
  return (
    <nav
      className={cn('flex', className)}
      aria-label="breadcrumb"
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-2">{children}</ol>
    </nav>
  )
}

/**
 * BreadcrumbItem Component - Individual breadcrumb item
 */
export function BreadcrumbItem({ className, children, ...props }) {
  return (
    <li className={cn('flex items-center gap-2', className)} {...props}>
      {children}
    </li>
  )
}

/**
 * BreadcrumbLink Component - Breadcrumb link element
 */
export function BreadcrumbLink({ className, children, href, ...props }) {
  return (
    <a
      className={cn(
        'text-sm font-medium text-primary hover:text-primary/80 transition-colors',
        className
      )}
      href={href}
      {...props}
    >
      {children}
    </a>
  )
}

/**
 * BreadcrumbSeparator Component - Visual separator between items
 */
export function BreadcrumbSeparator({ className, children = '/', ...props }) {
  return (
    <span
      className={cn('text-muted-foreground', className)}
      role="presentation"
      {...props}
    >
      {children}
    </span>
  )
}
