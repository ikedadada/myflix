import type { VideoTone } from './video-tone';

export interface GeneratedVideoCopy {
  title: string;
  description: string;
  tone: VideoTone;
  model?: string;
  durationMs?: number;
}

export class GeneratedVideoCopyValidator {
  static TITLE_MAX = 60;
  static DESCRIPTION_MAX = 400;

  static parse(payload: unknown, tone: VideoTone): GeneratedVideoCopy {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid AI payload: not an object');
    }
    const data = payload as Record<string, unknown>;
    const title = data.title;
    const description = data.description;

    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Invalid AI payload: title missing');
    }
    if (title.length > this.TITLE_MAX) {
      throw new Error('Invalid AI payload: title too long');
    }
    if (typeof description !== 'string' || description.trim().length === 0) {
      throw new Error('Invalid AI payload: description missing');
    }
    if (description.length > this.DESCRIPTION_MAX) {
      throw new Error('Invalid AI payload: description too long');
    }

    const model = typeof data.model === 'string' ? data.model : undefined;
    const durationMs =
      typeof data.durationMs === 'number' && Number.isFinite(data.durationMs)
        ? data.durationMs
        : undefined;

    return {
      title: title.trim(),
      description: description.trim(),
      tone,
      model,
      durationMs
    };
  }
}
