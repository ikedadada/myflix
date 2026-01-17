import type { Hono } from 'hono';
import type { HonoEnv } from "@/env";

export const registerErrorHandler = (app: Hono<HonoEnv>): void => {
  app.onError((err, c) => {
    console.error('Unhandled error', err);
    return c.json({ message: 'Internal Server Error' }, 500);
  });
};
