import { cn } from './utils'

/**
 * Collapsible Component - Expandable/collapsible content wrapper
 */
export function Collapsible({ className, children, open = false, onOpenChange, ...props }) {
  const [isOpen, setIsOpen] = React.useState(open)

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <div
      data-state={isOpen ? 'open' : 'closed'}
      className={cn('w-full', className)}
      {...props}
    >
      {typeof children === 'function' ? children({ open: isOpen, onOpenChange: handleOpenChange }) : children}
    </div>
  )
}

/**
 * CollapsibleTrigger Component - Trigger button for collapsible
 */
export function CollapsibleTrigger({ className, children, onClick, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 h-9 px-4',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * CollapsibleContent Component - Content that collapses/expands
 */
export function CollapsibleContent({ className, children, isOpen = false, ...props }) {
  return (
    <div
      className={cn(
        'overflow-hidden transition-all',
        !isOpen && 'hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
