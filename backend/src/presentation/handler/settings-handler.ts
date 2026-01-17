import type { Context } from 'hono';
import type { HonoEnv } from '../hono-env';
import { SettingsService } from '@/application_service/settings-service';
import { Settings } from '@/domain/model/entity/settings';
import { SettingsId } from '@/domain/model/value_object/settings-id';

export class SettingsHandler {
  constructor(private readonly settingsService: SettingsService) {}

  get = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const settings = await this.settingsService.findByOwner(authContext.userId);
    return c.json(
      settings ?? {
        id: `settings-${authContext.userId.toString()}`,
        ownerId: authContext.userId.toString(),
        autoplay: true
      }
    );
  };

  update = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const body = await c.req.json<{ autoplay: boolean }>();
    const settings = new Settings({
      id: new SettingsId(`settings-${authContext.userId.toString()}`),
      ownerId: authContext.userId,
      autoplay: body.autoplay
    });
    const updated = await this.settingsService.update(settings);
    return c.json(updated);
  };
}
