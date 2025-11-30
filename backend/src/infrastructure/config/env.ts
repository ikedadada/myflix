import type { AuthenticatedUserContext } from '@/application_service/dto/user-dto';

export interface ServiceBindings {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  ACCESS_JWKS_URL: string;
  ACCESS_JWT_AUD: string;
  CORS_ALLOWED_ORIGINS?: string;
  ACCESS_LOGIN_URL?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
}

export interface ServiceVariables {
  authContext?: AuthenticatedUserContext;
}

export type AppEnv = {
  Bindings: ServiceBindings;
  Variables: ServiceVariables;
};
