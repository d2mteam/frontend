import { cn } from './utils'

/**
 * RadioGroup Component - Group of radio buttons
 */
export function RadioGroup({ className, children, value, onChange, ...props }) {
  return (
    <div className={cn('grid gap-3', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * RadioGroupItem Component - Individual radio button
 */
export function RadioGroupItem({ className, value, checked = false, onChange, ...props }) {
  return (
    <label className={cn('flex items-center gap-2 cursor-pointer', className)}>
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'h-4 w-4 rounded-full border border-border bg-input-background accent-primary',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
        {...props}
      />
      <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {props.label}
      </span>
    </label>
  )
}
