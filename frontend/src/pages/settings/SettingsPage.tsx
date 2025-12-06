import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useSettings } from '@/shared/hooks/useSettings';
import { useToast } from '@/shared/hooks/useToast';
import { useTheme } from '@/app/providers/ThemeProvider';

export const SettingsPage = () => {
  const toast = useToast();
  const { data, isLoading, update, isUpdating } = useSettings();
  const { mode, setMode } = useTheme();
  const [themeMode, setThemeMode] = useState<'auto' | 'light' | 'dark'>('auto');
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (data) {
      setAutoplay(data.autoplay);
    }
  }, [data]);

  useEffect(() => {
    setThemeMode(mode);
  }, [mode]);

  const handleSave = async () => {
    await update({ autoplay });
    toast('Settings saved');
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Settings</h1>
        <p className="text-muted">Preferences map to the backend settings entity.</p>
      </div>
      {isLoading && <p className="text-muted">Loading settings…</p>}
      <div className="space-y-4">
        <div className="space-y-2 rounded-lg border border-border bg-card/80 p-4">
          <label className="flex flex-col gap-2 text-sm text-text">
            Theme (saved on this device)
            <select
              className="rounded border border-border bg-card px-3 py-2 text-text shadow-sm"
              value={themeMode}
              onChange={(event) => {
                const next = event.target.value as typeof themeMode;
                setThemeMode(next);
                setMode(next);
              }}
            >
              <option value="auto">Follow system</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <p className="text-xs text-muted">
            UI theme stays on this browser only. Server-side preferences below remain unaffected.
          </p>
        </div>
        <div className="space-y-3 rounded-lg border border-border bg-card/80 p-4">
          <label className="flex items-center gap-3 text-sm text-text">
            <input type="checkbox" checked={autoplay} onChange={(event) => setAutoplay(event.target.checked)} />
            Autoplay next episode
          </label>
        </div>
      </div>
      <Button className="w-fit" variant="solid" disabled={isUpdating} onClick={handleSave}>
        {isUpdating ? 'Saving…' : 'Save preference'}
      </Button>
    </section>
  );
};
