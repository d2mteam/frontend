import { cn } from './utils'

/**
 * ResizablePanelGroup Component - Container for resizable panels
 */
export function ResizablePanelGroup({ className, direction = 'horizontal', children, ...props }) {
  return (
    <div
      className={cn(
        'flex h-full w-full',
        direction === 'vertical' && 'flex-col',
        className
      )}
      data-panel-group-direction={direction}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ResizablePanel Component - Individual resizable panel
 */
export function ResizablePanel({ className, children, defaultSize = 50, ...props }) {
  return (
    <div
      className={cn('flex-1 overflow-auto', className)}
      style={{ flex: `1 1 ${defaultSize}%` }}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ResizableHandle Component - Resize handle between panels
 */
export function ResizableHandle({ className, withHandle = false, ...props }) {
  return (
    <div
      className={cn(
        'relative flex w-px items-center justify-center bg-border transition-colors hover:bg-primary/50',
        'cursor-col-resize select-none touch-none',
        className
      )}
      data-panel-resize-handle
      {...props}
    >
      {withHandle && (
        <div className="flex h-4 w-3 items-center justify-center rounded-xs border border-border bg-background">
          <div className="h-1 w-0.5 bg-border" />
        </div>
      )}
    </div>
  )
}
