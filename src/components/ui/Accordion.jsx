import { cn } from './utils'

/**
 * Accordion Component - Collapsible content panels
 */
export function Accordion({ className, children, ...props }) {
  return (
    <div className={cn('w-full', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * AccordionItem Component - Single accordion item
 */
export function AccordionItem({ className, children, ...props }) {
  return (
    <div
      className={cn('border-b border-border', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * AccordionTrigger Component - Accordion trigger button
 */
export function AccordionTrigger({ className, children, onClick, isOpen, ...props }) {
  return (
    <button
      className={cn(
        'flex h-12 w-full items-center justify-between rounded-sm px-4 py-2 font-medium transition-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 [&>svg]:h-5 [&>svg]:w-5',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
      <svg
        className={cn('transform transition-transform', isOpen && 'rotate-180')}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  )
}

/**
 * AccordionContent Component - Accordion content panel
 */
export function AccordionContent({ className, children, isOpen, ...props }) {
  return (
    <div
      className={cn('overflow-hidden transition-all', !isOpen && 'hidden', className)}
      {...props}
    >
      <div className="px-4 py-3 text-sm text-muted-foreground">
        {children}
      </div>
    </div>
  )
}
