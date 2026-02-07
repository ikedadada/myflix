import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'
import { Input as ShadInput } from '@/components/shadcn/ui/input'

export type InputProps = ComponentPropsWithoutRef<typeof ShadInput>

export const Input = forwardRef<ElementRef<typeof ShadInput>, InputProps>((props, ref) => (
  <ShadInput ref={ref} {...props} />
))
Input.displayName = 'Input'
