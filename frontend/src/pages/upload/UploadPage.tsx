import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useUploadSessions } from '@/shared/hooks/useUploadSessions';
import { formatDate } from '@/shared/lib/format-date';

export const UploadPage = () => {
  const { data, create, creating } = useUploadSessions();
  const [fileName, setFileName] = useState<string>('');

  const handleCreate = async () => {
    await create();
    setFileName('');
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Upload</h1>
        <p className="text-white/70">Creates Cloudflare R2 upload sessions via the backend API.</p>
      </div>
      <label className="flex flex-col gap-2 text-sm">
        Choose a file
        <input
          type="file"
          className="rounded border border-dashed border-white/30 bg-transparent p-6 text-white"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
        />
      </label>
      {fileName && <p className="text-white/60">Selected: {fileName}</p>}
      <Button disabled={!fileName || creating} onClick={handleCreate}>
        {creating ? 'Creating…' : 'Create upload session'}
      </Button>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Recent sessions</h2>
        {data && data.length === 0 && <p className="text-white/60">No sessions yet.</p>}
        <ul className="space-y-2 text-sm text-white/70">
          {data?.map((session) => (
            <li key={session.id} className="flex items-center justify-between rounded border border-white/10 px-3 py-2">
              <span>{session.status}</span>
              <span>{formatDate(session.createdAt)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
