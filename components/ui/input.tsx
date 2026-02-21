import * as React from 'react'
import { Calendar } from "lucide-react"

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, disabled, ...props }, forwardedRef) => {
    const innerRef = React.useRef<HTMLInputElement>(null)

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node

        if (typeof forwardedRef === "function") {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      },
      [forwardedRef]
    )

    const baseClassName = cn(
      'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      'bg-white',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      type === "date" &&
        "pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none",
      className,
    )

    if (type === "date") {
      return (
        <div className="relative">
          <input type={type} data-slot="input" ref={setRefs} className={baseClassName} disabled={disabled} {...props} />
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            aria-label="Open date picker"
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none"
            onClick={() => {
              const el = innerRef.current
              if (!el) return

              if (typeof (el as HTMLInputElement & { showPicker?: () => void }).showPicker === "function") {
                ;(el as HTMLInputElement & { showPicker?: () => void }).showPicker?.()
                return
              }

              el.focus()
              el.click()
            }}
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      )
    }

    return <input type={type} data-slot="input" ref={setRefs} className={baseClassName} disabled={disabled} {...props} />
  }
)
Input.displayName = "Input"

export { Input }
