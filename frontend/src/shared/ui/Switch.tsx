import type { ComponentProps } from 'react';
import { Switch as ShadSwitch } from '@/components/ui/switch';

export type SwitchProps = ComponentProps<typeof ShadSwitch>;

export const Switch = (props: SwitchProps) => <ShadSwitch {...props} />;
