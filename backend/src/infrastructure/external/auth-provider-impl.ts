import { createRemoteJWKSet, type JWTVerifyResult, jwtVerify } from 'jose'
import { UserId } from '@/domain/model/value_object/user-id'
import type { AuthenticatedUserContext } from '@/env'

export class AccessAuthProvider {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>

  constructor(
    jwksUrl: string,
    private readonly audience: string,
  ) {
    this.jwks = createRemoteJWKSet(new URL(jwksUrl))
  }

  async verify(token: string): Promise<AuthenticatedUserContext> {
    const result: JWTVerifyResult = await jwtVerify(token, this.jwks, {
      audience: this.audience,
    })

    const email = typeof result.payload.email === 'string' ? result.payload.email : undefined
    const subject = (result.payload.sub as string | undefined) ?? email
    if (!subject || !email) {
      throw new Error('Invalid Access token payload')
    }

    return {
      userId: new UserId(subject),
      email,
    }
  }
}
