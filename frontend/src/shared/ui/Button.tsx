import { forwardRef } from 'react';
import { Button as ShadButton, type ButtonProps as ShadButtonProps } from '@/components/ui/button';

type LegacyVariant = 'solid' | 'outline' | 'ghost';
type LegacySize = 'sm' | 'md' | 'lg';

type ButtonProps = Omit<ShadButtonProps, 'variant' | 'size'> & {
  variant?: LegacyVariant;
  size?: LegacySize;
};

const variantMap: Record<LegacyVariant, ShadButtonProps['variant']> = {
  solid: 'default',
  outline: 'outline',
  ghost: 'ghost'
};

const sizeMap: Record<LegacySize, ShadButtonProps['size']> = {
  sm: 'sm',
  md: 'default',
  lg: 'lg'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', size = 'md', ...props }, ref) => (
    <ShadButton ref={ref} variant={variantMap[variant]} size={sizeMap[size]} {...props} />
  )
);

Button.displayName = 'Button';
