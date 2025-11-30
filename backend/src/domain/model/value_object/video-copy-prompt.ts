import type { VideoTone } from './video-tone';

const toneStyles: Record<VideoTone, string> = {
  friendly: '親しみやすく、歓迎するトーンで、難しい表現は避ける',
  professional: '簡潔でフォーマル、事実に基づくトーンで余計な誇張を避ける',
  playful: '軽快で楽しいトーン、過度に砕けすぎない',
  concise: 'できるだけ短く要点のみを伝えるトーン'
};

export const buildVideoCopyPrompt = (params: {
  tone: VideoTone;
  userContext?: string;
}): string => {
  const context = params.userContext?.trim();
  const style = toneStyles[params.tone];
  const contextLine = context ? `ターゲット/用途: ${context}\n` : '';
  return [
    'あなたは動画のコピーライターです。以下の制約を守って日本語で応答してください:',
    '- title: 60文字以内、クリックしたくなる短いフレーズ',
    '- description: 1〜2文、動画の中身が分かる簡潔な説明',
    '- JSONでのみ出力し、余計なテキストを含めない',
    '- フィールドは title と description のみ',
    `- トーン: ${style}`,
    '',
    contextLine,
    '出力例: {"title":"〇〇","description":"〇〇"}'
  ]
    .filter(Boolean)
    .join('\n');
};
