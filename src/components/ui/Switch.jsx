import { cn } from './utils'

/**
 * Switch Component - Toggle switch input
 */
export function Switch({ className, checked = false, onChange, disabled, ...props }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={cn(
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed',
        checked ? 'bg-primary' : 'bg-muted',
        className
      )}
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      {...props}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}
