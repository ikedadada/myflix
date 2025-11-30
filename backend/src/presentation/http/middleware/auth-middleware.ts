import type { AccessAuthProvider } from '@/infrastructure/external/auth-provider-impl';
import type { MiddlewareHandler } from 'hono';
import type { HonoEnv } from '../hono-env';

export const createAuthMiddleware = (
  factory: (env: HonoEnv['Bindings']) => AccessAuthProvider
): MiddlewareHandler<HonoEnv> => {
  let provider: AccessAuthProvider | null = null;
  return async (c, next) => {
    const envName = c.env.ENV_NAME;
    if (envName === 'local') {
      // Local環境では認証をスキップし、デフォルトユーザーで処理する
      c.set('authContext', {
        userId: { toString: () => 'local-user' },
        email: 'local@example.com'
      } as never);
      await next();
      return;
    }

    const token = c.req.header('cf-access-jwt-assertion');
    if (!token) {
      return c.json({ message: 'Missing Access token' }, 401);
    }
    try {
      if (!provider) {
        provider = factory(c.env);
      }
      c.set('authContext', await provider.verify(token));
      await next();
    } catch (error) {
      console.error('Auth middleware error', error);
      return c.json({ message: 'Unauthorized' }, 401);
    }
  };
};
