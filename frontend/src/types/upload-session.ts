export interface UploadSession {
  id: string
  status: string
  createdAt: string
  objectKey: string
}

export interface CreateUploadSessionResponse {
  id: string
  objectKey: string
  status: string
}
