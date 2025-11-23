import type { AuthenticatedUserContext } from '@/application_service/dto/user-dto';

export interface ServiceBindings {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  SESSION_KV: KVNamespace;
  ACCESS_JWKS_URL: string;
  ACCESS_JWT_AUD: string;
}

export interface ServiceVariables {
  authContext?: AuthenticatedUserContext;
}

export type AppEnv = {
  Bindings: ServiceBindings;
  Variables: ServiceVariables;
};
