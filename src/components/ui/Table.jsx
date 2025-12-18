import { cn } from './utils'

/**
 * Table Component - Main table wrapper
 */
export function Table({ className, children, ...props }) {
  return (
    <div className="relative w-full overflow-x-auto rounded-lg border border-border">
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

/**
 * TableHeader Component - Table header section
 */
export function TableHeader({ className, children, ...props }) {
  return (
    <thead className={cn('[&_tr]:border-b', className)} {...props}>
      {children}
    </thead>
  )
}

/**
 * TableBody Component - Table body section
 */
export function TableBody({ className, children, ...props }) {
  return (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props}>
      {children}
    </tbody>
  )
}

/**
 * TableFooter Component - Table footer section
 */
export function TableFooter({ className, children, ...props }) {
  return (
    <tfoot
      className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    >
      {children}
    </tfoot>
  )
}

/**
 * TableRow Component - Table row
 */
export function TableRow({ className, children, ...props }) {
  return (
    <tr
      className={cn(
        'hover:bg-muted/50 border-b transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

/**
 * TableHead Component - Table header cell
 */
export function TableHead({ className, children, ...props }) {
  return (
    <th
      className={cn(
        'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

/**
 * TableCell Component - Table data cell
 */
export function TableCell({ className, children, ...props }) {
  return (
    <td
      className={cn(
        'p-2 align-middle whitespace-nowrap',
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
}

/**
 * TableCaption Component - Table caption
 */
export function TableCaption({ className, children, ...props }) {
  return (
    <caption
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    >
      {children}
    </caption>
  )
}
