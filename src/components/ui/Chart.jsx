import { cn } from './utils'

/**
 * Chart Component - Data visualization wrapper
 */
export function Chart({ config, children, className, id, ...props }) {
  const uniqueId = id || Math.random().toString(36).substr(2, 9)
  const chartId = `chart-${uniqueId}`

  return (
    <div
      data-chart={chartId}
      className={cn(
        'flex aspect-video justify-center text-xs',
        '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground',
        '[&_.recharts-cartesian-grid_line]:stroke-border/50',
        '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border',
        '[&_.recharts-polar-grid]:stroke-border',
        '[&_.recharts-radial-bar-background-sector]:fill-muted',
        '[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted',
        '[&_.recharts-reference-line]:stroke-border',
        '[&_.recharts-dot[stroke="#fff"]]:stroke-transparent',
        '[&_.recharts-layer]:outline-hidden',
        '[&_.recharts-sector]:outline-hidden',
        '[&_.recharts-sector[stroke="#fff"]]:stroke-transparent',
        '[&_.recharts-surface]:outline-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ChartTooltip Component - Chart tooltip display
 */
export function ChartTooltip({ className, content, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-background p-3 shadow-lg text-xs',
        className
      )}
      {...props}
    >
      {content}
    </div>
  )
}

/**
 * ChartLegend Component - Chart legend display
 */
export function ChartLegend({ className, items = [], ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4 pt-3',
        className
      )}
      {...props}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-muted-foreground">{item.name}</span>
        </div>
      ))}
    </div>
  )
}
