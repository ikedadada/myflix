export class PlaybackPosition {
  private readonly seconds: number;

  constructor(seconds: number) {
    if (seconds < 0) {
      throw new Error('Playback position cannot be negative');
    }
    this.seconds = Math.floor(seconds);
  }

  value(): number {
    return this.seconds;
  }
}
