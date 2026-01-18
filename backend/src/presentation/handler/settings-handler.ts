import type { Context } from "hono";
import { SettingsNotFoundError, type SettingsService } from "@/application_service/settings-service";
import type { HonoEnv } from "@/env";

export class SettingsHandler {
	constructor(private readonly settingsService: SettingsService) {}

	get = async (c: Context<HonoEnv>) => {
		const authContext = c.var.authContext;
		if (!authContext) {
			return c.json({ message: "Unauthorized" }, 401);
		}
		const settings = await this.settingsService.findOrProvisionSettings(authContext.userId);
		return c.json({
				id: settings.id().toString(),
				ownerId: authContext.userId.toString(),
				autoplay: settings.autoplay(),
			},
		);
	};

	update = async (c: Context<HonoEnv>) => {
		const authContext = c.var.authContext;
		if (!authContext) {
			return c.json({ message: "Unauthorized" }, 401);
		}
		const body = await c.req.json<{ autoplay: boolean }>();
    try {
      const updated = await this.settingsService.updateSettings(authContext.userId, {
        autoplay: body.autoplay,
      });
      return c.json({
        id: updated.id().toString(),
        ownerId: authContext.userId.toString(),
        autoplay: updated.autoplay(),
      });
    } catch (error) {
      if (error instanceof SettingsNotFoundError) {
        return c.json({ message: "Settings not found" }, 404);
      }
      throw error;
    }
	};
}
