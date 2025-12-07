import type { ComponentProps } from 'react';
import { Textarea as ShadTextarea } from '@/components/ui/textarea';

export type TextareaProps = ComponentProps<typeof ShadTextarea>;

export const Textarea = (props: TextareaProps) => <ShadTextarea {...props} />;
