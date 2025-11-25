import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/ui/Button';
import { useUploadSessions } from '@/shared/hooks/useUploadSessions';
import { formatDate } from '@/shared/lib/format-date';
import { apiClient } from '@/app/config/apiClient';
import type { VideoSummary } from '@/shared/types/video';

export const UploadPage = () => {
  const client = useQueryClient();
  const { data: sessions, create: createUploadSession, creating } = useUploadSessions();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);

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
          durationSeconds: durationSeconds ?? 60
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
