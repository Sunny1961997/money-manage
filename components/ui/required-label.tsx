import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

type RequiredLabelProps = ComponentProps<typeof Label> & {
  text: string
  requiredClassName?: string
}

function RequiredLabel({ text, className, requiredClassName, ...labelProps }: RequiredLabelProps) {
  return (
    <Label className={cn('flex items-center gap-0.5', className)} {...labelProps}>
      <span>{text}</span>
      <span className={cn('text-primary', requiredClassName)} aria-hidden="true">
        *
      </span>
      <span className="sr-only">required</span>
    </Label>
  )
}

export { RequiredLabel }
