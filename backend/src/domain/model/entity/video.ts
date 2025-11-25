import { VideoId } from '../value_object/video-id';
import { UserId } from '../value_object/user-id';

export interface VideoProps {
  id: VideoId;
  ownerId: UserId;
  title: string;
  description: string;
  durationSeconds: number;
  createdAt: Date;
  objectKey: string;
}

export class Video {
  constructor(private readonly props: VideoProps) {
    if (props.durationSeconds <= 0) {
      throw new Error('Video duration must be positive');
    }
  }

  id(): VideoId {
    return this.props.id;
  }

  ownerId(): UserId {
    return this.props.ownerId;
  }

  title(): string {
    return this.props.title;
  }

  description(): string {
    return this.props.description;
  }

  durationSeconds(): number {
    return this.props.durationSeconds;
  }

  createdAt(): Date {
    return this.props.createdAt;
  }

  objectKey(): string {
    return this.props.objectKey;
  }
}
