import { UserId } from '../value_object/user-id';

export interface UserProps {
  id: UserId;
  email: string;
  displayName: string;
  createdAt: Date;
}

export class User {
  constructor(private readonly props: UserProps) {}

  id(): UserId {
    return this.props.id;
  }

  email(): string {
    return this.props.email;
  }

  displayName(): string {
    return this.props.displayName;
  }

  createdAt(): Date {
    return this.props.createdAt;
  }

  updateDisplayName(name: string): User {
    if (!name.trim()) {
      throw new Error('Display name must not be empty');
    }
    return new User({ ...this.props, displayName: name.trim() });
  }
}
