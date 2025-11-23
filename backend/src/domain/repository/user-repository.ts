import { User } from '../model/entity/user';
import { UserId } from '../model/value_object/user-id';

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
