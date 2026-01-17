import type { PlaybackPosition } from "../value_object/playback-position";
import type { UserId } from "../value_object/user-id";
import type { VideoId } from "../value_object/video-id";

export interface PlaybackSessionProps {
	userId: UserId;
	videoId: VideoId;
	lastPosition: PlaybackPosition;
	updatedAt: Date;
}

export class PlaybackSession {
	constructor(private readonly props: PlaybackSessionProps) {}

	userId(): UserId {
		return this.props.userId;
	}

	videoId(): VideoId {
		return this.props.videoId;
	}

	lastPosition(): PlaybackPosition {
		return this.props.lastPosition;
	}

	updatedAt(): Date {
		return this.props.updatedAt;
	}

	touch(position: PlaybackPosition): PlaybackSession {
		return new PlaybackSession({
			...this.props,
			lastPosition: position,
			updatedAt: new Date(),
		});
	}
}
