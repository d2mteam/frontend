import { cn } from './utils'

/**
 * Radio Component - Styled radio input
 */
export function Radio({ className, ...props }) {
  return (
    <input
      type="radio"
      className={cn(
        'h-4 w-4 rounded-full border border-border bg-input-background accent-primary cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}
