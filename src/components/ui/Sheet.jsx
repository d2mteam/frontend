import { cn } from './utils'

/**
 * Sheet Component - Side sheet/panel wrapper
 */
export function Sheet({ className, children, isOpen = false, onOpenChange, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {typeof children === 'function' ? children({ open: isOpen, onOpenChange }) : children}
    </div>
  )
}

/**
 * SheetTrigger Component - Button to open sheet
 */
export function SheetTrigger({ className, children, onClick, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 h-9 px-4 bg-primary text-primary-foreground hover:opacity-90',
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
 * SheetContent Component - Main sheet content
 */
export function SheetContent({ className, children, isOpen = false, onOpenChange, side = 'right', ...props }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => onOpenChange?.(false)}
        />
      )}
      <div
        className={cn(
          'fixed z-50 flex h-auto flex-col bg-background rounded-lg border border-border shadow-lg transition-transform',
          side === 'right' && 'right-0 top-0 bottom-0 w-3/4 sm:max-w-sm',
          side === 'left' && 'left-0 top-0 bottom-0 w-3/4 sm:max-w-sm',
          side === 'bottom' && 'bottom-0 left-0 right-0 max-h-[80vh] rounded-t-lg',
          side === 'top' && 'top-0 left-0 right-0 max-h-[80vh] rounded-b-lg',
          !isOpen && 'translate-x-full',
          className
        )}
        {...props}
      >
        {children}
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
    </>
  )
}

/**
 * SheetHeader Component - Sheet header section
 */
export function SheetHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 p-4 border-b border-border', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * SheetFooter Component - Sheet footer section
 */
export function SheetFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-2 p-4 border-t border-border', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * SheetTitle Component - Sheet title
 */
export function SheetTitle({ className, children, ...props }) {
  return (
    <h2
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

/**
 * SheetDescription Component - Sheet description
 */
export function SheetDescription({ className, children, ...props }) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
}
