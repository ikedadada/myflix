import { useMemo } from 'react';
import { useUploadSessions } from '@/shared/hooks/useUploadSessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { formatDate } from '@/shared/lib/format-date';

export const RecentUploadsAccordion = () => {
  const { data: sessions, isLoading } = useUploadSessions();
  const items = useMemo(() => {
    const sorted = [...(sessions ?? [])].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted.slice(0, 20);
  }, [sessions]);

  return (
    <Card className="border-border/80">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent</p>
          <CardTitle className="text-lg">Recent uploads (latest 20)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0 text-sm text-muted-foreground">
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {!isLoading && items.length === 0 && <p className="text-muted-foreground">No sessions yet.</p>}
        <ul className="space-y-2">
          {items.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between rounded border border-border px-3 py-2"
            >
              <span className="font-mono text-xs">{session.id.slice(0, 8)}</span>
              <span>{session.status}</span>
              <span>{formatDate(session.createdAt)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
