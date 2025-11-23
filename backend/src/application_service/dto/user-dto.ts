import { User } from '@/domain/model/entity/user';
import { UserId } from '@/domain/model/value_object/user-id';

export interface UserProfileDto {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface AuthenticatedUserContext {
  userId: UserId;
  email: string;
}

export const toUserProfileDto = (user: User): UserProfileDto => ({
  id: user.id().toString(),
  email: user.email(),
  displayName: user.displayName(),
  createdAt: user.createdAt().toISOString()
});
