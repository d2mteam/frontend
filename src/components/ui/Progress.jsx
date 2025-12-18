import { cn } from './utils'

/**
 * Progress Component - Progress bar indicator
 */
export function Progress({ className, value = 0, max = 100, ...props }) {
  const percentage = (value / max) * 100

  return (
    <div
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-muted',
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
