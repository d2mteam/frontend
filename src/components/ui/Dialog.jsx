import { cn } from './utils'

/**
 * Dialog Component - Modal dialog wrapper
 */
export function Dialog({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * DialogTrigger Component - Button to open dialog
 */
export function DialogTrigger({ className, children, onClick, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 h-9 px-4 bg-primary text-primary-foreground hover:opacity-90',
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
 * DialogContent Component - Main dialog content area
 */
export function DialogContent({ className, children, onOpenChange, ...props }) {
  return (
    <div
      className={cn(
        'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-background p-6 shadow-lg duration-200 rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <button
        onClick={() => onOpenChange?.(false)}
        className="absolute right-4 top-4 rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  )
}

/**
 * DialogHeader Component - Dialog header section
 */
export function DialogHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * DialogTitle Component - Dialog title text
 */
export function DialogTitle({ className, children, ...props }) {
  return (
    <h2
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

/**
 * DialogDescription Component - Dialog description text
 */
export function DialogDescription({ className, children, ...props }) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * DialogFooter Component - Dialog footer section
 */
export function DialogFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}
