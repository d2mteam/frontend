import { cn } from './utils'

/**
 * Avatar Component - User avatar image
 */
export function Avatar({ className, ...props }) {
  return (
    <div
      className={cn(
        'relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted',
        className
      )}
      {...props}
    />
  )
}

/**
 * AvatarImage Component - Avatar image element
 */
export function AvatarImage({ className, alt, ...props }) {
  return (
    <img
      className={cn('h-full w-full object-cover', className)}
      alt={alt}
      {...props}
    />
  )
}

/**
 * AvatarFallback Component - Fallback when image fails to load
 */
export function AvatarFallback({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
