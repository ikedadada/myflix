import { useId, useState } from 'react';
import { useGenerateVideoCopy } from '@/shared/hooks/useGenerateVideoCopy';
import { Button } from '@/shared/ui';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { UploadFormValues } from '../useUploadForm';
import type { GeneratedVideoCopy, VideoTone } from '@/shared/types/video';

interface AiCopySectionProps {
  file: File | null;
  onApply: (copy: GeneratedVideoCopy) => void;
  register: UseFormRegister<UploadFormValues>;
  errors: FieldErrors<UploadFormValues>;
  userContextValue?: string;
}

export const AiCopySection = ({
  file,
  register,
  errors,
  userContextValue,
  onApply
}: AiCopySectionProps) => {
  const contextId = useId();
  const [tone, setTone] = useState<VideoTone>('friendly');
  const [showAiSettings, setShowAiSettings] = useState(false);
  const {
    generate,
    isGenerating,
    errorMessage: generationError,
    lastResult: generatedCopy
  } = useGenerateVideoCopy();

  const handleGenerate = async () => {
    if (!file) return;
    try {
      const result: GeneratedVideoCopy = await generate({
        file,
        tone,
        language: 'ja',
        userContext: userContextValue?.trim()
      });
      onApply(result);
    } catch {
      // エラーメッセージは generationError に表示
    }
  };

  const toneOptions: { value: VideoTone; label: string; note: string }[] = [
    { value: 'friendly', label: 'フレンドリー', note: 'カジュアルで親しみやすい' },
    { value: 'professional', label: 'プロフェッショナル', note: '簡潔でフォーマル' },
    { value: 'playful', label: '遊び心', note: '軽快で楽しい' },
    { value: 'concise', label: '簡潔', note: '短く要点のみ' }
  ];

  return (
    <div className="space-y-3 rounded border border-border bg-card p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
        <span>タイトル/説明をAIで自動生成</span>
        {generatedCopy?.model && (
          <span className="text-xs font-normal text-muted-foreground">model: {generatedCopy.model}</span>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="px-0 text-xs text-muted-foreground underline"
        onClick={() => setShowAiSettings((v) => !v)}
      >
        {showAiSettings ? 'AI設定を隠す' : 'AI設定を表示'}
      </Button>
      {showAiSettings && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {toneOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={tone === option.value ? 'solid' : 'outline'}
                onClick={() => setTone(option.value)}
                aria-pressed={tone === option.value}
                className="min-w-[120px] justify-start"
              >
                <span className="flex flex-col items-start leading-tight">
                  <span>{option.label}</span>
                  <span className="text-[11px] text-muted-foreground">{option.note}</span>
                </span>
              </Button>
            ))}
          </div>
          <div className="space-y-2 text-sm">
            <label className="text-sm font-medium text-foreground" htmlFor={contextId}>
              用途/ターゲット（任意）
            </label>
            <input
              id={contextId}
              {...register('userContext')}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="例: YouTubeショート向け / 学習者向け"
            />
            {errors.userContext && (
              <p className="text-xs text-danger">{errors.userContext.message}</p>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={handleGenerate} disabled={!file || isGenerating} variant="outline">
          {isGenerating ? '生成中…' : 'タイトルと説明を自動生成'}
        </Button>
        {!file && <p className="text-xs text-muted-foreground">先に動画ファイルを選択してください</p>}
      </div>
      {generationError && <p className="text-sm text-danger">{generationError}</p>}
      {generatedCopy && (
        <p className="text-xs text-muted-foreground">
          生成済み: {toneOptions.find((t) => t.value === generatedCopy.tone)?.label ?? generatedCopy.tone}{' '}
          / {generatedCopy.durationMs ? `${generatedCopy.durationMs}ms` : '—'}
        </p>
      )}
    </div>
  );
};
