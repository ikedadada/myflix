import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  className?: string
}

export const PageHeader = ({ title, description, actions, className }: PageHeaderProps) => (
  <div
    className={cn(
      'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4',
      className,
    )}
  >
    <div className='space-y-1.5'>
      <h1 className='text-2xl font-semibold tracking-tight text-foreground'>{title}</h1>
      {description ? (
        <p className='text-sm text-muted-foreground leading-relaxed'>{description}</p>
      ) : null}
    </div>
    {actions ? <div className='flex items-center gap-2'>{actions}</div> : null}
  </div>
)
