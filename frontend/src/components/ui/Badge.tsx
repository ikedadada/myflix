import type { ComponentProps } from 'react'
import { Badge as ShadBadge } from '@/components/shadcn/ui/badge'

export type BadgeProps = ComponentProps<typeof ShadBadge>

export const Badge = (props: BadgeProps) => <ShadBadge {...props} />
