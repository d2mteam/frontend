import { cn } from './utils'

/**
 * Form Component - Form wrapper
 */
export function Form({ className, children, onSubmit, ...props }) {
  return (
    <form
      className={cn('space-y-4', className)}
      onSubmit={onSubmit}
      {...props}
    >
      {children}
    </form>
  )
}

/**
 * FormField Component - Form field wrapper
 */
export function FormField({ className, children, label, error, required = false, ...props }) {
  return (
    <div className={cn('space-y-1.5', className)} {...props}>
      {label && (
        <label className={cn('text-sm font-medium', error && 'text-destructive')}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

/**
 * FormControl Component - Form control wrapper (for inputs, etc.)
 */
export function FormControl({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * FormDescription Component - Helper text below form field
 */
export function FormDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-xs text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
}

/**
 * FormMessage Component - Error or validation message
 */
export function FormMessage({ className, children, ...props }) {
  return (
    <p className={cn('text-xs text-destructive', className)} {...props}>
      {children}
    </p>
  )
}

/**
 * FormLabel Component - Label for form field
 */
export function FormLabel({ className, children, required = false, ...props }) {
  return (
    <label className={cn('text-sm font-medium leading-none', className)} {...props}>
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  )
}
