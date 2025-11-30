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
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [tone, setTone] = useState<VideoTone>('friendly');
  const [userContext, setUserContext] = useState('');

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
    if (!file || thumbnailFile || thumbnailObjectKey) return;

    let cancelled = false;
    let url: string | null = null;
    const cleanup = () => {
      if (url) {
        URL.revokeObjectURL(url);
        url = null;
      }
    };

    const captureAndUpload = async (videoEl: HTMLVideoElement) => {
      const width = videoEl.videoWidth || 640;
      const height = videoEl.videoHeight || 360;
      const targetWidth = 640;
      const targetHeight = Math.round((height / width) * targetWidth) || 360;
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unsupported');
      ctx.drawImage(videoEl, 0, 0, targetWidth, targetHeight);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );
      if (!blob) throw new Error('Failed to create thumbnail blob');
      setThumbnailUploading(true);
      setThumbnailError(null);
      const res = await apiClient<{ id: string; objectKey: string; status: string }>(
        '/uploads?kind=thumbnail',
        {
          method: 'POST',
          headers: {
            'Content-Type': blob.type || 'image/png'
          },
          body: blob
        }
      );
      setThumbnailObjectKey(res.objectKey);
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
        // Seek a bit forward to avoid blank frame
        videoEl.currentTime = 0.1;
      };
      videoEl.onseeked = async () => {
        if (cancelled) return;
        try {
          await captureAndUpload(videoEl);
        } catch (error) {
          console.error('Auto thumbnail failed', error);
          setThumbnailError('自動サムネ生成に失敗しました（任意でアップロードしてください）');
        } finally {
          setThumbnailUploading(false);
          cleanup();
        }
      };
      videoEl.onerror = () => {
        if (cancelled) return;
        setThumbnailError('動画からサムネを生成できませんでした');
        setThumbnailUploading(false);
        cleanup();
      };
      videoEl.load();
    };

    generate();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [file, thumbnailFile, thumbnailObjectKey]);

  const uploadAndCreate = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('File is required');
      const upload = await createUploadSession(file);
      const video = await apiClient<VideoSummary>('/videos', {
        method: 'POST',
        body: JSON.stringify({
          uploadId: upload.id,
          title: title || file.name,
          description: description || 'Uploaded video',
          durationSeconds: durationSeconds ?? 60,
          thumbnailObjectKey: thumbnailObjectKey
        })
      });
      return { uploadId: upload.id, video };
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['videos'] });
      client.invalidateQueries({ queryKey: ['uploads'] });
      setFile(null);
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
        <p className="text-white/70">Upload a video to R2 and register it as a playable item.</p>
      </div>

      <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
        <label className="flex flex-col gap-2 text-sm">
          Choose a file
          <input
            type="file"
            accept="video/*"
            className="rounded border border-dashed border-white/30 bg-transparent p-6 text-white"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
        {selectedName && <p className="text-white/60">Selected: {selectedName}</p>}

        <div className="space-y-3 rounded border border-white/10 bg-white/5 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
            <span>タイトル/説明をAIで自動生成</span>
            {generatedCopy?.model && (
              <span className="text-xs font-normal text-white/60">
                model: {generatedCopy.model}
              </span>
            )}
          </div>
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
                  <span className="text-[11px] text-white/70">{option.note}</span>
                </div>
              </Button>
            ))}
          </div>
          <label className="flex flex-col gap-2 text-sm">
            用途/ターゲット（任意）
            <input
              value={userContext}
              onChange={(e) => setUserContext(e.target.value)}
              className="rounded border border-white/20 bg-white/5 px-3 py-2 text-white"
              placeholder="例: YouTubeショート向け / 学習者向け"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={!file || isGenerating}
              variant="outline"
            >
              {isGenerating ? '生成中…' : 'タイトルと説明を自動生成'}
            </Button>
            {!file && <p className="text-xs text-white/60">先に動画ファイルを選択してください</p>}
          </div>
          {generationError && <p className="text-sm text-red-400">{generationError}</p>}
          {generatedCopy && (
            <p className="text-xs text-white/60">
              生成済み: {toneOptions.find((t) => t.value === generatedCopy.tone)?.label ?? generatedCopy.tone}{' '}
              / {generatedCopy.durationMs ? `${generatedCopy.durationMs}ms` : '—'}
            </p>
          )}
        </div>

        <label className="flex flex-col gap-2 text-sm">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded border border-white/20 bg-white/5 px-3 py-2 text-white"
            placeholder="My video"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded border border-white/20 bg-white/5 px-3 py-2 text-white"
            placeholder="Optional description"
            rows={3}
          />
        </label>

        <p className="text-sm text-white/60">
          Detected duration: {durationSeconds ? `${durationSeconds} sec` : 'Detecting…'}
        </p>

        <div className="space-y-3 rounded border border-white/10 bg-white/5 p-3">
          <label className="flex flex-col gap-2 text-sm">
            Thumbnail (optional)
            <input
              type="file"
              accept="image/*"
              className="rounded border border-dashed border-white/30 bg-transparent px-3 py-2 text-white"
              onChange={(event) => {
                setThumbnailFile(event.target.files?.[0] ?? null);
                setThumbnailObjectKey(null);
              }}
            />
          </label>
          {selectedThumbName && <p className="text-white/60">Selected thumbnail: {selectedThumbName}</p>}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!thumbnailFile}
            onClick={async () => {
              if (!thumbnailFile) return;
              try {
                const res = await apiClient<{ id: string; objectKey: string; status: string }>(
                  '/uploads?kind=thumbnail',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': thumbnailFile.type || 'application/octet-stream'
                    },
                    body: thumbnailFile
                  }
                );
                setThumbnailObjectKey(res.objectKey);
              } catch (error) {
                console.error('Thumbnail upload failed', error);
                setThumbnailObjectKey(null);
              }
            }}
          >
            Upload thumbnail image
          </Button>
          {thumbnailObjectKey && (
            <p className="text-xs text-green-400">Thumbnail uploaded: {thumbnailObjectKey}</p>
          )}
          {!thumbnailObjectKey && thumbnailFile && (
            <p className="text-xs text-white/60">Upload the selected image to attach as thumbnail.</p>
          )}
          {thumbnailUploading && (
            <p className="text-xs text-white/60">Generating thumbnail from video…</p>
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

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Recent uploads</h2>
        {sessions && sessions.length === 0 && <p className="text-white/60">No sessions yet.</p>}
        <ul className="space-y-2 text-sm text-white/70">
          {sessions?.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between rounded border border-white/10 px-3 py-2"
            >
              <span className="font-mono text-xs">{session.id.slice(0, 8)}</span>
              <span className="text-white/60">{session.status}</span>
              <span>{formatDate(session.createdAt)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
