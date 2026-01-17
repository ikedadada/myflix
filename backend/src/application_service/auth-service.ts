import { User } from "@/domain/model/entity/user";
import { UserId } from "@/domain/model/value_object/user-id";
import type { UserRepository } from "@/domain/repository/user-repository";
import {
	type AuthenticatedUserContext,
	toUserProfileDto,
	type UserProfileDto,
} from "./dto/user-dto";

export class AuthService {
	constructor(private readonly userRepository: UserRepository) {}

	async resolveUser(
		context: AuthenticatedUserContext,
	): Promise<UserProfileDto> {
		const existing = await this.userRepository.findById(context.userId);
		if (existing) {
			return toUserProfileDto(existing);
		}

		const created = new User({
			id: context.userId,
			email: context.email,
			displayName: context.email.split("@")[0],
			createdAt: new Date(),
		});
		await this.userRepository.save(created);
		return toUserProfileDto(created);
	}

	async findByEmail(email: string): Promise<UserProfileDto | null> {
		const user = await this.userRepository.findByEmail(email);
		return user ? toUserProfileDto(user) : null;
	}

	async getUserProfile(id: string): Promise<UserProfileDto | null> {
		const user = await this.userRepository.findById(new UserId(id));
		return user ? toUserProfileDto(user) : null;
	}
}
