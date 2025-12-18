import { cn } from './utils'

/**
 * InputOTP Component - One-time password input
 */
export function InputOTP({ className, containerClassName, value = '', onChange, length = 6, ...props }) {
  const values = (value || '').split('')

  const handleChange = (index, newValue) => {
    const filtered = newValue.replace(/[^0-9]/g, '')
    if (filtered.length > 1) return

    const newValues = [...values]
    newValues[index] = filtered
    onChange?.(newValues.join(''))

    // Auto-focus next input
    if (filtered && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  return (
    <div className={cn('flex items-center gap-2', containerClassName)} {...props}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={values[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          className={cn(
            'h-9 w-9 rounded-md border border-border bg-input-background text-center text-sm font-semibold',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        />
      ))}
    </div>
  )
}

/**
 * InputOTPGroup Component - Group OTP inputs
 */
export function InputOTPGroup({ className, children, ...props }) {
  return (
    <div className={cn('flex items-center gap-1', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * InputOTPSlot Component - Individual OTP slot
 */
export function InputOTPSlot({ index, className, value = '', onChange, ...props }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength="1"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        'h-9 w-9 rounded-md border border-border bg-input-background text-center text-sm font-semibold',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

/**
 * InputOTPSeparator Component - Separator between OTP groups
 */
export function InputOTPSeparator({ className, ...props }) {
  return (
    <span className={cn('text-muted-foreground', className)} {...props}>
      -
    </span>
  )
}
