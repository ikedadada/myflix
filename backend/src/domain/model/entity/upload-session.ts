import type { UploadSessionId } from "../value_object/upload-session-id";
import type { UserId } from "../value_object/user-id";

export type UploadSessionStatus =
	| "pending"
	| "processing"
	| "completed"
	| "failed";

export interface UploadSessionProps {
	id: UploadSessionId;
	ownerId: UserId;
	status: UploadSessionStatus;
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

	status(): UploadSessionStatus {
		return this.props.status;
	}

	createdAt(): Date {
		return this.props.createdAt;
	}

	objectKey(): string {
		return this.props.objectKey;
	}

	mark(status: UploadSessionProps["status"]): UploadSession {
		return new UploadSession({ ...this.props, status });
	}
}
