import type { UserId } from '@/domain/model/value_object/user-id'

export interface ServiceBindings {
  DB: D1Database
  MEDIA_BUCKET: R2Bucket
  ACCESS_JWKS_URL: string
  ACCESS_JWT_AUD: string
  ACCESS_LOGIN_URL?: string
  GEMINI_API_KEY?: string
  GEMINI_MODEL?: string
  ENV_NAME?: string
}

export interface AuthenticatedUserContext {
  userId: UserId
  email: string
}

export interface ServiceVariables {
  authContext?: AuthenticatedUserContext
}

export type HonoEnv = {
  Bindings: ServiceBindings
  Variables: ServiceVariables
}
