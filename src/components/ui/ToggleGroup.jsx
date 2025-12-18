import { cn } from './utils'

/**
 * ToggleGroup Component - Group of toggleable buttons
 */
export function ToggleGroup({ className, children, type = 'single', value, onChange, ...props }) {
  return (
    <div
      className={cn(
        'group/toggle-group flex w-fit items-center rounded-md shadow-xs',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ToggleGroupItem Component - Item in toggle group
 */
export function ToggleGroupItem({ className, value, pressed = false, onChange, children, ...props }) {
  return (
    <button
      className={cn(
        'flex-1 min-w-0 px-3 py-2 text-sm font-medium rounded-none first:rounded-l-md last:rounded-r-md',
        'border border-r-0 border-border last:border-r',
        'transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'disabled:pointer-events-none disabled:opacity-50',
        pressed && 'bg-accent text-accent-foreground',
        !pressed && 'hover:bg-muted hover:text-muted-foreground',
        className
      )}
      onClick={() => onChange?.(value)}
      aria-pressed={pressed}
      {...props}
    >
      {children}
    </button>
  )
}
