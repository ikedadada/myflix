import type { ComponentProps } from 'react';
import { Input as ShadInput } from '@/components/ui/input';

export type InputProps = ComponentProps<typeof ShadInput>;

export const Input = (props: InputProps) => <ShadInput {...props} />;
