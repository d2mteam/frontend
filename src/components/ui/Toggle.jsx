import { cn } from './utils'

/**
 * Toggle Component - Toggleable button
 */
export function Toggle({ className, variant = 'default', size = 'default', pressed = false, onPressedChange, disabled, children, ...props }) {
  const variants = {
    default: 'bg-transparent hover:bg-muted',
    outline: 'border border-border bg-transparent hover:bg-muted'
  }

  const sizes = {
    default: 'h-9 px-3',
    sm: 'h-8 px-2',
    lg: 'h-10 px-4'
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        pressed && 'bg-primary text-primary-foreground',
        className
      )}
      onClick={() => !disabled && onPressedChange?.(!pressed)}
      disabled={disabled}
      aria-pressed={pressed}
      {...props}
    >
      {children}
    </button>
  )
}
