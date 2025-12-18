import { cn } from './utils'

/**
 * Drawer Component - Slide-out drawer panel
 */
export function Drawer({ className, children, isOpen = false, onOpenChange, ...props }) {
  return (
    <div
      data-open={isOpen}
      className={cn('', className)}
      {...props}
    >
      {typeof children === 'function' ? children({ open: isOpen, onOpenChange }) : children}
    </div>
  )
}

/**
 * DrawerTrigger Component - Button to open drawer
 */
export function DrawerTrigger({ className, children, onClick, ...props }) {
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
 * DrawerContent Component - Main drawer content
 */
export function DrawerContent({ className, children, isOpen = false, onOpenChange, direction = 'right', ...props }) {
  const directionMap = {
    right: 'translate-x-0',
    left: '-translate-x-0',
    top: 'translate-y-0',
    bottom: '-translate-y-0'
  }

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
          direction === 'right' && 'right-0 top-0 bottom-0 w-3/4 sm:max-w-sm',
          direction === 'left' && 'left-0 top-0 bottom-0 w-3/4 sm:max-w-sm',
          direction === 'bottom' && 'bottom-0 left-0 right-0 max-h-[80vh]',
          direction === 'top' && 'top-0 left-0 right-0 max-h-[80vh]',
          !isOpen && 'translate-x-full',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  )
}

/**
 * DrawerHeader Component - Drawer header section
 */
export function DrawerHeader({ className, children, ...props }) {
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
 * DrawerFooter Component - Drawer footer section
 */
export function DrawerFooter({ className, children, ...props }) {
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
 * DrawerTitle Component - Drawer title
 */
export function DrawerTitle({ className, children, ...props }) {
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
 * DrawerDescription Component - Drawer description
 */
export function DrawerDescription({ className, children, ...props }) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
}
