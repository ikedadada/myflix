import type { Context } from "hono";
import type { AuthService } from "@/application_service/auth-service";
import type { HonoEnv } from "@/env";

export class AuthHandler {
	constructor(private readonly authService: AuthService) {}

	me = async (c: Context<HonoEnv>) => {
		const authContext = c.var.authContext;
		if (!authContext) {
			return c.json({ message: "Unauthorized" }, 401);
		}
		const profile = await this.authService.resolveUser(authContext);
		return c.json({
      id: profile.id().toString(),
      email: profile.email(),
      displayName: profile.displayName(),
      createdAt: profile.createdAt().toISOString(),
    });
	};

	callback = async (c: Context<HonoEnv>) => {
		const next = c.req.query("next") ?? "/";
		return c.redirect(next, 302);
	};
}
