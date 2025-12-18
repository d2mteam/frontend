import { cn } from './utils'

/**
 * Alert Component - Display important messages or notifications
 */
export function Alert({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: 'bg-card text-card-foreground border-border',
    destructive: 'bg-destructive/10 text-destructive border-destructive/50',
  }

  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border px-4 py-3 text-sm',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function AlertTitle({ className, children, ...props }) {
  return (
    <div
      className={cn('font-medium mb-1', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function AlertDescription({ className, children, ...props }) {
  return (
    <div
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}
