export interface Logger {
  info(message: string, extra?: Record<string, unknown>): void
  error(message: string, extra?: Record<string, unknown>): void
}

export class LoggerImpl implements Logger {
  constructor(private readonly prefix = 'backend') {}

  info(message: string, extra: Record<string, unknown> = {}): void {
    console.log(`[${this.prefix}] ${message}`, extra)
  }

  error(message: string, extra: Record<string, unknown> = {}): void {
    console.error(`[${this.prefix}] ${message}`, extra)
  }
}
