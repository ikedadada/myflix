export class SettingsId {
  private readonly value: string

  constructor(value: string) {
    if (!value || !value.trim()) {
      throw new Error('SettingsId must not be empty')
    }
    this.value = value
  }

  toString(): string {
    return this.value
  }
}
