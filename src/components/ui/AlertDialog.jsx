import { cn } from './utils'

/**
 * AlertDialog Component - Alert dialog wrapper
 */
export function AlertDialog({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * AlertDialogTrigger Component - Button to open alert dialog
 */
export function AlertDialogTrigger({ className, children, onClick, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 h-9 px-4 border border-destructive text-destructive hover:bg-destructive/10',
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
 * AlertDialogContent Component - Alert dialog content
 */
export function AlertDialogContent({ className, children, onOpenChange, ...props }) {
  return (
    <div
      className={cn(
        'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-background p-6 shadow-lg rounded-lg',
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
 * AlertDialogHeader Component - Alert dialog header
 */
export function AlertDialogHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col space-y-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * AlertDialogTitle Component - Alert dialog title
 */
export function AlertDialogTitle({ className, children, ...props }) {
  return (
    <h2
      className={cn('text-lg font-semibold', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

/**
 * AlertDialogDescription Component - Alert dialog description
 */
export function AlertDialogDescription({ className, children, ...props }) {
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
 * AlertDialogFooter Component - Alert dialog footer with actions
 */
export function AlertDialogFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * AlertDialogAction Component - Confirm/destructive action button
 */
export function AlertDialogAction({ className, children, onClick, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 h-9 px-4 bg-destructive text-destructive-foreground hover:opacity-90',
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
 * AlertDialogCancel Component - Cancel button
 */
export function AlertDialogCancel({ className, children, onClick, ...props }) {
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
