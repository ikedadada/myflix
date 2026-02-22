import type { ComponentPropsWithoutRef } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface SelectableOptionButtonProps
  extends Omit<ComponentPropsWithoutRef<typeof Button>, 'children'> {
  description?: string
  selected: boolean
  selectedLabel?: string
  title: string
}

export const SelectableOptionButton = ({
  className,
  description,
  selected,
  selectedLabel = '選択中',
  title,
  ...props
}: SelectableOptionButtonProps) => (
  <Button
    type={props.type ?? 'button'}
    variant='ghost'
    size='md'
    className={cn(
      'h-auto min-h-9 w-full items-start justify-between whitespace-normal rounded-md border px-3 py-2 text-left text-sm transition-colors',
      selected
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-border/80 bg-card text-foreground hover:border-border',
      className,
    )}
    aria-pressed={selected}
    {...props}
  >
    <span className='flex flex-col leading-tight'>
      <span className='font-semibold'>{title}</span>
      {description && <span className='text-[11px] text-muted-foreground'>{description}</span>}
    </span>
    {selected && <span className='shrink-0 text-[11px] font-semibold'>{selectedLabel}</span>}
  </Button>
)
