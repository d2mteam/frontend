import { cn } from './utils'

/**
 * Tabs Component - Tabbed interface
 */
export function Tabs({ className, children, ...props }) {
  return (
    <div className={cn('w-full', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * TabsList Component - Container for tab triggers
 */
export function TabsList({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * TabsTrigger Component - Individual tab button
 */
export function TabsTrigger({ className, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * TabsContent Component - Tab content panel
 */
export function TabsContent({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
