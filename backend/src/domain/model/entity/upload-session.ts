import { UploadSessionId } from '../value_object/upload-session-id';
import { UserId } from '../value_object/user-id';

export interface UploadSessionProps {
  id: UploadSessionId;
  ownerId: UserId;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  objectKey: string;
}

export class UploadSession {
  constructor(private readonly props: UploadSessionProps) {}

  id(): UploadSessionId {
    return this.props.id;
  }

  ownerId(): UserId {
    return this.props.ownerId;
  }

  status(): UploadSessionProps['status'] {
    return this.props.status;
  }

  createdAt(): Date {
    return this.props.createdAt;
  }

  objectKey(): string {
    return this.props.objectKey;
  }

  mark(status: UploadSessionProps['status']): UploadSession {
    return new UploadSession({ ...this.props, status });
  }
}
