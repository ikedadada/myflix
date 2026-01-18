import { User } from "@/domain/model/entity/user";
import type { UserRepository } from "@/domain/repository/user-repository";
import type { AuthenticatedUserContext } from "@/env";

export type AuthService = {
  findOrProvisionUser(context: AuthenticatedUserContext): Promise<User>;
};

export class AuthServiceImpl implements AuthService {
	constructor(private readonly userRepository: UserRepository) {}

	async findOrProvisionUser(
		context: AuthenticatedUserContext,
	): Promise<User> {
		const existing = await this.userRepository.findById(context.userId);
		if (existing) {
			return existing;
		}

		const initialUser = new User({
			id: context.userId,
			email: context.email,
			displayName: context.email.split("@")[0],
			createdAt: new Date(),
		});
		await this.userRepository.save(initialUser);
		return initialUser;
	}
}
