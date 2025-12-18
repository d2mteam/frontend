import { cn } from './utils'

/**
 * Label Component - Form label with styling
 */
export function Label({ className, children, ...props }) {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}
