import { useMemo } from 'react';
import { useUploadSessions } from '@/shared/hooks/useUploadSessions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, CardTitle } from '@/shared/ui';
import { formatDate } from '@/shared/lib/format-date';

export const RecentUploadsAccordion = () => {
  const { data: sessions, isLoading } = useUploadSessions();
  const items = useMemo(() => sessions ?? [], [sessions]);

  return (
    <Accordion type="single" collapsible className="rounded-xl border border-border bg-card/80">
      <AccordionItem value="recent">
        <AccordionTrigger className="px-4 py-3 text-lg font-semibold text-foreground">
          <div className="flex w-full items-center justify-between gap-2">
            <CardTitle className="text-lg">Recent uploads</CardTitle>
            <span className="text-sm font-normal text-muted-foreground">Latest upload sessions</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-2 border-t border-border px-4 py-3">
          {isLoading && <p className="text-muted-foreground">Loading…</p>}
          {!isLoading && items.length === 0 && <p className="text-muted-foreground">No sessions yet.</p>}
          <ul className="space-y-2 text-sm text-muted-foreground">
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
