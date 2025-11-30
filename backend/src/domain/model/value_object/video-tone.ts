export const VIDEO_TONES = ['friendly', 'professional', 'playful', 'concise'] as const;

export type VideoTone = (typeof VIDEO_TONES)[number];

export const isVideoTone = (value: unknown): value is VideoTone =>
  typeof value === 'string' && (VIDEO_TONES as readonly string[]).includes(value);
