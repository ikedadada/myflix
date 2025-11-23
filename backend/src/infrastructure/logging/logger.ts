export class Logger {
  constructor(private readonly prefix = 'backend') {}

  info(message: string, extra: Record<string, unknown> = {}): void {
    console.log(`[${this.prefix}] ${message}`, extra);
  }

  error(message: string, extra: Record<string, unknown> = {}): void {
    console.error(`[${this.prefix}] ${message}`, extra);
  }
}
