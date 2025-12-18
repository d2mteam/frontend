import { cn } from './utils'

/**
 * Pagination Component - Pagination controls wrapper
 */
export function Pagination({ className, children, ...props }) {
  return (
    <nav
      className={cn('flex items-center justify-center gap-2', className)}
      role="navigation"
      aria-label="pagination"
      {...props}
    >
      {children}
    </nav>
  )
}

/**
 * PaginationItem Component - Individual pagination item
 */
export function PaginationItem({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * PaginationLink Component - Pagination link/button
 */
export function PaginationLink({ className, isActive, children, href, onClick, disabled, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-3 text-sm transition-all',
        isActive && 'bg-primary text-primary-foreground border-primary',
        !isActive && 'hover:bg-muted',
        disabled && 'opacity-50 cursor-not-allowed',
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
 * PaginationPrevious Component - Previous page link
 */
export function PaginationPrevious({ className, disabled, onClick, ...props }) {
  return (
    <PaginationLink
      className={cn('gap-1 pl-2.5', className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <span>←</span>
      <span className="hidden sm:inline">Previous</span>
    </PaginationLink>
  )
}

/**
 * PaginationNext Component - Next page link
 */
export function PaginationNext({ className, disabled, onClick, ...props }) {
  return (
    <PaginationLink
      className={cn('gap-1 pr-2.5', className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <span className="hidden sm:inline">Next</span>
      <span>→</span>
    </PaginationLink>
  )
}
