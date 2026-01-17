import { UploadSession } from "@/domain/model/entity/upload-session";
import { UploadSessionId } from "@/domain/model/value_object/upload-session-id";
import type { UserId } from "@/domain/model/value_object/user-id";
import type { UploadSessionRepository } from "@/domain/repository/upload-session-repository";

export interface UploadFileParams {
  ownerId: UserId;
  data: ArrayBuffer;
  contentType?: string;
  kind?: "video" | "thumbnail";
}

export interface FileUploadService {
  listUploadSessions(ownerId: UserId): Promise<UploadSession[]>;
  uploadFile(params: UploadFileParams): Promise<{ session: UploadSession; objectKey: string }>;
}

export class FileUploadServiceImpl implements FileUploadService {
	constructor(
		private readonly repository: UploadSessionRepository,
		private readonly bucket: R2Bucket,
	) {}

	async listUploadSessions(ownerId: UserId): Promise<UploadSession[]> {
		return this.repository.listByOwner(ownerId);
	}
	
	async uploadFile(params: {
		ownerId: UserId;
		data: ArrayBuffer;
		contentType?: string;
		kind?: "video" | "thumbnail";
	}): Promise<{ session: UploadSession; objectKey: string }> {
		const id = new UploadSessionId(crypto.randomUUID());
		const prefix = params.kind ?? "video";
		const objectKey = `uploads/${params.ownerId.toString()}/${id.toString()}/${prefix}`;

		await this.bucket.put(objectKey, params.data, {
			httpMetadata: params.contentType
				? { contentType: params.contentType }
				: undefined,
		});

		const session = new UploadSession({
			id,
			ownerId: params.ownerId,
			status: "completed",
			createdAt: new Date(),
			objectKey,
		});

		await this.repository.save(session);
		return { session, objectKey };
	}
}
