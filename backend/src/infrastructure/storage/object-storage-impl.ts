export class R2ObjectStorage {
  constructor(private readonly bucket: R2Bucket) {}

  async putObject(key: string, body: ReadableStream | ArrayBuffer | string): Promise<void> {
    await this.bucket.put(key, body)
  }

  async getObject(key: string): Promise<R2Object | null> {
    return this.bucket.get(key)
  }
}
