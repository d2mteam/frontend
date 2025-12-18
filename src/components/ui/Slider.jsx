import { cn } from './utils'

/**
 * Slider Component - Range slider input
 */
export function Slider({ className, min = 0, max = 100, step = 1, value = 50, onChange, disabled, ...props }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange?.(parseFloat(e.target.value))}
      disabled={disabled}
      className={cn(
        'w-full h-2 rounded-lg bg-muted accent-primary cursor-pointer transition-all appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50',
        'slider',
        className
      )}
      style={{
        background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((value - min) / (max - min)) * 100}%, var(--border) ${((value - min) / (max - min)) * 100}%, var(--border) 100%)`
      }}
      {...props}
    />
  )
}
