import { forwardRef } from 'react';
import { Button as ShadButton, type ButtonProps as ShadButtonProps } from '@/shadcn/ui/button';

type LegacyVariant = 'solid' | 'outline' | 'ghost';
type ButtonVariant = ShadButtonProps['variant'] | LegacyVariant;

type LegacySize = 'md';
type ButtonSize = ShadButtonProps['size'] | LegacySize;

type ButtonProps = Omit<ShadButtonProps, 'variant' | 'size'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantMap: Record<LegacyVariant, ShadButtonProps['variant']> = {
  solid: 'default',
  outline: 'outline',
  ghost: 'ghost'
};

const sizeMap: Record<LegacySize, ShadButtonProps['size']> = {
  md: 'default'
};

const resolveVariant = (variant?: ButtonVariant): ShadButtonProps['variant'] =>
  variantMap[variant as LegacyVariant] ?? (variant as ShadButtonProps['variant']) ?? 'default';

const resolveSize = (size?: ButtonSize): ShadButtonProps['size'] =>
  sizeMap[size as LegacySize] ?? (size as ShadButtonProps['size']) ?? 'default';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', size = 'md', ...props }, ref) => (
    <ShadButton
      ref={ref}
      variant={resolveVariant(variant)}
      size={resolveSize(size)}
      {...props}
    />
  )
);

Button.displayName = 'Button';
