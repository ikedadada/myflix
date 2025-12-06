import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUploadSessions } from '@/shared/hooks/useUploadSessions';
import { formatDate } from '@/shared/lib/format-date';
import { apiClient } from '@/app/config/apiClient';
import { useGenerateVideoCopy } from '@/shared/hooks/useGenerateVideoCopy';
import { Button } from '@/shared/ui/Button';
import type { GeneratedVideoCopy, VideoSummary, VideoTone } from '@/shared/types/video';

export const UploadPage = () => {
  const client = useQueryClient();
  const { data: sessions, create: createUploadSession, creating } = useUploadSessions();
  const {
    generate,
    isGenerating,
    errorMessage: generationError,
    lastResult: generatedCopy
  } = useGenerateVideoCopy();

  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailObjectKey, setThumbnailObjectKey] = useState<string | null>(null);
  const [thumbnailBlob, setThumbnailBlob] = useState<Blob | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [tone, setTone] = useState<VideoTone>('friendly');
  const [userContext, setUserContext] = useState('');
  const [showAiSettings, setShowAiSettings] = useState(false);

  useEffect(() => {
    if (!file) {
      setDurationSeconds(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    videoEl.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      const computed = Math.max(1, Math.round(videoEl.duration || 0));
      setDurationSeconds(computed);
      setTitle((prev) => prev || file.name.replace(/\.[^.]+$/, ''));
    };
    videoEl.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setDurationSeconds(60);
    };
    videoEl.src = objectUrl;
  }, [file]);

  useEffect(() => {
    if (!file || thumbnailFile) return;

    let cancelled = false;
    let url: string | null = null;
    const cleanup = () => {
      if (url) {
        URL.revokeObjectURL(url);
        url = null;
      }
    };

    const capture = async (videoEl: HTMLVideoElement) => {
      const sourceWidth = videoEl.videoWidth || 640;
      const sourceHeight = videoEl.videoHeight || 360;
      const targetWidth = 640;
      const targetHeight = 360; // 16:9
      const targetAspect = targetWidth / targetHeight;
      const sourceAspect = sourceWidth / sourceHeight;

      let sx = 0;
      let sy = 0;
      let sw = sourceWidth;
      let sh = sourceHeight;
      if (sourceAspect > targetAspect) {
        sw = sourceHeight * targetAspect;
        sx = (sourceWidth - sw) / 2;
      } else {
        sh = sourceWidth / targetAspect;
        sy = (sourceHeight - sh) / 2;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unsupported');
      ctx.drawImage(videoEl, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );
      if (!blob) throw new Error('Failed to create thumbnail blob');
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
        setThumbnailPreviewUrl(null);
      }
      setThumbnailError(null);
      setThumbnailBlob(blob);
      setThumbnailObjectKey(null);
      setThumbnailPreviewUrl(URL.createObjectURL(blob));
    };

    const generate = () => {
      const videoEl = document.createElement('video');
      url = URL.createObjectURL(file);
      videoEl.src = url;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.preload = 'auto';
      videoEl.crossOrigin = 'anonymous';

      videoEl.onloadeddata = () => {
        if (cancelled) return;
        videoEl.currentTime = 0.1;
      };
      videoEl.onseeked = async () => {
        if (cancelled) return;
        try {
          await capture(videoEl);
        } catch (error) {
          console.error('Auto thumbnail failed', error);
          setThumbnailError('自動サムネ生成に失敗しました（任意でアップロードしてください）');
        } finally {
          cleanup();
        }
      };
      videoEl.onerror = () => {
        if (cancelled) return;
        setThumbnailError('動画からサムネを生成できませんでした');
        cleanup();
      };
      videoEl.load();
    };

    generate();

    return () => {
      cancelled = true;
      cleanup();
    };
    // regenerate when title changes, unless manual thumbnail is provided
  }, [file, thumbnailFile, title]);

  const uploadAndCreate = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('File is required');
      let thumbKey = thumbnailObjectKey;
      if (!thumbKey && thumbnailBlob) {
        setThumbnailUploading(true);
        const res = await apiClient<{ id: string; objectKey: string; status: string }>(
          '/uploads?kind=thumbnail',
          {
            method: 'POST',
            headers: {
              'Content-Type': thumbnailBlob.type || 'image/png'
            },
            body: thumbnailBlob
          }
        );
        thumbKey = res.objectKey;
        setThumbnailObjectKey(res.objectKey);
        setThumbnailUploading(false);
      }
      const upload = await createUploadSession(file);
      const video = await apiClient<VideoSummary>('/videos', {
        method: 'POST',
        body: JSON.stringify({
          uploadId: upload.id,
          title: title || file.name,
          description: description || 'Uploaded video',
          durationSeconds: durationSeconds ?? 60,
          thumbnailObjectKey: thumbKey
        })
      });
      return { uploadId: upload.id, video };
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['videos'] });
      client.invalidateQueries({ queryKey: ['uploads'] });
      setFile(null);
      setThumbnailBlob(null);
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
        setThumbnailPreviewUrl(null);
      }
      setThumbnailObjectKey(null);
      setThumbnailFile(null);
    }
  });

  const disabled = !file || uploadAndCreate.isPending || creating;
  const selectedName = useMemo(() => file?.name ?? '', [file]);
  const selectedThumbName = useMemo(() => thumbnailFile?.name ?? '', [thumbnailFile]);

  const toneOptions: { value: VideoTone; label: string; note: string }[] = [
    { value: 'friendly', label: 'フレンドリー', note: 'カジュアルで親しみやすい' },
    { value: 'professional', label: 'プロフェッショナル', note: '簡潔でフォーマル' },
    { value: 'playful', label: '遊び心', note: '軽快で楽しい' },
    { value: 'concise', label: '簡潔', note: '短く要点のみ' }
  ];

  const handleGenerate = async () => {
    if (!file) return;
    try {
      const result: GeneratedVideoCopy = await generate({
        file,
        tone,
        language: 'ja',
        userContext: userContext.trim()
      });
      setTitle(result.title);
      setDescription(result.description);
    } catch {
      // エラーメッセージは generationError に表示
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Upload</h1>
        <p className="text-text/70">Upload a video to R2 and register it as a playable item.</p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <label className="flex flex-col gap-2 text-sm">
          Choose a file
          <input
            type="file"
            accept="video/*"
            className="rounded border border-dashed border-border bg-transparent p-6 text-text"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
        <p className="text-sm text-text/60">
          {selectedName
            ? `Detected duration: ${durationSeconds ? `${durationSeconds} sec` : 'Detecting…'}`
            : 'No file selected'}
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <label className="flex flex-col gap-2 text-sm">
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded border border-border bg-card px-3 py-2 text-text"
                placeholder="My video"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded border border-border bg-card px-3 py-2 text-text"
                placeholder="Optional description"
                rows={5}
              />
            </label>

          </div>

          <div className="space-y-3 rounded border border-border bg-card p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
              <span>タイトル/説明をAIで自動生成</span>
              {generatedCopy?.model && (
                <span className="text-xs font-normal text-text/60">model: {generatedCopy.model}</span>
              )}
            </div>
            <button
              type="button"
              className="text-xs text-text/70 underline"
              onClick={() => setShowAiSettings((v) => !v)}
            >
              {showAiSettings ? 'AI設定を隠す' : 'AI設定を表示'}
            </button>
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
                      <div className="flex flex-col items-start leading-tight">
                        <span>{option.label}</span>
                        <span className="text-[11px] text-text/70">{option.note}</span>
                      </div>
                    </Button>
                  ))}
                </div>
                <label className="flex flex-col gap-2 text-sm">
                  用途/ターゲット（任意）
                  <input
                    value={userContext}
                    onChange={(e) => setUserContext(e.target.value)}
                    className="rounded border border-border bg-card px-3 py-2 text-text"
                    placeholder="例: YouTubeショート向け / 学習者向け"
                  />
                </label>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={handleGenerate} disabled={!file || isGenerating} variant="outline">
                {isGenerating ? '生成中…' : 'タイトルと説明を自動生成'}
              </Button>
              {!file && <p className="text-xs text-text/60">先に動画ファイルを選択してください</p>}
            </div>
            {generationError && <p className="text-sm text-red-400">{generationError}</p>}
            {generatedCopy && (
              <p className="text-xs text-text/60">
                生成済み: {toneOptions.find((t) => t.value === generatedCopy.tone)?.label ?? generatedCopy.tone}{' '}
                / {generatedCopy.durationMs ? `${generatedCopy.durationMs}ms` : '—'}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded border border-border bg-card p-3">
          <label className="flex flex-col gap-2 text-sm">
            Thumbnail (optional)
            <input
              type="file"
              accept="image/*"
              className="rounded border border-dashed border-border bg-transparent px-3 py-2 text-text"
              onChange={(event) => {
                setThumbnailFile(event.target.files?.[0] ?? null);
                setThumbnailObjectKey(null);
                const blob = event.target.files?.[0] ?? null;
                setThumbnailBlob(blob);
                if (thumbnailPreviewUrl) {
                  URL.revokeObjectURL(thumbnailPreviewUrl);
                  setThumbnailPreviewUrl(null);
                }
                if (blob) {
                  setThumbnailPreviewUrl(URL.createObjectURL(blob));
                }
              }}
            />
          </label>
          {selectedThumbName && <p className="text-text/60">Selected thumbnail: {selectedThumbName}</p>}
          {thumbnailPreviewUrl && (
            <div className="overflow-hidden rounded border border-border bg-card">
              <img
                src={thumbnailPreviewUrl}
                alt="Thumbnail preview"
                className="w-full max-h-64 object-contain bg-card"
              />
              <p className="px-2 py-1 text-center text-xs text-text/60">
                Preview (resized to 16:9, showing full frame)
              </p>
            </div>
          )}
          {thumbnailObjectKey && (
            <p className="text-xs text-green-400">Thumbnail uploaded: {thumbnailObjectKey}</p>
          )}
          {!thumbnailObjectKey && thumbnailFile && (
            <p className="text-xs text-text/60">Upload the selected image to attach as thumbnail.</p>
          )}
          {thumbnailUploading && (
            <p className="text-xs text-text/60">Generating thumbnail from video…</p>
          )}
          {thumbnailError && <p className="text-xs text-red-400">{thumbnailError}</p>}
        </div>

        <Button disabled={disabled} onClick={() => uploadAndCreate.mutate()}>
          {uploadAndCreate.isPending ? 'Uploading…' : 'Upload & Register'}
        </Button>
        {uploadAndCreate.isError && (
          <p className="text-sm text-red-400">Failed to upload. Please retry.</p>
        )}
        {uploadAndCreate.isSuccess && (
          <p className="text-sm text-green-400">
            Uploaded and registered! Video ID: {uploadAndCreate.data.video.id}
          </p>
        )}
      </div>

      <details className="rounded-lg border border-border bg-card p-3">
        <summary className="cursor-pointer text-lg font-semibold text-text">
          Recent uploads
        </summary>
        <div className="mt-2 space-y-2">
          {sessions && sessions.length === 0 && <p className="text-text/60">No sessions yet.</p>}
          <ul className="space-y-2 text-sm text-text/70">
            {sessions?.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between rounded border border-border px-3 py-2"
              >
                <span className="font-mono text-xs">{session.id.slice(0, 8)}</span>
                <span className="text-text/60">{session.status}</span>
                <span>{formatDate(session.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </section>
  );
};
