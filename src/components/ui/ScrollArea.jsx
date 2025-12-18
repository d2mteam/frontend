import { cn } from './utils'

/**
 * ScrollArea Component - Scrollable content area with styled scrollbar
 */
export function ScrollArea({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden rounded-md border border-border',
        className
      )}
      {...props}
    >
      <div className="h-full w-full overflow-auto">
        {children}
      </div>
    </div>
  )
}

/**
 * ScrollBar Component - Styled scrollbar
 */
export function ScrollBar({ className, orientation = 'vertical', ...props }) {
  return (
    <div
      className={cn(
        'absolute z-50 flex touch-none select-none transition-colors',
        orientation === 'vertical' && 'right-0 top-0 h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' && 'bottom-0 left-0 h-2.5 w-full border-t border-t-transparent',
        className
      )}
      {...props}
    >
      <div className="relative flex-1 rounded-full bg-border/50 hover:bg-border" />
    </div>
  )
}
