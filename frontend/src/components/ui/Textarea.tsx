import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { Textarea as ShadTextarea } from '@/components/shadcn/ui/textarea'

export type TextareaProps = ComponentPropsWithoutRef<typeof ShadTextarea>

export const Textarea = forwardRef<ElementRef<typeof ShadTextarea>, TextareaProps>((props, ref) => (
  <ShadTextarea ref={ref} {...props} />
))
Textarea.displayName = 'Textarea'
