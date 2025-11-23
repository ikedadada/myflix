import type { ServiceBindings, ServiceVariables } from '@/infrastructure/config/env';

export type HonoEnv = {
  Bindings: ServiceBindings;
  Variables: ServiceVariables;
};
