export class SessionCache {
  constructor(private readonly kv: KVNamespace) {}

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.kv.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async put<T>(key: string, value: T, expirationTtl = 3600): Promise<void> {
    await this.kv.put(key, JSON.stringify(value), { expirationTtl });
  }
}
