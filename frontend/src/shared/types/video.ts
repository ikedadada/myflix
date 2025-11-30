export interface VideoSummary {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  objectKey: string;
  thumbnailUrl: string | null;
}

export type VideoTone = 'friendly' | 'professional' | 'playful' | 'concise';

export interface GeneratedVideoCopy {
  title: string;
  description: string;
  tone: VideoTone;
  model?: string;
  durationMs?: number;
}
