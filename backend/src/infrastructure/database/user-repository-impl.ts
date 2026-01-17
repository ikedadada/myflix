import { User } from "@/domain/model/entity/user";
import { UserId } from "@/domain/model/value_object/user-id";
import type { UserRepository } from "@/domain/repository/user-repository";

interface UserRow {
	id: string;
	email: string;
	display_name: string;
	created_at: string;
}

const mapRowToUser = (row: UserRow): User =>
	new User({
		id: new UserId(row.id),
		email: row.email,
		displayName: row.display_name,
		createdAt: new Date(row.created_at),
	});

export class D1UserRepository implements UserRepository {
	constructor(private readonly db: D1Database) {}

	async findById(id: UserId): Promise<User | null> {
		const result = await this.db
			.prepare(
				"SELECT id, email, display_name, created_at FROM users WHERE id = ?1",
			)
			.bind(id.toString())
			.first<UserRow>();
		return result ? mapRowToUser(result) : null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const result = await this.db
			.prepare(
				"SELECT id, email, display_name, created_at FROM users WHERE email = ?1",
			)
			.bind(email)
			.first<UserRow>();
		return result ? mapRowToUser(result) : null;
	}

	async save(user: User): Promise<void> {
		await this.db
			.prepare(
				"INSERT OR REPLACE INTO users (id, email, display_name, created_at) VALUES (?1, ?2, ?3, ?4)",
			)
			.bind(
				user.id().toString(),
				user.email(),
				user.displayName(),
				user.createdAt().toISOString(),
			)
			.run();
	}
}
